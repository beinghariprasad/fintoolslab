/**
 * Batch releaser — the heart of the scheduled SEO bot.
 *
 * Programmatic pages are generated up front but released in weekly batches
 * (dumping 100+ pages in the index at once is a scaled-content spam signal).
 * Each run publishes the next unpublished batch, regenerates the sitemap,
 * and writes the released URLs to scripts/seo-bot/last-release.json so CI
 * can ping IndexNow with exactly those URLs.
 *
 * Usage: node scripts/seo-bot/release-batch.mjs [--dry-run]
 * Exit codes: 0 always (no-op when nothing is left to release).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { DOMAIN, ROOT } from './lib.mjs';

const MANIFEST = path.join(ROOT, 'src', 'data', 'programmatic', 'manifest.json');
const RELEASE_FILE = path.join(ROOT, 'scripts', 'seo-bot', 'last-release.json');
const dryRun = process.argv.includes('--dry-run');

if (!fs.existsSync(MANIFEST)) {
  console.log('No programmatic manifest yet — nothing to release.');
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
const unpublished = manifest.pages.filter((p) => !p.published);

if (unpublished.length === 0) {
  console.log('All programmatic pages are already published. Nothing to do.');
  fs.writeFileSync(RELEASE_FILE, JSON.stringify({ released: [], batch: null }, null, 2));
  process.exit(0);
}

const nextBatch = Math.min(...unpublished.map((p) => p.batch));
const releasing = unpublished.filter((p) => p.batch === nextBatch);

console.log(`Releasing batch ${nextBatch}: ${releasing.length} pages`);
releasing.forEach((p) => console.log(`  + ${p.path}`));

if (dryRun) {
  console.log('(dry run — no changes written)');
  process.exit(0);
}

for (const page of manifest.pages) {
  if (page.batch === nextBatch) page.published = true;
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');

fs.writeFileSync(
  RELEASE_FILE,
  JSON.stringify(
    {
      batch: nextBatch,
      releasedAt: new Date().toISOString(),
      released: releasing.map((p) => DOMAIN + p.path),
      remainingBatches: [...new Set(manifest.pages.filter((p) => !p.published).map((p) => p.batch))],
    },
    null,
    2
  ) + '\n',
  'utf-8'
);

// Regenerate the committed sitemap so the deploy picks it up
execFileSync('node', [path.join(ROOT, 'scripts', 'generateSitemap.cjs')], { stdio: 'inherit' });

const remaining = manifest.pages.filter((p) => !p.published).length;
console.log(`\nBatch ${nextBatch} released (${releasing.length} pages). ${remaining} pages remain in later batches.`);
