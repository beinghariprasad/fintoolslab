/**
 * Agent-Powered Blog Post Generator
 *
 * This script reads blog post configurations and generates detailed
 * specifications for the seo-content-strategist agent to create
 * high-quality, SEO-optimized content.
 *
 * Usage:
 * 1. Run: node scripts/generateBlogPostsWithAgent.cjs <config-index>
 * 2. Copy the generated prompt
 * 3. Use with seo-content-strategist agent in Claude Code
 * 4. Save the agent's output to the posts directory
 */

const fs = require('fs');
const path = require('path');

// Load blog post configurations
const configPath = path.join(__dirname, 'blogPostsConfig.json');
const configs = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Get config index from command line args (default to 0)
const configIndex = parseInt(process.argv[2] || '0', 10);

if (configIndex < 0 || configIndex >= configs.length) {
  console.error(`❌ Invalid config index: ${configIndex}`);
  console.error(`   Available indices: 0-${configs.length - 1}`);
  process.exit(1);
}

const config = configs[configIndex];

// Helper function to create slug
const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Generate template-specific prompts
const generatePromptForTemplate = (config) => {
  const currentYear = new Date().getFullYear();
  const publishDate = new Date().toISOString().split('T')[0];

  switch (config.template) {
    case 'calculator-comparison':
      return {
        title: `Best ${config.calculatorType} Calculator Comparison ${config.year}: Top Free Tools`,
        slug: createSlug(`Best ${config.calculatorType} Calculator Comparison ${config.year} Top Free Tools`),
        primaryKeyword: config.primaryKeyword,
        secondaryKeywords: [
          `compare ${config.calculatorType.toLowerCase()} calculators`,
          `best ${config.calculatorType.toLowerCase()} calculator`,
          `free ${config.calculatorType.toLowerCase()} calculator`,
          `${config.calculatorType.toLowerCase()} calculator features ${config.year}`,
          `accurate ${config.calculatorType.toLowerCase()} calculator`
        ],
        category: 'Calculator Guides',
        targetAudience: config.targetAudience,
        wordCount: config.wordCount,
        publishDate,
        contentBrief: `Create a comprehensive comparison guide of the best ${config.calculatorType.toLowerCase()} calculators available in ${config.year}. The article should:

1. Explain why ${config.calculatorType.toLowerCase()} calculators are important for financial planning
2. List key features to compare when evaluating calculators
3. Compare top calculators (including our Fintoolslab ${config.calculatorType} Calculator at /calculators/${config.calculatorType.toLowerCase().replace(/\s+/g, '-')})
4. Provide guidance on choosing the right calculator
5. Highlight common mistakes to avoid

Target audience: ${config.targetAudience}
Primary keyword: ${config.primaryKeyword}
Tone: Professional yet accessible, educational, action-oriented
Include: Real examples, practical tips, internal links to our calculator`,
        internalLinks: [`/calculators/${config.calculatorType.toLowerCase().replace(/\s+/g, '-')}`],
        template: 'calculator-comparison'
      };

    case 'location-specific':
      return {
        title: `${config.calculatorType} Calculator for ${config.state} Residents: ${currentYear} Guide`,
        slug: createSlug(`${config.calculatorType} Calculator for ${config.state} Residents ${currentYear} Guide`),
        primaryKeyword: config.primaryKeyword,
        secondaryKeywords: [
          `${config.state} ${config.calculatorType.toLowerCase()} calculator`,
          `${config.calculatorType.toLowerCase()} planning ${config.state}`,
          `${config.state} financial calculator`,
          `${config.state} tax rates calculator`,
          `${config.state} residents financial planning`
        ],
        category: 'State-Specific Guides',
        targetAudience: config.targetAudience,
        wordCount: config.wordCount,
        publishDate,
        contentBrief: `Create a state-specific guide for ${config.state} residents using ${config.calculatorType.toLowerCase()} calculators. The article should:

1. Explain why ${config.state}-specific calculations matter
2. Detail ${config.state}'s tax considerations (${config.stateTaxRate}% state income tax)
3. Discuss cost-of-living adjustments for ${config.state}
4. Provide step-by-step instructions for ${config.state} residents
5. Include ${config.state}-specific examples and scenarios

Target audience: ${config.targetAudience}
Primary keyword: ${config.primaryKeyword}
State tax rate: ${config.stateTaxRate}%
Include: ${config.state}-specific tax information, local cost factors, practical examples`,
        internalLinks: [`/calculators/${config.calculatorType.toLowerCase().replace(/\s+/g, '-')}`],
        template: 'location-specific',
        stateData: {
          state: config.state,
          taxRate: config.stateTaxRate
        }
      };

    case 'demographic-targeted':
      return {
        title: `${config.calculatorType} Calculator for ${config.demographic}: ${currentYear} Planning Guide`,
        slug: createSlug(`${config.calculatorType} Calculator for ${config.demographic} ${currentYear} Planning Guide`),
        primaryKeyword: config.primaryKeyword,
        secondaryKeywords: [
          `${config.demographic} ${config.calculatorType.toLowerCase()} calculator`,
          `${config.calculatorType.toLowerCase()} planning for ${config.demographic}`,
          `${config.demographic} financial planning`,
          `${config.demographic} savings strategy`,
          `best calculator for ${config.demographic}`
        ],
        category: 'Demographic Guides',
        targetAudience: config.targetAudience,
        wordCount: config.wordCount,
        publishDate,
        contentBrief: `Create a demographic-targeted guide for ${config.demographic} (ages ${config.ageRange}) using ${config.calculatorType.toLowerCase()} calculators. The article should:

1. Address unique challenges faced by ${config.demographic}
2. Explain calculator features most relevant to this demographic
3. Provide age-appropriate financial planning strategies
4. Include realistic scenarios for ${config.demographic}
5. Offer actionable advice specific to this life stage

Target audience: ${config.targetAudience}
Primary keyword: ${config.primaryKeyword}
Age range: ${config.ageRange}
Include: Life-stage-specific advice, relatable examples, motivational content`,
        internalLinks: [`/calculators/${config.calculatorType.toLowerCase().replace(/\s+/g, '-')}`],
        template: 'demographic-targeted'
      };

    case 'vs-comparison':
      return {
        title: `${config.calculator1} vs ${config.calculator2} Calculator: Which Should You Use in ${currentYear}?`,
        slug: createSlug(`${config.calculator1} vs ${config.calculator2} Calculator Which Should You Use ${currentYear}`),
        primaryKeyword: config.primaryKeyword,
        secondaryKeywords: [
          `${config.calculator1.toLowerCase()} calculator vs ${config.calculator2.toLowerCase()} calculator`,
          `difference between ${config.calculator1.toLowerCase()} and ${config.calculator2.toLowerCase()} calculator`,
          `when to use ${config.calculator1.toLowerCase()} calculator`,
          `when to use ${config.calculator2.toLowerCase()} calculator`,
          `choosing financial calculator`
        ],
        category: 'Calculator Comparisons',
        targetAudience: config.targetAudience,
        wordCount: config.wordCount,
        publishDate,
        contentBrief: `Create a detailed comparison between ${config.calculator1} and ${config.calculator2} calculators. The article should:

1. Explain what each calculator does and when to use it
2. Compare key features and use cases
3. Provide side-by-side scenario comparisons
4. Help readers choose the right calculator for their needs
5. Include decision-making flowchart or guidelines

Target audience: ${config.targetAudience}
Primary keyword: ${config.primaryKeyword}
Include: Clear use-case scenarios, comparison tables, decision guidance`,
        internalLinks: [
          `/calculators/${config.calculator1.toLowerCase().replace(/\s+/g, '-')}`,
          `/calculators/${config.calculator2.toLowerCase().replace(/\s+/g, '-')}`
        ],
        template: 'vs-comparison'
      };

    default:
      throw new Error(`Unknown template: ${config.template}`);
  }
};

