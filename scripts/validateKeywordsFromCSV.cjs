/**
 * Keyword Validation from Google Keyword Planner CSV
 *
 * This script enriches blog post configs with search volume data from
 * Google Keyword Planner exports (100% free, no API required).
 *
 * Usage:
 * 1. Export keywords from Google Keyword Planner as CSV
 * 2. Save as scripts/keyword_planner_export.csv
 * 3. Run: node scripts/validateKeywordsFromCSV.cjs
 *
 * Output: scripts/configs_validated.json with enriched data
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_FILE = path.join(__dirname, 'blogPostsConfig.json');
const CSV_FILE = path.join(__dirname, 'keyword_planner_export.csv');
const OUTPUT_FILE = path.join(__dirname, 'configs_validated.json');
const MIN_SEARCH_VOLUME = 100; // Minimum monthly searches to approve
const MAX_COMPETITION = 'HIGH'; // Skip if competition is too high

// Helper: Parse CSV (simple parser for Google Keyword Planner format)
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
}

// Helper: Extract number from search volume string (handles "1K-10K" format)
function extractSearchVolume(volumeStr) {
  if (!volumeStr) return 0;

  // Handle range format: "1K - 10K"
  if (volumeStr.includes('-')) {
    const parts = volumeStr.split('-');
    const low = parseVolumeNumber(parts[0].trim());
    const high = parseVolumeNumber(parts[1].trim());
    return Math.floor((low + high) / 2); // Return average
  }

  return parseVolumeNumber(volumeStr);
}

function parseVolumeNumber(str) {
  str = str.replace(/[,\s]/g, '');

  if (str.includes('K')) {
    return parseInt(str.replace('K', '')) * 1000;
  }
  if (str.includes('M')) {
    return parseInt(str.replace('M', '')) * 1000000;
  }

  return parseInt(str) || 0;
}

// Helper: Normalize keyword for matching
function normalizeKeyword(keyword) {
  return keyword.toLowerCase().trim().replace(/\s+/g, ' ');
}

// Main validation function
async function validateKeywords() {
  console.log('🔍 Keyword Validation Starting...\n');

  // Load blog post configs
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error(`❌ Config file not found: ${CONFIG_FILE}`);
    process.exit(1);
  }

  const configs = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  console.log(`📋 Loaded ${configs.length} blog post configurations`);

  // Load CSV data
  if (!fs.existsSync(CSV_FILE)) {
    console.error(`❌ CSV file not found: ${CSV_FILE}`);
    console.error('');
    console.error('📝 Please export keywords from Google Keyword Planner:');
    console.error('   1. Go to https://ads.google.com/aw/keywordplanner');
    console.error('   2. Paste all primary keywords from blogPostsConfig.json');
    console.error('   3. Download results as CSV');
    console.error(`   4. Save as: ${CSV_FILE}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
  const keywordData = parseCSV(csvContent);
  console.log(`📊 Loaded ${keywordData.length} keywords from CSV\n`);

  // Create keyword lookup map (normalized)
  const keywordMap = new Map();
  keywordData.forEach(row => {
    const keyword = normalizeKeyword(row['Keyword'] || row['keyword'] || '');
    if (keyword) {
      keywordMap.set(keyword, {
        searchVolume: extractSearchVolume(row['Avg. monthly searches'] || row['search_volume'] || '0'),
        competition: (row['Competition'] || row['competition'] || 'UNKNOWN').toUpperCase(),
        competitionIndex: parseFloat(row['Competition (indexed value)'] || row['competition_index'] || '0'),
        topOfPageBidLow: row['Top of page bid (low range)'] || row['bid_low'] || 'N/A',
        topOfPageBidHigh: row['Top of page bid (high range)'] || row['bid_high'] || 'N/A'
      });
    }
  });

  // Validate each config
  const validatedConfigs = [];
  const approvedConfigs = [];
  const flaggedConfigs = [];

  configs.forEach((config, index) => {
    const primaryKeyword = normalizeKeyword(config.primaryKeyword);
    const keywordInfo = keywordMap.get(primaryKeyword);

    const validated = {
      ...config,
      configId: index,
      validation: {
        validated: !!keywordInfo,
        searchVolume: keywordInfo?.searchVolume || 0,
        competition: keywordInfo?.competition || 'UNKNOWN',
        competitionIndex: keywordInfo?.competitionIndex || 0,
        bidRange: keywordInfo ? `${keywordInfo.topOfPageBidLow} - ${keywordInfo.topOfPageBidHigh}` : 'N/A',
        flags: [],
        status: 'pending'
      }
    };

    // Apply validation rules
    if (!keywordInfo) {
      validated.validation.flags.push('NOT_FOUND_IN_CSV');
      validated.validation.status = 'rejected';
    } else {
      // Check search volume
      if (validated.validation.searchVolume < MIN_SEARCH_VOLUME) {
        validated.validation.flags.push(`LOW_VOLUME (${validated.validation.searchVolume}/mo < ${MIN_SEARCH_VOLUME})`);
        validated.validation.status = 'flagged';
      }

      // Check competition
      if (validated.validation.competition === MAX_COMPETITION && validated.validation.competitionIndex > 0.7) {
        validated.validation.flags.push('HIGH_COMPETITION');
        validated.validation.status = 'flagged';
      }

      // Approve if no flags
      if (validated.validation.flags.length === 0) {
        validated.validation.status = 'approved';
      }
    }

    validatedConfigs.push(validated);

    if (validated.validation.status === 'approved') {
      approvedConfigs.push(validated);
    } else if (validated.validation.status === 'flagged') {
      flaggedConfigs.push(validated);
    }
  });

  // Generate report
  console.log('=' .repeat(80));
  console.log('📊 VALIDATION REPORT');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Total Configurations: ${configs.length}`);
  console.log(`✅ Approved: ${approvedConfigs.length}`);
  console.log(`⚠️  Flagged: ${flaggedConfigs.length}`);
  console.log(`❌ Rejected: ${validatedConfigs.filter(c => c.validation.status === 'rejected').length}`);
  console.log('');

  // Show flagged configs
  if (flaggedConfigs.length > 0) {
    console.log('⚠️  FLAGGED CONFIGURATIONS:');
    console.log('-'.repeat(80));
    flaggedConfigs.forEach(config => {
      console.log(`Config #${config.configId}: "${config.primaryKeyword}"`);
      console.log(`  Template: ${config.template}`);
      console.log(`  Search Volume: ${config.validation.searchVolume}/mo`);
      console.log(`  Competition: ${config.validation.competition} (${config.validation.competitionIndex})`);
      console.log(`  Flags: ${config.validation.flags.join(', ')}`);
      console.log('');
    });
  }

  // Show top opportunities
  const topOpportunities = approvedConfigs
    .sort((a, b) => b.validation.searchVolume - a.validation.searchVolume)
    .slice(0, 10);

  if (topOpportunities.length > 0) {
    console.log('🎯 TOP 10 OPPORTUNITIES (by search volume):');
    console.log('-'.repeat(80));
    topOpportunities.forEach((config, idx) => {
      console.log(`${idx + 1}. "${config.primaryKeyword}"`);
      console.log(`   Search Volume: ${config.validation.searchVolume}/mo | Competition: ${config.validation.competition}`);
      console.log(`   Template: ${config.template} | Target: ${config.targetAudience || 'General'}`);
      console.log('');
    });
  }

  // Save validated configs
  const output = {
    validatedAt: new Date().toISOString(),
    summary: {
      total: configs.length,
      approved: approvedConfigs.length,
      flagged: flaggedConfigs.length,
      rejected: validatedConfigs.filter(c => c.validation.status === 'rejected').length
    },
    configs: validatedConfigs
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log('='.repeat(80));
  console.log(`✅ Validation complete! Results saved to: ${OUTPUT_FILE}`);
  console.log('');
  console.log('📋 NEXT STEPS:');
  console.log('   1. Review flagged configurations');
  console.log('   2. Run: node scripts/checkUniqueness.cjs');
  console.log('   3. Run: node scripts/scrapePAALocal.cjs');
  console.log('='.repeat(80));
}

// Run validation
validateKeywords().catch(error => {
  console.error('❌ Error during validation:', error);
  process.exit(1);
});
