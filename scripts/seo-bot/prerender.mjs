/**
 * Post-build prerenderer.
 *
 * The site is a client-rendered Vite SPA: without this step every URL serves
 * the same empty shell, which is the #1 ranking blocker (see SEO_ROADMAP.md).
 * This script serves dist/ locally, renders every known route with headless
 * Chrome, and writes the fully rendered HTML back into dist/ so Vercel serves
 * real static HTML (filesystem matches win before the SPA rewrite).
 *
 * Usage: node scripts/seo-bot/prerender.mjs   (after `vite build`)
 * Env:   PRERENDER_OPTIONAL=1  → exit 0 instead of 1 when Chrome can't launch
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { collectAllRoutes, ROOT } from './lib.mjs';

const DIST = path.join(ROOT, 'dist');
const CONCURRENCY = 4;
const NOT_FOUND_TITLE = 'Page Not Found';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain',
  '.xml': 'application/xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

function serveDist() {
  const shell = fs.readFileSync(path.join(DIST, 'index.html'));
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const filePath = path.join(DIST, urlPath.replaceAll('/', path.sep));
    if (filePath.startsWith(DIST) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA fallback — always the pristine shell, even after routes are prerendered
      res.setHeader('Content-Type', 'text/html');
      res.end(shell);
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function renderRoute(browser, origin, route, shellTitle, foreground = false) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 900 });
    // Skip service-worker registration and external ad/analytics calls during prerender
    await page.setBypassServiceWorker?.(true).catch?.(() => {});
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const u = req.url();
      if (u.includes('googletagmanager') || u.includes('google-analytics') || u.includes('googlesyndication')) {
        req.abort();
      } else {
        req.continue();
      }
    });

    if (foreground) await page.bringToFront();
    await page.goto(origin + route, { waitUntil: 'networkidle0', timeout: 45000 });
    await page.waitForFunction(
      () => document.querySelector('#root') && document.querySelector('#root').children.length > 0,
      { timeout: 15000 }
    );
    // Wait for react-helmet to swap the title (every page has a unique one);
    // tolerate timeout for the homepage, whose title may match the shell
    if (shellTitle) {
      await page
        .waitForFunction((t) => document.title && document.title !== t, { timeout: 10000 }, shellTitle)
        .catch(() => {});
    }
    // Let helmet finish swapping the remaining meta tags
    await new Promise((r) => setTimeout(r, 500));

    const { html, title } = await page.evaluate(() => {
      // Drop static head tags that react-helmet has replaced (avoid duplicates)
      const managed = ['description', 'keywords', 'author'];
      for (const name of managed) {
        const helmetTag = document.head.querySelector(`meta[name="${name}"][data-rh]`);
        if (helmetTag) {
          document.head
            .querySelectorAll(`meta[name="${name}"]:not([data-rh])`)
            .forEach((el) => el.remove());
        }
      }
      const helmetOg = document.head.querySelectorAll('meta[property^="og:"][data-rh]');
      if (helmetOg.length > 0) {
        const props = new Set([...helmetOg].map((el) => el.getAttribute('property')));
        document.head
          .querySelectorAll('meta[property^="og:"]:not([data-rh])')
          .forEach((el) => props.has(el.getAttribute('property')) && el.remove());
      }
      // Never let the service worker resurrect a stale shell on prerendered pages
      document
        .querySelectorAll('script')
        .forEach((s) => s.textContent?.includes('serviceWorker.register') && s.remove());
      return { html: '<!DOCTYPE html>' + document.documentElement.outerHTML, title: document.title };
    });

    return { route, html, title };
  } finally {
    await page.close();
  }
}

function outFileFor(route) {
  if (route === '/') return path.join(DIST, 'index.html');
  const clean = route.replace(/^\/+|\/+$/g, '');
  return path.join(DIST, ...clean.split('/'), 'index.html');
}

async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch (e) {
    console.error('puppeteer not installed:', e.message);
    process.exit(process.env.PRERENDER_OPTIONAL ? 0 : 1);
  }

  const routes = collectAllRoutes({ publishedOnly: true }).filter((r) => r.prerender !== false);
  const server = await serveDist();
  const origin = `http://127.0.0.1:${server.address().port}`;
  console.log(`Prerendering ${routes.length} routes from ${origin} ...`);

  const launchOptions = () => ({
    headless: 'new',
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        // react-helmet applies tags via rAF; these keep rAF alive on background tabs
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
  });

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions());
  } catch (firstError) {
    // Self-heal: CI package managers (e.g. bun on Vercel) skip puppeteer's
    // Chrome-download postinstall. Install it now and retry once.
    console.warn('Chrome not found — installing via `npx puppeteer browsers install chrome` ...');
    try {
      execSync('npx puppeteer browsers install chrome', { stdio: 'inherit' });
      browser = await puppeteer.launch(launchOptions());
    } catch (e) {
      console.error('Could not launch Chrome even after installing.');
      console.error('First error:', firstError.message);
      console.error('Retry error:', e.message);
      server.close();
      process.exit(process.env.PRERENDER_OPTIONAL ? 0 : 1);
    }
  }

  const failed = [];
  const skipped = [];
  const done = [];
  const needsRetry = [];
  const shellTitle = /<title>([^<]*)<\/title>/.exec(
    fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')
  )?.[1];

  const queue = [...routes];
  async function worker() {
    while (queue.length > 0) {
      const { path: route } = queue.shift();
      try {
        const { html, title } = await renderRoute(browser, origin, route, route === '/' ? null : shellTitle);
        if (title.includes(NOT_FOUND_TITLE)) {
          skipped.push(route); // route not wired up yet — warn, don't fail the build
          console.warn(`  SKIP (renders 404): ${route}`);
          continue;
        }
        if (route !== '/' && title === shellTitle) {
          needsRetry.push(route);
          continue;
        }
        const out = outFileFor(route);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, html, 'utf-8');
        done.push(route);
      } catch (e) {
        failed.push(route);
        console.error(`  FAIL: ${route} — ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Sequential foreground retry for pages whose helmet tags didn't flush
  // under concurrency (headless background-tab throttling)
  for (const route of needsRetry) {
    try {
      const { html, title } = await renderRoute(browser, origin, route, shellTitle, true);
      if (title === shellTitle) {
        console.warn(`  WARN (title still unchanged after retry): ${route}`);
      }
      const out = outFileFor(route);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, html, 'utf-8');
      done.push(route);
      console.log(`  RETRY ok: ${route}`);
    } catch (e) {
      failed.push(route);
      console.error(`  RETRY FAIL: ${route} — ${e.message}`);
    }
  }

  // Static 404 page with noindex
  try {
    const { html } = await renderRoute(browser, origin, '/__seo_bot_404__', shellTitle);
    fs.writeFileSync(
      path.join(DIST, '404.html'),
      html.replace('</head>', '<meta name="robots" content="noindex"></head>'),
      'utf-8'
    );
    console.log('  wrote dist/404.html (noindex)');
  } catch (e) {
    console.warn('  could not write 404.html:', e.message);
  }

  await browser.close();
  server.close();

  console.log(`\nPrerender complete: ${done.length} ok, ${skipped.length} skipped, ${failed.length} failed`);
  if (failed.length > 0) {
    console.error('Failed routes:', failed.join(', '));
    process.exit(1);
  }
}

main();
