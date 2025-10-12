/**
 * Process Blog Batch - Automates blog post generation workflow
 *
 * This script helps automate the blog generation process by:
 * 1. Reading enhanced prompts
 * 2. Preparing tasks for seo-content-strategist agent
 * 3. Saving generated blog posts
 * 4. Updating blog index automatically
 * 5. Optionally building and committing
 *
 * Usage:
 * node scripts/processBlogBatch.cjs list           # List pending prompts
 * node scripts/processBlogBatch.cjs save [id]      # Save agent output to JSON
 * node scripts/processBlogBatch.cjs auto [id]      # Full automation (requires agent output)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ENHANCED_PROMPTS_DIR = path.join(__dirname, 'enhanced_prompts');
const BLOG_POSTS_DIR = path.join(__dirname, '../src/data/blog/posts');
const BLOG_INDEX = path.join(__dirname, '../src/data/blog/blog-posts.json');
const PROCESSED_TRACKER = path.join(__dirname, 'processed_prompts.json');

// Ensure directories exist
if (!fs.existsSync(BLOG_POSTS_DIR)) {
  fs.mkdirSync(BLOG_POSTS_DIR, { recursive: true });
}

// Helper: Load processed prompts tracker
function loadProcessedTracker() {
  if (fs.existsSync(PROCESSED_TRACKER)) {
    return JSON.parse(fs.readFileSync(PROCESSED_TRACKER, 'utf-8'));
  }
  return { processed: [], lastUpdate: null };
}

// Helper: Save processed tracker
function saveProcessedTracker(tracker) {
  fs.writeFileSync(PROCESSED_TRACKER, JSON.stringify(tracker, null, 2));
}

// Helper: List all enhanced prompts
function listEnhancedPrompts() {
  if (!fs.existsSync(ENHANCED_PROMPTS_DIR)) {
    console.log('❌ No enhanced prompts directory found');
    console.log('   Run: node scripts/batchOrchestrator.cjs all');
    return [];
  }

  const files = fs.readdirSync(ENHANCED_PROMPTS_DIR)
    .filter(f => f.endsWith('.txt'))
    .sort();

  return files.map((filename, idx) => {
    const promptPath = path.join(ENHANCED_PROMPTS_DIR, filename);
    const content = fs.readFileSync(promptPath, 'utf-8');

    // Extract config ID and title from prompt
    const configIdMatch = content.match(/\*\*Configuration ID:\*\* (\d+)/);
    const titleMatch = content.match(/\*\*Article Title:\*\* (.+)/);
    const keywordMatch = content.match(/\*\*Primary Keyword:\*\* (.+)/);

    return {
      id: idx,
      filename,
      promptPath,
      configId: configIdMatch ? parseInt(configIdMatch[1]) : null,
      title: titleMatch ? titleMatch[1].trim() : filename,
      primaryKeyword: keywordMatch ? keywordMatch[1].trim() : 'Unknown',
      size: (fs.statSync(promptPath).size / 1024).toFixed(1) + ' KB'
    };
  });
}

// Command: List pending prompts
function cmdList() {
  console.log('\n📋 Enhanced Prompts Status\n');
  console.log('='.repeat(80));

  const prompts = listEnhancedPrompts();
  const tracker = loadProcessedTracker();

  if (prompts.length === 0) {
    console.log('No enhanced prompts found. Generate them first:');
    console.log('  node scripts/batchOrchestrator.cjs all');
    console.log('');
    return;
  }

  const pending = prompts.filter(p => !tracker.processed.includes(p.filename));
  const processed = prompts.filter(p => tracker.processed.includes(p.filename));

  console.log(`\n⏳ PENDING (${pending.length}):`);
  console.log('-'.repeat(80));

  if (pending.length === 0) {
    console.log('  All prompts have been processed!');
  } else {
    pending.forEach(prompt => {
      console.log(`\n[${prompt.id}] ${prompt.title}`);
      console.log(`    Keyword: ${prompt.primaryKeyword}`);
      console.log(`    File: ${prompt.filename} (${prompt.size})`);
    });
  }

  console.log(`\n✅ PROCESSED (${processed.length}):`);
  console.log('-'.repeat(80));

  if (processed.length === 0) {
    console.log('  No prompts processed yet');
  } else {
    processed.slice(0, 5).forEach(prompt => {
      console.log(`  ✓ ${prompt.title}`);
    });
    if (processed.length > 5) {
      console.log(`  ... and ${processed.length - 5} more`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📋 NEXT STEPS:\n');
  console.log('Option 1: Manual Processing (Recommended for Quality)');
  console.log('  1. Copy prompt content from enhanced_prompts/ directory');
  console.log('  2. In Claude Code, use Task tool with seo-content-strategist agent');
  console.log('  3. Save agent output as JSON using this script:');
  console.log('     node scripts/processBlogBatch.cjs save <id>');
  console.log('');
  console.log('Option 2: Batch Instructions for Claude Code');
  console.log('  node scripts/processBlogBatch.cjs generate-tasks');
  console.log('');
}

// Command: Generate batch task instructions
function cmdGenerateTasks() {
  console.log('\n🤖 Batch Task Generation for Claude Code\n');
  console.log('='.repeat(80));

  const prompts = listEnhancedPrompts();
  const tracker = loadProcessedTracker();
  const pending = prompts.filter(p => !tracker.processed.includes(p.filename));

  if (pending.length === 0) {
    console.log('✅ All prompts have been processed!');
    return;
  }

  console.log(`\n📝 Found ${pending.length} pending prompts\n`);
  console.log('Copy the following message to Claude Code:\n');
  console.log('-'.repeat(80));
  console.log('\nI need you to generate SEO-optimized blog posts using the seo-content-strategist agent.');
  console.log(`I have ${pending.length} enhanced prompts ready.\n`);
  console.log('For each prompt below, use the Task tool with subagent_type="seo-content-strategist":');
  console.log('');

  pending.slice(0, 5).forEach((prompt, idx) => {
    console.log(`\n${idx + 1}. Prompt: ${prompt.filename}`);
    console.log(`   Title: ${prompt.title}`);
    console.log(`   Location: D:\\FTL\\fin-savvy-future-forge\\scripts\\enhanced_prompts\\${prompt.filename}`);
    console.log(`   `);
    console.log(`   Read the prompt file and use it with the seo-content-strategist agent.`);
    console.log(`   Then save the output using: node scripts/processBlogBatch.cjs save ${prompt.id}`);
  });

  if (pending.length > 5) {
    console.log(`\n... and ${pending.length - 5} more prompts`);
  }

  console.log('\n' + '-'.repeat(80));
  console.log('\n💡 TIP: Process 5-10 prompts per session for best results.\n');
}

// Command: Save agent output
function cmdSave(promptId) {
  if (promptId === undefined) {
    console.log('❌ Error: Prompt ID required');
    console.log('Usage: node scripts/processBlogBatch.cjs save <id>');
    console.log('Run "list" command to see available IDs');
    return;
  }

  const prompts = listEnhancedPrompts();
  const prompt = prompts[parseInt(promptId)];

  if (!prompt) {
    console.log(`❌ Error: Prompt ID ${promptId} not found`);
    console.log('Run "list" command to see available IDs');
    return;
  }

  console.log(`\n📝 Saving blog post from prompt [${promptId}]\n`);
  console.log(`Title: ${prompt.title}`);
  console.log(`Keyword: ${prompt.primaryKeyword}`);
  console.log('');

  // Read the enhanced prompt to get expected slug
  const promptContent = fs.readFileSync(prompt.promptPath, 'utf-8');
  const slugMatch = promptContent.match(/"slug": "(.+?)"/);
  const expectedSlug = slugMatch ? slugMatch[1] : null;

  console.log('📋 Instructions:');
  console.log('');
  console.log('1. Ensure you have the agent output (JSON format) ready');
  console.log('2. The JSON should be in your clipboard or a file');
  console.log('3. Paste the JSON content when prompted');
  console.log('');
  console.log('Expected slug:', expectedSlug || 'auto-generated');
  console.log('');
  console.log('⚠️  Press Ctrl+C to cancel, or paste JSON content below and press Enter twice:');
  console.log('');

  // Read multiline input from stdin
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let jsonInput = '';
  let emptyLineCount = 0;

  rl.on('line', (line) => {
    if (line.trim() === '') {
      emptyLineCount++;
      if (emptyLineCount >= 2) {
        rl.close();
      }
    } else {
      emptyLineCount = 0;
      jsonInput += line + '\n';
    }
  });

  rl.on('close', () => {
    if (!jsonInput.trim()) {
      console.log('\n❌ No input received. Cancelled.');
      return;
    }

    try {
      // Parse and validate JSON
      const blogPost = JSON.parse(jsonInput);

      // Validate required fields
      const requiredFields = ['slug', 'title', 'content', 'category'];
      const missing = requiredFields.filter(field => !blogPost[field]);

      if (missing.length > 0) {
        console.log(`\n❌ Error: Missing required fields: ${missing.join(', ')}`);
        return;
      }

      // Save to file
      const outputPath = path.join(BLOG_POSTS_DIR, `${blogPost.slug}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(blogPost, null, 2));

      console.log(`\n✅ Blog post saved: ${outputPath}`);
      console.log('');

      // Mark as processed
      const tracker = loadProcessedTracker();
      if (!tracker.processed.includes(prompt.filename)) {
        tracker.processed.push(prompt.filename);
        tracker.lastUpdate = new Date().toISOString();
        saveProcessedTracker(tracker);
        console.log('✅ Marked prompt as processed');
      }

      // Update blog index
      console.log('\n🔄 Updating blog index...');
      try {
        execSync('node scripts/updateBlogIndex.cjs', {
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
        console.log('✅ Blog index updated');
      } catch (error) {
        console.log('⚠️  Failed to update blog index. Run manually:');
        console.log('   node scripts/updateBlogIndex.cjs');
      }

      console.log('\n📋 NEXT STEPS:');
      console.log('  1. Review the blog post at:', outputPath);
      console.log('  2. Process next prompt: node scripts/processBlogBatch.cjs list');
      console.log('  3. Build and test: npm run build && npm run preview');
      console.log('');

    } catch (error) {
      console.log(`\n❌ Error parsing JSON: ${error.message}`);
      console.log('\nMake sure you pasted valid JSON from the agent output.');
    }
  });
}

// Command: Save from file
function cmdSaveFromFile(promptId, jsonFilePath) {
  const prompts = listEnhancedPrompts();
  const prompt = prompts[parseInt(promptId)];

  if (!prompt) {
    console.log(`❌ Error: Prompt ID ${promptId} not found`);
    return;
  }

  if (!fs.existsSync(jsonFilePath)) {
    console.log(`❌ Error: File not found: ${jsonFilePath}`);
    return;
  }

  console.log(`\n📝 Saving blog post from file\n`);

  try {
    const blogPost = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    const outputPath = path.join(BLOG_POSTS_DIR, `${blogPost.slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(blogPost, null, 2));

    console.log(`✅ Blog post saved: ${outputPath}`);

    // Mark as processed
    const tracker = loadProcessedTracker();
    if (!tracker.processed.includes(prompt.filename)) {
      tracker.processed.push(prompt.filename);
      tracker.lastUpdate = new Date().toISOString();
      saveProcessedTracker(tracker);
    }

    // Update blog index
    execSync('node scripts/updateBlogIndex.cjs', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    console.log('✅ Complete!\n');

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Command: Auto-process (batch mode)
function cmdAuto() {
  console.log('\n🤖 Auto-Processing Mode\n');
  console.log('='.repeat(80));
  console.log('\n⚠️  NOTE: This requires agent outputs to be pre-generated.');
  console.log('This mode is designed for scheduled/automated workflows.\n');
  console.log('For interactive processing, use "save" command instead.\n');
  console.log('See README-ZERO-COST-WORKFLOW.md for scheduling setup.\n');
}

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(22) + 'BLOG BATCH PROCESSOR' + ' '.repeat(36) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  switch (command) {
    case 'list':
      cmdList();
      break;

    case 'generate-tasks':
      cmdGenerateTasks();
      break;

    case 'save':
      if (args[2] && fs.existsSync(args[2])) {
        cmdSaveFromFile(args[1], args[2]);
      } else {
        cmdSave(args[1]);
      }
      break;

    case 'auto':
      cmdAuto();
      break;

    default:
      console.log('\n📖 Usage:\n');
      console.log('  node scripts/processBlogBatch.cjs list              # List pending prompts');
      console.log('  node scripts/processBlogBatch.cjs generate-tasks    # Generate batch task list');
      console.log('  node scripts/processBlogBatch.cjs save <id>         # Save agent output (interactive)');
      console.log('  node scripts/processBlogBatch.cjs save <id> <file>  # Save from JSON file');
      console.log('  node scripts/processBlogBatch.cjs auto              # Info about automation');
      console.log('');
      console.log('📋 Workflow:');
      console.log('  1. Generate enhanced prompts: node scripts/batchOrchestrator.cjs all');
      console.log('  2. List pending prompts: node scripts/processBlogBatch.cjs list');
      console.log('  3. Use prompts with seo-content-strategist agent in Claude Code');
      console.log('  4. Save outputs: node scripts/processBlogBatch.cjs save <id>');
      console.log('');
  }
}

main();
