/**
 * Automatic Sitemap Generator
 *
 * Builds sitemap.xml from the three page sources (kept in sync with
 * scripts/seo-bot/lib.mjs, which the prerenderer uses):
 *   1. scripts/seo-bot/routes.json      — static routes
 *   2. src/data/blog/blog-posts.json    — blog posts (minus broken/duplicate slugs)
 *   3. src/data/programmatic/manifest.json — published programmatic pages
 *
 * Usage: node scripts/generateSitemap.cjs [--out <file>]
 *   default output: public/sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://fintoolslab.com';
const TODAY = new Date().toISOString().split('T')[0];

// Slugs with no backing content (soft-404s) — never emit
const BROKEN_BLOG_SLUGS = new Set([
  'loan-calculator-comparison-2025',
  'rent-vs-buy-calculator-comparison',
  'retirement-calculator-for-millennials',
]);

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return fallback;
  }
}

// 1. Static routes
const { routes: staticRoutes } = readJson(
  path.join(__dirname, 'seo-bot', 'routes.json'),
  { routes: [] }
);

// 2. Blog posts
const blogPosts = readJson(path.join(__dirname, '../src/data/blog/blog-posts.json'), []);
const blogSlugs = new Set(blogPosts.map((p) => p.slug));
const blogRoutes = blogPosts
  .filter((p) => !BROKEN_BLOG_SLUGS.has(p.slug))
  // Drop 2025 posts whose 2026 twin exists (301-redirected in vercel.json)
  .filter((p) => {
    const twin = p.slug.replace(/-2025-/, '-2026-');
    return twin === p.slug || !blogSlugs.has(twin);
  })
  .map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.publishDate || TODAY,
    changefreq: 'monthly',
    priority: post.featured ? 0.9 : 0.7,
  }));

// 3. Published programmatic pages
const manifest = readJson(
  path.join(__dirname, '../src/data/programmatic/manifest.json'),
  { pages: [] }
);
const programmaticRoutes = manifest.pages
  .filter((p) => p.published)
  .map((p) => ({ path: p.path, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 }));

const allRoutes = [...staticRoutes, ...blogRoutes, ...programmaticRoutes];

const generateSitemapXML = (routes) => {
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${route.lastmod || TODAY}</lastmod>
    <changefreq>${route.changefreq || 'monthly'}</changefreq>
    <priority>${route.priority != null ? route.priority : 0.7}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

const outFlagIndex = process.argv.indexOf('--out');
const sitemapPath =
  outFlagIndex !== -1 && process.argv[outFlagIndex + 1]
    ? path.resolve(process.argv[outFlagIndex + 1])
    : path.join(__dirname, '../public/sitemap.xml');

fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });
fs.writeFileSync(sitemapPath, generateSitemapXML(allRoutes), 'utf-8');

console.log('✅ Sitemap generated successfully!');
console.log(`📄 Total URLs: ${allRoutes.length}`);
console.log(`   - Static pages: ${staticRoutes.length}`);
console.log(`   - Blog posts: ${blogRoutes.length}`);
console.log(`   - Programmatic pages: ${programmaticRoutes.length}`);
console.log(`📁 Location: ${sitemapPath}`);
