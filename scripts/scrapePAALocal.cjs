/**
 * Local PAA (People Also Ask) Scraper using Puppeteer
 *
 * 100% free - uses headless Chrome on your machine
 * Scrapes Google's "People Also Ask" questions for each keyword
 *
 * Usage:
 * node scripts/scrapePAALocal.cjs [config-id]
 * node scripts/scrapePAALocal.cjs 5      # Scrape PAA for config #5
 * node scripts/scrapePAALocal.cjs all    # Scrape PAA for all approved configs
 *
 * Input:  blogPostsConfig.json or configs_validated.json
 * Output: paa_questions.json
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIGS_FILE = path.join(__dirname, 'configs_validated.json');
const UNIQUENESS_REPORT = path.join(__dirname, 'uniqueness_report.json');
const OUTPUT_FILE = path.join(__dirname, 'paa_questions.json');
const FALLBACK_CONFIGS = path.join(__dirname, 'blogPostsConfig.json');

// Scraping settings
const DELAY_BETWEEN_REQUESTS = 3000; // 3 seconds (be nice to Google)
const MAX_RETRIES = 2;
const HEADLESS = true; // Set to false to see browser

// Helper: Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Scrape PAA questions for a single keyword
async function scrapePAAForKeyword(page, keyword) {
  try {
    console.log(`  🔍 Searching Google for: "${keyword}"`);

    // Navigate to Google search
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&gl=us&hl=en`;
    await page.goto(searchUrl, { waitForTimeout: 10000, waitUntil: 'networkidle2' });

    // Wait a bit for PAA to load
    await sleep(2000);

    // Try multiple selectors for PAA questions (Google changes these frequently)
    const selectors = [
      '.related-question-pair',           // Common selector
      '[jsname="Cpkphb"]',                // Alternative selector
      '[data-q]',                         // Data attribute selector
      '.kno-ftr',                         // Knowledge panel
      '[jscontroller="SC7lYd"]'           // Controller-based selector
    ];

    let questions = [];

    // Try each selector
    for (const selector of selectors) {
      try {
        const elements = await page.$$(selector);

        if (elements && elements.length > 0) {
          console.log(`  ✓ Found ${elements.length} PAA elements with selector: ${selector}`);

          // Extract text from elements
          for (const element of elements) {
            try {
              const text = await page.evaluate(el => el.textContent, element);
              if (text && text.trim().length > 10) {
                // Clean up the text
                const cleaned = text.trim()
                  .replace(/\n/g, ' ')
                  .replace(/\s+/g, ' ')
                  .substring(0, 200); // Max 200 chars

                // Check if it looks like a question
                if (cleaned.includes('?') ||
                    cleaned.match(/^(what|how|why|when|where|who|which|can|is|are|do|does)/i)) {
                  questions.push(cleaned);
                }
              }
            } catch (err) {
              // Skip individual element errors
            }
          }
        }

        if (questions.length > 0) break; // Stop if we found questions
      } catch (err) {
        // Try next selector
        continue;
      }
    }

    // Fallback: Try to find any question-like text on the page
    if (questions.length === 0) {
      console.log('  ⚠️  No PAA found with standard selectors, trying fallback...');

      const bodyText = await page.evaluate(() => document.body.innerText);
      const lines = bodyText.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 20 && trimmed.length < 150 && trimmed.includes('?')) {
          // Looks like a question
          if (trimmed.match(/^(what|how|why|when|where|who|which|can|is|are|do|does)/i)) {
            questions.push(trimmed);
            if (questions.length >= 8) break;
          }
        }
      }
    }

    // Remove duplicates and limit to 12 questions
    questions = [...new Set(questions)].slice(0, 12);

    if (questions.length > 0) {
      console.log(`  ✅ Extracted ${questions.length} PAA questions`);
      return questions;
    } else {
      console.log('  ⚠️  No PAA questions found for this keyword');
      return [];
    }

  } catch (error) {
    console.error(`  ❌ Error scraping "${keyword}":`, error.message);
    return [];
  }
}

// Main scraping function
async function scrapePAAQuestions() {
  const args = process.argv.slice(2);
  const targetConfigId = args[0];

  console.log('🌐 PAA Scraper Starting (using Puppeteer)...\n');

  // Load configs
  let configSource;
  let uniquenessData = null;

  if (fs.existsSync(CONFIGS_FILE)) {
    const validated = JSON.parse(fs.readFileSync(CONFIGS_FILE, 'utf-8'));
    configSource = validated.configs || validated;
    console.log(`📋 Loaded ${configSource.length} validated configurations`);
  } else if (fs.existsSync(FALLBACK_CONFIGS)) {
    configSource = JSON.parse(fs.readFileSync(FALLBACK_CONFIGS, 'utf-8'));
    console.log(`📋 Loaded ${configSource.length} configurations (fallback)`);
  } else {
    console.error('❌ No configuration file found');
    process.exit(1);
  }

  // Load uniqueness data to skip conflicted configs
  if (fs.existsSync(UNIQUENESS_REPORT)) {
    uniquenessData = JSON.parse(fs.readFileSync(UNIQUENESS_REPORT, 'utf-8'));
    console.log(`✅ Uniqueness data loaded (${uniquenessData.summary.approved} approved)`);
  }

  console.log('');

  // Determine which configs to scrape
  let configsToScrape;
  if (!targetConfigId || targetConfigId === 'all') {
    if (uniquenessData) {
      configsToScrape = configSource.filter(c => {
        const configId = c.configId !== undefined ? c.configId : configSource.indexOf(c);
        return uniquenessData.approved.includes(configId);
      });
      console.log(`🎯 Scraping ${configsToScrape.length} approved configurations`);
    } else {
      configsToScrape = configSource;
      console.log(`🎯 Scraping all ${configsToScrape.length} configurations`);
    }
  } else {
    const id = parseInt(targetConfigId);
    configsToScrape = configSource.filter(c =>
      (c.configId !== undefined ? c.configId : configSource.indexOf(c)) === id
    );
    if (configsToScrape.length === 0) {
      console.error(`❌ Config ID ${id} not found`);
      process.exit(1);
    }
    console.log(`🎯 Scraping single configuration: #${id}`);
  }

  console.log('');
  console.log(`⏱️  Estimated time: ${Math.ceil(configsToScrape.length * (DELAY_BETWEEN_REQUESTS + 5000) / 1000 / 60)} minutes`);
  console.log('');

  // Load existing PAA data
  let existingPAA = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    existingPAA = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    console.log(`📂 Loaded ${Object.keys(existingPAA).length} existing PAA entries`);
    console.log('');
  }

  // Launch browser
  console.log('🚀 Launching headless Chrome...\n');
  const browser = await puppeteer.launch({
    headless: HEADLESS ? 'new' : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();

  // Set viewport and user agent
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Scrape PAA for each keyword
  let scraped = 0;
  let skipped = 0;
  let failed = 0;

  for (const config of configsToScrape) {
    const configId = config.configId !== undefined ? config.configId : configSource.indexOf(config);
    const keyword = config.primaryKeyword;

    console.log(`[${scraped + skipped + failed + 1}/${configsToScrape.length}] Config #${configId}:`);

    // Skip if already scraped
    if (existingPAA[keyword] && existingPAA[keyword].length > 0) {
      console.log(`  ⏭️  Already scraped (${existingPAA[keyword].length} questions cached)`);
      skipped++;
      console.log('');
      continue;
    }

    let retries = 0;
    let questions = [];

    while (retries <= MAX_RETRIES && questions.length === 0) {
      if (retries > 0) {
        console.log(`  🔄 Retry ${retries}/${MAX_RETRIES}...`);
        await sleep(DELAY_BETWEEN_REQUESTS);
      }

      questions = await scrapePAAForKeyword(page, keyword);
      retries++;
    }

    if (questions.length > 0) {
      existingPAA[keyword] = questions;
      scraped++;
    } else {
      failed++;
    }

    console.log('');

    // Be respectful - delay between requests
    if (scraped + skipped + failed < configsToScrape.length) {
      console.log(`  ⏸️  Waiting ${DELAY_BETWEEN_REQUESTS / 1000}s before next request...\n`);
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }

  // Close browser
  await browser.close();
  console.log('✅ Browser closed\n');

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingPAA, null, 2));

  // Generate report
  console.log('='.repeat(80));
  console.log('📊 PAA SCRAPING REPORT');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Total Keywords Processed: ${configsToScrape.length}`);
  console.log(`✅ Successfully Scraped: ${scraped}`);
  console.log(`⏭️  Skipped (cached): ${skipped}`);
  console.log(`❌ Failed (no questions found): ${failed}`);
  console.log(`📦 Total in Database: ${Object.keys(existingPAA).length} keywords`);
  console.log('');

  // Show some examples
  const samples = Object.entries(existingPAA).slice(0, 3);
  if (samples.length > 0) {
    console.log('📝 SAMPLE PAA QUESTIONS:');
    console.log('-'.repeat(80));
    samples.forEach(([keyword, questions]) => {
      console.log(`\n"${keyword}":`);
      questions.slice(0, 4).forEach((q, idx) => {
        console.log(`  ${idx + 1}. ${q}`);
      });
    });
    console.log('');
  }

  console.log('='.repeat(80));
  console.log(`✅ PAA questions saved to: ${OUTPUT_FILE}`);
  console.log('');
  console.log('📋 NEXT STEPS:');
  console.log('   1. Review PAA questions in paa_questions.json');
  console.log('   2. Run: node scripts/enhancePrompt.cjs');
  console.log('   3. Enhanced prompts will include PAA questions in FAQ section');
  console.log('='.repeat(80));
}

// Run scraper
scrapePAAQuestions().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
