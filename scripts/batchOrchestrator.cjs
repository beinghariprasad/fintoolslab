/**
 * Batch Orchestrator for Zero-Cost SEO Blog Generation
 *
 * Coordinates all stages of the blog generation workflow
 * Provides human approval checkpoints
 *
 * Usage:
 * node scripts/batchOrchestrator.cjs [stage]
 *
 * Stages:
 * - validate   : Run keyword validation only
 * - uniqueness : Run uniqueness check only
 * - paa        : Run PAA scraping only
 * - enhance    : Generate enhanced prompts only
 * - all        : Run complete workflow with checkpoints
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// File paths
const VALIDATED_CONFIGS = path.join(__dirname, 'configs_validated.json');
const UNIQUENESS_REPORT = path.join(__dirname, 'uniqueness_report.json');
const PAA_FILE = path.join(__dirname, 'paa_questions.json');
const ENHANCED_PROMPTS_DIR = path.join(__dirname, 'enhanced_prompts');

// Helper: Ask user for confirmation
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(query, answer => {
    rl.close();
    resolve(answer.toLowerCase().trim());
  }));
}

// Helper: Run command and return output
function runCommand(command, description) {
  console.log(`\n🔧 ${description}...`);
  console.log(`   Command: ${command}\n`);

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: __dirname + '/..'
    });
    return true;
  } catch (error) {
    console.error(`\n❌ Command failed: ${error.message}`);
    return false;
  }
}

// Stage 1: Keyword Validation
async function runValidation() {
  console.log('\n' + '='.repeat(80));
  console.log('STAGE 1: KEYWORD VALIDATION');
  console.log('='.repeat(80));

  const csvPath = path.join(__dirname, 'keyword_planner_export.csv');

  if (!fs.existsSync(csvPath)) {
    console.log('\n⚠️  Google Keyword Planner CSV not found!');
    console.log('');
    console.log('📋 MANUAL STEP REQUIRED:');
    console.log('   1. Go to: https://ads.google.com/aw/keywordplanner');
    console.log('   2. Paste all primary keywords from blogPostsConfig.json');
    console.log('   3. Download results as CSV');
    console.log('   4. Save as: scripts/keyword_planner_export.csv');
    console.log('   5. Re-run this orchestrator');
    console.log('');

    const answer = await askQuestion('Do you have the CSV ready? (yes/skip): ');
    if (answer !== 'yes' && answer !== 'y') {
      console.log('\n⏭️  Skipping validation stage...');
      return false;
    }

    if (!fs.existsSync(csvPath)) {
      console.log('\n❌ CSV still not found. Exiting...');
      return false;
    }
  }

  const success = runCommand('node scripts/validateKeywordsFromCSV.cjs', 'Running keyword validation');

  if (!success) return false;

  // Check results
  if (fs.existsSync(VALIDATED_CONFIGS)) {
    const validated = JSON.parse(fs.readFileSync(VALIDATED_CONFIGS, 'utf-8'));
    console.log('\n✅ Stage 1 Complete!');
    console.log(`   Approved: ${validated.summary.approved}`);
    console.log(`   Flagged: ${validated.summary.flagged}`);
    console.log(`   Rejected: ${validated.summary.rejected}`);

    if (validated.summary.flagged > 0) {
      console.log('\n⚠️  Some keywords were flagged for review.');
      const answer = await askQuestion('Continue anyway? (yes/no): ');
      if (answer !== 'yes' && answer !== 'y') {
        console.log('\n⏸️  Paused. Review flagged keywords and re-run.');
        return false;
      }
    }

    return true;
  }

  return false;
}

// Stage 2: Uniqueness Check
async function runUniquenessCheck() {
  console.log('\n' + '='.repeat(80));
  console.log('STAGE 2: UNIQUENESS & CANNIBALIZATION CHECK');
  console.log('='.repeat(80));

  const success = runCommand('node scripts/checkUniqueness.cjs', 'Running uniqueness check');

  if (!success) return false;

  // Check results
  if (fs.existsSync(UNIQUENESS_REPORT)) {
    const report = JSON.parse(fs.readFileSync(UNIQUENESS_REPORT, 'utf-8'));
    console.log('\n✅ Stage 2 Complete!');
    console.log(`   Approved: ${report.summary.approved}`);
    console.log(`   Conflicts: ${report.summary.conflicts}`);

    if (report.summary.conflicts > 0) {
      console.log('\n⚠️  Keyword cannibalization or duplicate content detected!');
      console.log(`   ${report.summary.conflicts} configurations have conflicts.`);
      console.log('\n   Options:');
      console.log('   1. Continue with approved configs only (recommended)');
      console.log('   2. Review and fix conflicts manually');
      console.log('   3. Abort');
      console.log('');

      const answer = await askQuestion('Enter choice (1/2/3): ');

      if (answer === '2') {
        console.log('\n⏸️  Paused. Review uniqueness_report.json and fix conflicts.');
        console.log('   Then re-run: node scripts/checkUniqueness.cjs');
        return false;
      } else if (answer === '3') {
        console.log('\n⏹️  Aborted.');
        return false;
      } else {
        console.log('\n▶️  Continuing with approved configs only...');
      }
    }

    return true;
  }

  return false;
}

// Stage 3: PAA Scraping
async function runPAAScraping() {
  console.log('\n' + '='.repeat(80));
  console.log('STAGE 3: PAA (PEOPLE ALSO ASK) SCRAPING');
  console.log('='.repeat(80));

  console.log('\n📋 This stage uses Puppeteer to scrape Google PAA questions.');
  console.log('   • Runs headless Chrome on your machine');
  console.log('   • 3-second delay between requests (respectful scraping)');
  console.log('   • Estimated time: ~5-10 minutes for 20 keywords');
  console.log('');

  const answer = await askQuestion('Proceed with PAA scraping? (yes/skip): ');

  if (answer === 'skip' || answer === 's') {
    console.log('\n⏭️  Skipping PAA scraping. You can run it later:');
    console.log('   node scripts/scrapePAALocal.cjs all');
    return true; // Not a failure - user chose to skip
  }

  if (answer !== 'yes' && answer !== 'y') {
    console.log('\n⏸️  Paused.');
    return false;
  }

  const success = runCommand('node scripts/scrapePAALocal.cjs all', 'Scraping PAA questions');

  if (!success) {
    console.log('\n⚠️  PAA scraping failed. Continuing without PAA data...');
    return true; // Not critical - can continue without PAA
  }

  // Check results
  if (fs.existsSync(PAA_FILE)) {
    const paa = JSON.parse(fs.readFileSync(PAA_FILE, 'utf-8'));
    const count = Object.keys(paa).length;
    console.log('\n✅ Stage 3 Complete!');
    console.log(`   PAA questions collected for ${count} keywords`);
    return true;
  }

  return true; // Continue even if PAA file doesn't exist
}

// Stage 4: Enhanced Prompt Generation
async function runPromptGeneration() {
  console.log('\n' + '='.repeat(80));
  console.log('STAGE 4: ENHANCED PROMPT GENERATION');
  console.log('='.repeat(80));

  const success = runCommand('node scripts/enhancePrompt.cjs all', 'Generating enhanced prompts');

  if (!success) return false;

  // Check results
  if (fs.existsSync(ENHANCED_PROMPTS_DIR)) {
    const files = fs.readdirSync(ENHANCED_PROMPTS_DIR).filter(f => f.endsWith('.txt'));
    console.log('\n✅ Stage 4 Complete!');
    console.log(`   Generated ${files.length} enhanced prompts`);
    console.log(`   Location: ${ENHANCED_PROMPTS_DIR}`);

    return true;
  }

  return false;
}

// Main orchestration
async function orchestrate() {
  const args = process.argv.slice(2);
  const stage = args[0] || 'all';

  console.log('');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(15) + 'ZERO-COST SEO BLOG GENERATION ORCHESTRATOR' + ' '.repeat(20) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('');

  const startTime = Date.now();

  try {
    // Run specific stage or all stages
    if (stage === 'validate') {
      await runValidation();
    } else if (stage === 'uniqueness') {
      await runUniquenessCheck();
    } else if (stage === 'paa') {
      await runPAAScraping();
    } else if (stage === 'enhance') {
      await runPromptGeneration();
    } else if (stage === 'all') {
      // Full workflow
      console.log('🎯 Running complete workflow with approval checkpoints...\n');

      // Stage 1: Validation
      if (!await runValidation()) {
        console.log('\n❌ Workflow stopped at Stage 1');
        return;
      }

      // Stage 2: Uniqueness
      if (!await runUniquenessCheck()) {
        console.log('\n❌ Workflow stopped at Stage 2');
        return;
      }

      // Stage 3: PAA Scraping (optional)
      await runPAAScraping();

      // Stage 4: Prompt Generation
      if (!await runPromptGeneration()) {
        console.log('\n❌ Workflow stopped at Stage 4');
        return;
      }

      // Success!
      const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

      console.log('\n' + '='.repeat(80));
      console.log('🎉 WORKFLOW COMPLETE!');
      console.log('='.repeat(80));
      console.log(`\n⏱️  Total time: ${duration} minutes`);
      console.log('');
      console.log('📋 NEXT STEPS:');
      console.log('   1. Review enhanced prompts in: scripts/enhanced_prompts/');
      console.log('   2. Copy a prompt file content');
      console.log('   3. Use Task tool with seo-content-strategist agent');
      console.log('   4. Paste the prompt as the task description');
      console.log('   5. Save agent output to: src/data/blog/posts/[slug].json');
      console.log('   6. Run: node scripts/updateBlogIndex.cjs');
      console.log('   7. Build and deploy!');
      console.log('');
      console.log('='.repeat(80));

    } else {
      console.log('❌ Unknown stage:', stage);
      console.log('');
      console.log('Usage: node scripts/batchOrchestrator.cjs [stage]');
      console.log('');
      console.log('Available stages:');
      console.log('  validate   - Run keyword validation only');
      console.log('  uniqueness - Run uniqueness check only');
      console.log('  paa        - Run PAA scraping only');
      console.log('  enhance    - Generate enhanced prompts only');
      console.log('  all        - Run complete workflow (default)');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run orchestrator
orchestrate();
