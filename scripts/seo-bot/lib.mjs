/**
 * Shared helpers for the SEO bot: URL collection from the three page sources
 * (static routes, blog posts, programmatic manifest).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..', '..');
export const DOMAIN = 'https://fintoolslab.com';

// Slugs that have no backing content (soft-404s) — never emit them anywhere
export const BROKEN_BLOG_SLUGS = new Set([
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

export function loadStaticRoutes() {
  const { routes } = readJson(path.join(ROOT, 'scripts', 'seo-bot', 'routes.json'), { routes: [] });
  return routes;
}

export function loadBlogRoutes() {
  const posts = readJson(path.join(ROOT, 'src', 'data', 'blog', 'blog-posts.json'), []);
  const slugs = new Set(posts.map((p) => p.slug));
  return posts
    .filter((p) => !BROKEN_BLOG_SLUGS.has(p.slug))
    // Drop 2025 posts that have a 2026 twin (301-redirected in vercel.json)
    .filter((p) => {
      const twin = p.slug.replace(/-2025-/, '-2026-');
      return twin === p.slug || !slugs.has(twin);
    })
    .map((p) => ({
      path: `/blog/${p.slug}`,
      lastmod: p.publishDate,
      changefreq: 'monthly',
      priority: p.featured ? 0.9 : 0.7,
    }));
}

export function loadProgrammaticRoutes({ publishedOnly = true } = {}) {
  const manifest = readJson(
    path.join(ROOT, 'src', 'data', 'programmatic', 'manifest.json'),
    { pages: [] }
  );
  return manifest.pages
    .filter((p) => !publishedOnly || p.published)
    .map((p) => ({ path: p.path, changefreq: 'monthly', priority: 0.7 }));
}

export function collectAllRoutes({ publishedOnly = true } = {}) {
  return [...loadStaticRoutes(), ...loadBlogRoutes(), ...loadProgrammaticRoutes({ publishedOnly })];
}
