/**
 * Generate all 100 blog post JSON files from state data + templates.
 * Usage: npx tsx scripts/seo/generate-posts.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { STATES } from './data/states.js';
import { generateMortgagePost } from './templates/mortgage.js';
import { generateRetirementPost } from './templates/retirement.js';
import { generateSavingsPost } from './templates/savings.js';
import { generateCompoundInterestPost } from './templates/compound-interest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, '../../src/data/blog/posts');

// Stagger dates across 8 weeks: 2026-02-01 to 2026-03-28
function staggerDate(index: number, total: number): string {
  const start = new Date('2026-02-01');
  const end = new Date('2026-03-28');
  const range = end.getTime() - start.getTime();
  const offset = Math.round((index / (total - 1)) * range);
  const d = new Date(start.getTime() + offset);
  return d.toISOString().split('T')[0];
}

// Existing posts that should be skipped (already hand-crafted)
// Hand-crafted posts that use the old 2025 slug — skip so we don't overwrite
const SKIP: Set<string> = new Set([
  'mortgage-calculator-for-new-york-residents-2025-guide',
  'retirement-calculator-for-california-residents-2025-guide',
  'savings-calculator-for-texas-residents-2025-guide',
]);
// New 2026 slugs for the same state+calc combos won't collide, so they'll generate normally

type Generator = (state: typeof STATES[0], date: string) => object;

const TEMPLATES: { prefix: string; gen: Generator }[] = [
  { prefix: 'mortgage', gen: generateMortgagePost },
  { prefix: 'retirement', gen: generateRetirementPost },
  { prefix: 'savings', gen: generateSavingsPost },
  { prefix: 'compound-interest', gen: generateCompoundInterestPost },
];

function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;
  const allSlugs: string[] = [];

  // 4 templates × 25 states = 100 posts
  const totalPosts = TEMPLATES.length * STATES.length;
  let globalIndex = 0;

  for (const tmpl of TEMPLATES) {
    for (const state of STATES) {
      const date = staggerDate(globalIndex, totalPosts);
      const post = tmpl.gen(state, date) as any;

      if (SKIP.has(post.slug)) {
        console.log(`  SKIP (exists): ${post.slug}`);
        skipped++;
        globalIndex++;
        continue;
      }

      const outPath = path.join(OUT_DIR, `${post.slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(post, null, 2), 'utf-8');
      allSlugs.push(post.slug);
      generated++;
      globalIndex++;
    }
  }

  console.log(`\nGenerated ${generated} posts, skipped ${skipped} existing.`);
  console.log(`Total slugs: ${allSlugs.length}`);

  // Write slug manifest for downstream scripts
  const manifestPath = path.resolve(__dirname, 'generated-slugs.json');
  fs.writeFileSync(manifestPath, JSON.stringify(allSlugs, null, 2), 'utf-8');
  console.log(`Slug manifest written to ${manifestPath}`);
}

main();
