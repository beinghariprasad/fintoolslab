/**
 * Enhanced Prompt Generator for SEO Content Strategist Agent
 *
 * Combines data from all validation stages to create optimized prompts
 *
 * Usage: node scripts/enhancePrompt.cjs [config-id]
 *        node scripts/enhancePrompt.cjs 5
 *        node scripts/enhancePrompt.cjs all
 *
 * Input:  configs_validated.json, uniqueness_report.json, paa_questions.json (optional)
 * Output: enhanced_prompts/config-[id]-prompt.txt
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIGS_FILE = path.join(__dirname, 'configs_validated.json');
const UNIQUENESS_REPORT = path.join(__dirname, 'uniqueness_report.json');
const PAA_FILE = path.join(__dirname, 'paa_questions.json');
const OUTPUT_DIR = path.join(__dirname, 'enhanced_prompts');
const FALLBACK_CONFIGS = path.join(__dirname, 'blogPostsConfig.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Load all data sources
function loadData() {
  const data = {
    configs: null,
    uniqueness: null,
    paa: null
  };

  // Load configs
  if (fs.existsSync(CONFIGS_FILE)) {
    const validated = JSON.parse(fs.readFileSync(CONFIGS_FILE, 'utf-8'));
    data.configs = validated.configs || validated;
  } else if (fs.existsSync(FALLBACK_CONFIGS)) {
    data.configs = JSON.parse(fs.readFileSync(FALLBACK_CONFIGS, 'utf-8'));
  } else {
    console.error('❌ No configuration file found');
    process.exit(1);
  }

  // Load uniqueness report (optional)
  if (fs.existsSync(UNIQUENESS_REPORT)) {
    data.uniqueness = JSON.parse(fs.readFileSync(UNIQUENESS_REPORT, 'utf-8'));
  }

  // Load PAA questions (optional)
  if (fs.existsSync(PAA_FILE)) {
    data.paa = JSON.parse(fs.readFileSync(PAA_FILE, 'utf-8'));
  }

  return data;
}

// Generate enhanced prompt for a single config
function generateEnhancedPrompt(config, data) {
  const configId = config.configId !== undefined ? config.configId : 0;
  const uniquenessInfo = data.uniqueness?.results?.find(r => r.configId === configId);
  const paaQuestions = data.paa?.[config.primaryKeyword] || [];

  // Build prompt sections
  const sections = [];

  // Header
  sections.push('# SEO-Optimized Blog Post Generation Request');
  sections.push('');
  sections.push(`**Configuration ID:** ${configId}`);
  sections.push(`**Template Type:** ${config.template}`);
  sections.push(`**Generated:** ${new Date().toISOString().split('T')[0]}`);
  sections.push('');
  sections.push('---');
  sections.push('');

  // Core Requirements
  sections.push('## Core Requirements');
  sections.push('');
  sections.push(`**Article Title:** ${generateTitle(config)}`);
  sections.push(`**Primary Keyword:** ${config.primaryKeyword}`);
  sections.push('');

  // Search Volume Data (if available)
  if (config.validation?.searchVolume) {
    sections.push('**Keyword Performance:**');
    sections.push(`- Search Volume: ${config.validation.searchVolume}/month`);
    sections.push(`- Competition: ${config.validation.competition} (${config.validation.competitionIndex || 'N/A'})`);
    sections.push(`- Validation Status: ${config.validation.status.toUpperCase()}`);
    sections.push('');
  }

  // Secondary Keywords
  sections.push('**Secondary Keywords:**');
  const secondaryKeywords = config.secondaryKeywords || generateSecondaryKeywords(config);
  secondaryKeywords.forEach((keyword, idx) => {
    sections.push(`${idx + 1}. ${keyword}`);
  });
  sections.push('');

  // Target Audience
  sections.push(`**Target Audience:** ${config.targetAudience || 'US residents interested in financial planning'}`);
  sections.push(`**Word Count Target:** ${config.wordCount || 900} words`);
  sections.push(`**Category:** ${config.category || getCategoryForTemplate(config.template)}`);
  sections.push('');

  // Uniqueness & Differentiation
  if (uniquenessInfo) {
    sections.push('## Uniqueness & Differentiation');
    sections.push('');
    sections.push(`**Uniqueness Score:** ${uniquenessInfo.uniquenessScore}/1.0`);

    if (uniquenessInfo.flags.length > 0) {
      sections.push('');
      sections.push('**⚠️ Important - Differentiation Required:**');
      sections.push('This topic has similarities to existing content. Ensure you differentiate by:');
      sections.push('- Using unique examples and case studies');
      sections.push('- Covering angles not addressed in existing posts');
      sections.push('- Providing 2025-specific insights and data');
      sections.push('- Adding unique value propositions');
      sections.push('');
    }

    sections.push('');
  }

  // People Also Ask Questions
  if (paaQuestions && paaQuestions.length > 0) {
    sections.push('## People Also Ask (from Google SERP)');
    sections.push('');
    sections.push('**IMPORTANT:** Use these questions for your FAQ section:');
    sections.push('');
    paaQuestions.forEach((question, idx) => {
      sections.push(`${idx + 1}. ${question}`);
    });
    sections.push('');
    sections.push('*Address all these questions in your FAQ section with comprehensive answers.*');
    sections.push('');
  }

  // Content Brief
  sections.push('## Content Brief');
  sections.push('');
  sections.push(generateContentBrief(config));
  sections.push('');

  // Template-Specific Requirements
  sections.push('## Template-Specific Requirements');
  sections.push('');
  sections.push(getTemplateRequirements(config));
  sections.push('');

  // SEO Optimization Instructions
  sections.push('## SEO Optimization Requirements');
  sections.push('');
  sections.push('**Primary Keyword Placement:**');
  sections.push('- Include in first 100 words of introduction');
  sections.push('- Use in at least 2 section headings (H2 or H3)');
  sections.push('- Include in meta description');
  sections.push('- Natural density: 1-1.5% throughout content');
  sections.push('');
  sections.push('**Secondary Keywords:**');
  sections.push('- Distribute naturally throughout content');
  sections.push('- Use in section headings where appropriate');
  sections.push('- Include variations and related terms');
  sections.push('');
  sections.push('**Internal Linking:**');
  const internalLinks = config.internalLinks || generateInternalLinks(config);
  sections.push('- Include links to the following calculators:');
  internalLinks.forEach(link => {
    sections.push(`  - ${link}`);
  });
  sections.push('');

  // Content Structure Requirements
  sections.push('## Required Content Structure');
  sections.push('');
  sections.push('**Introduction (150-200 words):**');
  sections.push('- Hook with compelling statistic or question');
  sections.push('- Include primary keyword in first 100 words');
  sections.push('- Preview main points');
  sections.push('- State article value proposition');
  sections.push('');
  sections.push('**Main Sections (4-6 sections):**');
  sections.push('- Each section 150-250 words');
  sections.push('- Use H2 for main sections, H3 for subsections');
  sections.push('- Include bullet points and lists for scannability');
  sections.push('- Add styled callout boxes for key insights');
  sections.push('');
  sections.push('**Practical Example:**');
  sections.push('- Real-world scenario with specific numbers');
  sections.push('- Step-by-step walkthrough');
  sections.push('- Demonstrate calculator usage');
  sections.push('');
  sections.push('**Conclusion (100-150 words):**');
  sections.push('- Summarize key takeaways');
  sections.push('- Include call-to-action');
  sections.push('- Link to relevant calculator(s)');
  sections.push('');
  sections.push(`**FAQ Section (${paaQuestions.length > 0 ? paaQuestions.length : 4} questions):**`);
  if (paaQuestions.length > 0) {
    sections.push('- Use PAA questions listed above');
  } else {
    sections.push('- Create 4 common questions about the topic');
  }
  sections.push('- Provide comprehensive answers (50-100 words each)');
  sections.push('');

  // Output Format Requirements
  sections.push('## Output Format Requirements');
  sections.push('');
  sections.push('**Required JSON Structure:**');
  sections.push('```json');
  sections.push('{');
  sections.push(`  "slug": "${generateSlug(config)}",`);
  sections.push(`  "title": "${generateTitle(config)}",`);
  sections.push('  "metaDescription": "[150-160 character description with primary keyword]",');
  sections.push(`  "primaryKeyword": "${config.primaryKeyword}",`);
  sections.push(`  "secondaryKeywords": ${JSON.stringify(secondaryKeywords)},`);
  sections.push(`  "category": "${config.category || getCategoryForTemplate(config.template)}",`);
  sections.push('  "publishDate": "2025-10-12",');
  sections.push(`  "readTime": "${Math.ceil((config.wordCount || 900) / 200)} min read",`);
  sections.push('  "featured": false,');
  sections.push('  "content": {');
  sections.push('    "introduction": "[HTML paragraph]",');
  sections.push('    "sections": [');
  sections.push('      { "heading": "[Section Title]", "level": "h2", "content": "[HTML]" }');
  sections.push('    ],');
  sections.push('    "practicalExample": "[HTML with specific numbers and examples]",');
  sections.push('    "conclusion": "[HTML with CTA]",');
  sections.push('    "faqs": [');
  sections.push('      { "question": "[Question]", "answer": "[Answer]" }');
  sections.push('    ]');
  sections.push('  },');
  sections.push(`  "internalLinks": ${JSON.stringify(internalLinks)},`);
  sections.push('  "author": "FinSavvy Future Forge Financial Team",');
  sections.push(`  "template": "${config.template}"`);
  sections.push('}');
  sections.push('```');
  sections.push('');

  // Quality Checklist
  sections.push('## Quality Checklist');
  sections.push('');
  sections.push('Before finalizing, ensure:');
  sections.push('- [ ] Primary keyword in first 100 words');
  sections.push('- [ ] All secondary keywords used naturally');
  sections.push('- [ ] 4+ internal links to calculators');
  sections.push(`- [ ] ${paaQuestions.length || 4} FAQ questions answered comprehensively`);
  sections.push('- [ ] Practical example with specific numbers');
  sections.push('- [ ] Meta description 150-160 characters');
  sections.push(`- [ ] Content is ${config.wordCount || 900}+ words`);
  sections.push('- [ ] All HTML tags properly closed');
  sections.push('- [ ] Professional yet accessible tone');
  sections.push('- [ ] E-E-A-T principles followed');
  sections.push('- [ ] 2025-specific information where relevant');
  sections.push('');

  return sections.join('\n');
}

// Helper: Generate title from config
function generateTitle(config) {
  if (config.title) return config.title;

  const year = new Date().getFullYear();

  switch (config.template) {
    case 'calculator-comparison':
      return `Best ${config.calculatorType} Calculator Comparison ${config.year || year}: Top Free Tools`;
    case 'location-specific':
      return `${config.calculatorType} Calculator for ${config.state} Residents: ${year} Guide`;
    case 'demographic-targeted':
      return `${config.calculatorType} Calculator for ${capitalizeWords(config.demographic)}: ${year} Planning Guide`;
    case 'vs-comparison':
      return `${config.calculator1} vs ${config.calculator2} Calculator: Which Should You Use in ${year}?`;
    default:
      return config.primaryKeyword || 'Financial Calculator Guide';
  }
}

// Helper: Generate slug
function generateSlug(config) {
  return generateTitle(config)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper: Generate secondary keywords if not provided
function generateSecondaryKeywords(config) {
  const base = config.primaryKeyword.toLowerCase();
  const type = config.calculatorType?.toLowerCase() || 'financial';

  return [
    `best ${type} calculator`,
    `free ${type} calculator`,
    `${type} calculator comparison`,
    `${type} calculator features`,
    `accurate ${type} calculator`
  ];
}

// Helper: Get category for template
function getCategoryForTemplate(template) {
  const categories = {
    'calculator-comparison': 'Calculator Guides',
    'location-specific': 'State-Specific Guides',
    'demographic-targeted': 'Demographic Guides',
    'vs-comparison': 'Calculator Comparisons'
  };
  return categories[template] || 'Financial Tools';
}

// Helper: Generate internal links
function generateInternalLinks(config) {
  const type = config.calculatorType?.toLowerCase().replace(/\s+/g, '-') || 'compound-interest';
  return [`/calculators/${type}`];
}

// Helper: Generate content brief based on template
function generateContentBrief(config) {
  // (Reusing content from generateBlogPostsWithAgent.cjs - too long to duplicate here)
  // This would be imported from the existing template generation logic
  return `Create a comprehensive ${config.template} guide for "${config.primaryKeyword}". The article should provide genuine value to ${config.targetAudience || 'readers'}, include real examples with specific numbers, and help users make informed decisions about financial calculators. Focus on actionable advice and avoid generic content.`;
}

// Helper: Get template-specific requirements
function getTemplateRequirements(config) {
  const requirements = {
    'calculator-comparison': `
**Calculator Comparison Requirements:**
- Compare 4-6 calculators (include Fintoolslab as recommended option)
- Create comparison criteria (accuracy, features, ease of use, mobile support)
- Provide clear "Best for" recommendations
- Include pros/cons for each calculator
- Add decision framework to help users choose`,

    'location-specific': `
**Location-Specific Requirements:**
- State tax rate: ${config.stateTaxRate || 0}% for ${config.state || 'the state'}
- Include ${config.state || 'state'}-specific tax implications
- Discuss local cost of living factors
- Provide ${config.state || 'state'}-relevant examples
- Link to state-specific resources where appropriate`,

    'demographic-targeted': `
**Demographic-Targeted Requirements:**
- Focus on ${config.demographic || 'target demographic'} (ages ${config.ageRange || 'various'})
- Address life-stage-specific challenges
- Use relatable examples for this demographic
- Provide age-appropriate financial advice
- Motivational and empowering tone`,

    'vs-comparison': `
**VS Comparison Requirements:**
- Clearly explain what each calculator does
- Create side-by-side comparison table
- Provide use case scenarios for each
- Include decision flowchart or guidelines
- Help users understand when to use which tool`
  };

  return requirements[config.template] || 'Provide comprehensive, actionable content with real examples.';
}

// Helper: Capitalize words
function capitalizeWords(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

// Main function
async function enhancePrompts() {
  const args = process.argv.slice(2);
  const targetConfigId = args[0];

  console.log('📝 Enhanced Prompt Generator Starting...\n');

  const data = loadData();
  console.log(`📋 Loaded ${data.configs.length} configurations`);

  if (data.uniqueness) {
    console.log(`✅ Uniqueness data loaded (${data.uniqueness.summary.approved} approved)`);
  } else {
    console.log('⚠️  No uniqueness data found (run checkUniqueness.cjs first)');
  }

  if (data.paa) {
    const paaCount = Object.keys(data.paa).length;
    console.log(`✅ PAA questions loaded for ${paaCount} keywords`);
  } else {
    console.log('⚠️  No PAA data found (run scrapePAALocal.cjs for better results)');
  }

  console.log('');

  // Determine which configs to process
  let configsToProcess;
  if (!targetConfigId || targetConfigId === 'all') {
    // Process only approved configs if uniqueness data available
    if (data.uniqueness) {
      configsToProcess = data.configs.filter(c => {
        const configId = c.configId !== undefined ? c.configId : data.configs.indexOf(c);
        return data.uniqueness.approved.includes(configId);
      });
      console.log(`Processing ${configsToProcess.length} approved configurations (skipping ${data.configs.length - configsToProcess.length} with conflicts)`);
    } else {
      configsToProcess = data.configs;
      console.log(`Processing all ${configsToProcess.length} configurations`);
    }
  } else {
    const id = parseInt(targetConfigId);
    configsToProcess = data.configs.filter(c => (c.configId !== undefined ? c.configId : data.configs.indexOf(c)) === id);
    if (configsToProcess.length === 0) {
      console.error(`❌ Config ID ${id} not found`);
      process.exit(1);
    }
    console.log(`Processing single configuration: #${id}`);
  }

  console.log('');

  // Generate prompts
  let generated = 0;
  configsToProcess.forEach(config => {
    const configId = config.configId !== undefined ? config.configId : data.configs.indexOf(config);
    const promptContent = generateEnhancedPrompt(config, data);
    const filename = `config-${configId}-${generateSlug(config).slice(0, 50)}.txt`;
    const filepath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(filepath, promptContent);
    console.log(`✅ Generated: ${filename}`);
    generated++;
  });

  console.log('');
  console.log('='.repeat(80));
  console.log(`✅ Generated ${generated} enhanced prompts`);
  console.log(`📁 Location: ${OUTPUT_DIR}`);
  console.log('');
  console.log('📋 NEXT STEPS:');
  console.log('   1. Review prompts in enhanced_prompts/ directory');
  console.log('   2. Copy a prompt and use with seo-content-strategist agent');
  console.log('   3. Save agent output to src/data/blog/posts/[slug].json');
  console.log('   4. Run: node scripts/updateBlogIndex.cjs');
  console.log('='.repeat(80));
}

// Run
enhancePrompts().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
