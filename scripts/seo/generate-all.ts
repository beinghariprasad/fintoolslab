/**
 * Master orchestrator: generate posts → images → index.
 * Usage: npx tsx scripts/seo/generate-all.ts [--skip-images]
 */
import { execSync } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skipImages = process.argv.includes('--skip-images');

function run(script: string, label: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${label}`);
  console.log(`${'='.repeat(60)}\n`);
  execSync(`npx tsx ${path.resolve(__dirname, script)}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../..'),
  });
}

try {
  run('generate-posts.ts', 'Step 1: Generate Blog Post JSON Files');

  if (!skipImages) {
    run('generate-images.ts', 'Step 2: Generate Hero Images (fal.ai)');
  } else {
    console.log('\n  Step 2: SKIPPED (--skip-images)\n');
  }

  run('generate-index.ts', 'Step 3: Rebuild Blog Index');

  console.log(`\n${'='.repeat(60)}`);
  console.log('  All done! Run `npm run build` to verify.');
  console.log(`${'='.repeat(60)}\n`);
} catch (err: any) {
  console.error(`\nFailed: ${err.message}`);
  process.exit(1);
}