const spec = generatePromptForTemplate(config);

console.log('\n' + '='.repeat(80));
console.log(`📝 Blog Post Specification #${configIndex}`);
console.log('='.repeat(80));
console.log(`\nTitle: ${spec.title}`);
console.log(`Slug: ${spec.slug}`);
console.log(`Template: ${spec.template}`);
console.log(`Primary Keyword: ${spec.primaryKeyword}`);
console.log(`Target Word Count: ${spec.wordCount}`);
console.log(`Category: ${spec.category}`);
console.log('\n' + '-'.repeat(80));
console.log('CONTENT BRIEF:');
console.log('-'.repeat(80));
console.log(spec.contentBrief);
console.log('\n' + '-'.repeat(80));
console.log('METADATA:');
console.log('-'.repeat(80));
console.log(JSON.stringify({
  slug: spec.slug,
  title: spec.title,
  primaryKeyword: spec.primaryKeyword,
  secondaryKeywords: spec.secondaryKeywords,
  category: spec.category,
  publishDate: spec.publishDate,
  wordCount: spec.wordCount,
  internalLinks: spec.internalLinks,
  template: spec.template,
  ...(spec.stateData && { stateData: spec.stateData })
}, null, 2));
console.log('\n' + '='.repeat(80));
console.log('📋 NEXT STEPS:');
console.log('='.repeat(80));
console.log('1. Copy the content brief above');
console.log('2. Use the seo-content-strategist agent in Claude Code');
console.log('3. Request a blog post with the above specifications');
console.log('4. Save the agent output as: src/data/blog/posts/' + spec.slug + '.json');
console.log('5. Run: node scripts/updateBlogIndex.cjs');
console.log('='.repeat(80) + '\n');

// Save specification to a temp file for easy reference
const tempDir = path.join(__dirname, '../.temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
const specPath = path.join(tempDir, `spec-${configIndex}-${spec.slug}.json`);
fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));
console.log(`💾 Specification saved to: ${specPath}\n`);
