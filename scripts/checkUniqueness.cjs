/**
 * Content Uniqueness & Keyword Cannibalization Checker
 *
 * 100% local script - no external APIs required
 * Prevents duplicate content and keyword conflicts
 *
 * Usage: node scripts/checkUniqueness.cjs
 *
 * Input:  scripts/configs_validated.json (or blogPostsConfig.json)
 *         src/data/blog/blog-posts.json
 * Output: scripts/uniqueness_report.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const VALIDATED_CONFIGS = path.join(__dirname, 'configs_validated.json');
const BLOG_POSTS_INDEX = path.join(__dirname, '../src/data/blog/blog-posts.json');
const OUTPUT_REPORT = path.join(__dirname, 'uniqueness_report.json');
const FALLBACK_CONFIGS = path.join(__dirname, 'blogPostsConfig.json');

// Thresholds
const TITLE_SIMILARITY_THRESHOLD = 0.7; // 70% similar = flag as duplicate
const KEYWORD_OVERLAP_THRESHOLD = 0.6;   // 60% keyword overlap = cannibalization

// Helper: Calculate Levenshtein distance (string similarity)
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

// Helper: Calculate similarity score (0-1)
function similarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Helper: Normalize text for comparison
function normalizeText(text) {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

// Helper: Extract keywords from text
function extractKeywords(text) {
  const normalized = normalizeText(text);
  const words = normalized.split(' ').filter(word => word.length > 3);
  return [...new Set(words)]; // unique words only
}

// Helper: Calculate keyword overlap
function keywordOverlap(keywords1, keywords2) {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));

  if (set1.size === 0 && set2.size === 0) return 0;

  return intersection.size / Math.min(set1.size, set2.size);
}

// Main uniqueness check function
async function checkUniqueness() {
  console.log('🔍 Uniqueness & Cannibalization Check Starting...\n');

  // Load configs
  let configSource;
  if (fs.existsSync(VALIDATED_CONFIGS)) {
    const validated = JSON.parse(fs.readFileSync(VALIDATED_CONFIGS, 'utf-8'));
    configSource = validated.configs || validated;
    console.log(`📋 Loaded ${configSource.length} validated configurations`);
  } else if (fs.existsSync(FALLBACK_CONFIGS)) {
    configSource = JSON.parse(fs.readFileSync(FALLBACK_CONFIGS, 'utf-8'));
    console.log(`📋 Loaded ${configSource.length} configurations (fallback)`);
  } else {
    console.error('❌ No configuration file found');
    process.exit(1);
  }

  // Load existing blog posts
  let existingPosts = [];
  if (fs.existsSync(BLOG_POSTS_INDEX)) {
    existingPosts = JSON.parse(fs.readFileSync(BLOG_POSTS_INDEX, 'utf-8'));
    console.log(`📚 Loaded ${existingPosts.length} existing blog posts`);
  } else {
    console.log('📚 No existing blog posts found (new blog)');
  }

  console.log('');

  // Check uniqueness for each config
  const results = [];
  const conflicts = [];
  const approved = [];

  configSource.forEach((config, idx) => {
    const configId = config.configId !== undefined ? config.configId : idx;
    const primaryKeyword = config.primaryKeyword || '';
    const title = config.title || generateTitleFromConfig(config);

    const result = {
      configId,
      template: config.template,
      primaryKeyword,
      title,
      checks: {
        titleSimilarity: [],
        keywordCannibalization: [],
        internalDuplicates: []
      },
      uniquenessScore: 1.0,
      status: 'approved',
      flags: []
    };

    // Check 1: Title similarity with existing posts
    existingPosts.forEach(existingPost => {
      const sim = similarity(normalizeText(title), normalizeText(existingPost.title));

      if (sim > TITLE_SIMILARITY_THRESHOLD) {
        result.checks.titleSimilarity.push({
          existingPostId: existingPost.id,
          existingTitle: existingPost.title,
          similarityScore: sim.toFixed(2)
        });
        result.flags.push(`SIMILAR_TITLE_TO_${existingPost.id} (${(sim * 100).toFixed(0)}%)`);
      }
    });

    // Check 2: Keyword cannibalization
    existingPosts.forEach(existingPost => {
      const existingKeywords = [
        existingPost.slug,
        ...(existingPost.keywords || [])
      ];

      const newKeywords = [
        primaryKeyword,
        ...(config.secondaryKeywords || [])
      ];

      const overlap = keywordOverlap(
        existingKeywords.map(normalizeText),
        newKeywords.map(normalizeText)
      );

      if (overlap > KEYWORD_OVERLAP_THRESHOLD) {
        result.checks.keywordCannibalization.push({
          existingPostId: existingPost.id,
          overlapScore: overlap.toFixed(2),
          conflictingKeywords: findConflictingKeywords(existingKeywords, newKeywords)
        });
        result.flags.push(`KEYWORD_OVERLAP_${existingPost.id} (${(overlap * 100).toFixed(0)}%)`);
      }
    });

    // Check 3: Internal duplicates (comparing with other configs in same batch)
    configSource.forEach((otherConfig, otherIdx) => {
      if (idx >= otherIdx) return; // Only check once per pair

      const otherConfigId = otherConfig.configId !== undefined ? otherConfig.configId : otherIdx;
      const otherTitle = otherConfig.title || generateTitleFromConfig(otherConfig);
      const otherPrimaryKeyword = otherConfig.primaryKeyword || '';

      const titleSim = similarity(normalizeText(title), normalizeText(otherTitle));
      const keywordSim = similarity(normalizeText(primaryKeyword), normalizeText(otherPrimaryKeyword));

      if (titleSim > TITLE_SIMILARITY_THRESHOLD || keywordSim > 0.9) {
        result.checks.internalDuplicates.push({
          duplicateConfigId: otherConfigId,
          duplicateTitle: otherTitle,
          duplicateKeyword: otherPrimaryKeyword,
          titleSimilarity: titleSim.toFixed(2),
          keywordSimilarity: keywordSim.toFixed(2)
        });
        result.flags.push(`DUPLICATE_CONFIG_${otherConfigId}`);
      }
    });

    // Calculate overall uniqueness score
    const titlePenalty = result.checks.titleSimilarity.length * 0.3;
    const keywordPenalty = result.checks.keywordCannibalization.length * 0.4;
    const internalPenalty = result.checks.internalDuplicates.length * 0.5;

    result.uniquenessScore = Math.max(0, 1.0 - (titlePenalty + keywordPenalty + internalPenalty));
    result.uniquenessScore = parseFloat(result.uniquenessScore.toFixed(2));

    // Determine status
    if (result.flags.length > 0) {
      result.status = 'conflict';
      conflicts.push(result);
    } else {
      result.status = 'approved';
      approved.push(result);
    }

    results.push(result);
  });

  // Generate report
  console.log('='.repeat(80));
  console.log('📊 UNIQUENESS REPORT');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Total Configurations Checked: ${results.length}`);
  console.log(`✅ Approved (No Conflicts): ${approved.length}`);
  console.log(`⚠️  Conflicts Detected: ${conflicts.length}`);
  console.log('');

  // Show conflicts
  if (conflicts.length > 0) {
    console.log('⚠️  CONFLICTS REQUIRING REVIEW:');
    console.log('-'.repeat(80));

    conflicts.forEach(conflict => {
      console.log(`Config #${conflict.configId}: "${conflict.primaryKeyword}"`);
      console.log(`  Title: ${conflict.title}`);
      console.log(`  Template: ${conflict.template}`);
      console.log(`  Uniqueness Score: ${conflict.uniquenessScore}`);
      console.log(`  Flags: ${conflict.flags.join(', ')}`);

      if (conflict.checks.titleSimilarity.length > 0) {
        console.log(`  Similar Titles:`);
        conflict.checks.titleSimilarity.forEach(sim => {
          console.log(`    - "${sim.existingTitle}" (${(sim.similarityScore * 100).toFixed(0)}% similar)`);
        });
      }

      if (conflict.checks.keywordCannibalization.length > 0) {
        console.log(`  Keyword Cannibalization:`);
        conflict.checks.keywordCannibalization.forEach(can => {
          console.log(`    - Conflicts with post "${can.existingPostId}" (${(can.overlapScore * 100).toFixed(0)}% overlap)`);
          console.log(`      Conflicting keywords: ${can.conflictingKeywords.join(', ')}`);
        });
      }

      if (conflict.checks.internalDuplicates.length > 0) {
        console.log(`  Internal Duplicates:`);
        conflict.checks.internalDuplicates.forEach(dup => {
          console.log(`    - Duplicate of Config #${dup.duplicateConfigId}: "${dup.duplicateKeyword}"`);
        });
      }

      console.log('');
    });
  }

  // Show top unique posts
  const topUnique = approved
    .sort((a, b) => b.uniquenessScore - a.uniquenessScore)
    .slice(0, 10);

  if (topUnique.length > 0) {
    console.log('✨ TOP 10 MOST UNIQUE POSTS:');
    console.log('-'.repeat(80));
    topUnique.forEach((post, idx) => {
      console.log(`${idx + 1}. Config #${post.configId}: "${post.primaryKeyword}"`);
      console.log(`   Uniqueness Score: ${post.uniquenessScore} | Template: ${post.template}`);
      console.log('');
    });
  }

  // Save report
  const output = {
    checkedAt: new Date().toISOString(),
    summary: {
      total: results.length,
      approved: approved.length,
      conflicts: conflicts.length,
      avgUniquenessScore: (results.reduce((sum, r) => sum + r.uniquenessScore, 0) / results.length).toFixed(2)
    },
    results,
    conflicts,
    approved: approved.map(a => a.configId)
  };

  fs.writeFileSync(OUTPUT_REPORT, JSON.stringify(output, null, 2));

  console.log('='.repeat(80));
  console.log(`✅ Uniqueness check complete! Report saved to: ${OUTPUT_REPORT}`);
  console.log('');
  console.log('📋 NEXT STEPS:');
  if (conflicts.length > 0) {
    console.log('   1. Review conflicts and adjust keywords/titles');
    console.log('   2. Re-run uniqueness check after adjustments');
    console.log('   3. Proceed with approved configs only');
  } else {
    console.log('   1. All configs passed uniqueness check!');
    console.log('   2. Run: node scripts/scrapePAALocal.cjs');
  }
  console.log('='.repeat(80));

  return output;
}

// Helper: Generate title from config (fallback)
function generateTitleFromConfig(config) {
  if (config.template === 'calculator-comparison') {
    return `Best ${config.calculatorType} Calculator Comparison ${config.year || '2025'}`;
  }
  if (config.template === 'location-specific') {
    return `${config.calculatorType} Calculator for ${config.state} Residents`;
  }
  if (config.template === 'demographic-targeted') {
    return `${config.calculatorType} Calculator for ${config.demographic}`;
  }
  if (config.template === 'vs-comparison') {
    return `${config.calculator1} vs ${config.calculator2} Calculator`;
  }
  return config.primaryKeyword || 'Untitled Post';
}

// Helper: Find actual conflicting keywords
function findConflictingKeywords(keywords1, keywords2) {
  const normalized1 = keywords1.map(normalizeText);
  const normalized2 = keywords2.map(normalizeText);

  const conflicts = normalized1.filter(k1 =>
    normalized2.some(k2 => similarity(k1, k2) > 0.8)
  );

  return [...new Set(conflicts)].slice(0, 5); // Return up to 5 conflicts
}

// Run uniqueness check
checkUniqueness().catch(error => {
  console.error('❌ Error during uniqueness check:', error);
  process.exit(1);
});
