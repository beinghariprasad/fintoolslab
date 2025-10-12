# Blog Generation Workflow with SEO Content Strategist Agent

This document explains how to generate high-quality, SEO-optimized blog posts for Fintoolslab.com using the seo-content-strategist agent.

## Overview

The blog generation system uses a two-part approach:
1. **Configuration-driven specs** - Define blog post topics and requirements in `blogPostsConfig.json`
2. **AI-powered content creation** - Use the seo-content-strategist agent to generate publication-ready content

This workflow ensures consistent quality, proper SEO optimization, and adherence to E-E-A-T principles across all blog posts.

## Prerequisites

- Node.js installed for running scripts
- Access to Claude Code with seo-content-strategist agent
- Familiarity with basic command line operations

## File Structure

```
scripts/
├── blogPostsConfig.json          # All blog post specifications
├── generateBlogPostsWithAgent.cjs # Generates prompts for agent
├── updateBlogIndex.cjs           # Updates blog-posts.json index
└── README-BLOG-GENERATION.md     # This file

src/data/blog/
├── blog-posts.json               # Index of all blog posts (auto-generated)
└── posts/                        # Individual blog post JSON files
    └── [slug].json
```

## Step-by-Step Workflow

### Step 1: Configure Blog Post Topics

Edit `scripts/blogPostsConfig.json` to add new blog post specifications. Each entry should include:

```json
{
  "template": "calculator-comparison",
  "calculatorType": "Compound Interest",
  "year": "2025",
  "primaryKeyword": "compound interest calculator comparison 2025",
  "targetAudience": "US residents planning long-term savings",
  "wordCount": 900
}
```

**Available Templates:**
- `calculator-comparison` - Compare calculators (e.g., "Best X Calculator Comparison 2025")
- `location-specific` - State-specific guides (e.g., "Calculator for California Residents")
- `demographic-targeted` - Age/demographic guides (e.g., "Calculator for Millennials")
- `vs-comparison` - Tool vs tool (e.g., "Calculator A vs Calculator B")

### Step 2: Generate Content Specification

Run the specification generator with the config index (0-based):

```bash
node scripts/generateBlogPostsWithAgent.cjs 0
```

This outputs:
- Title, slug, keywords, and metadata
- Detailed content brief for the agent
- JSON specification saved to `.temp/` directory

**Example Output:**
```
================================================================================
📝 Blog Post Specification #0
================================================================================

Title: Best Compound Interest Calculator Comparison 2025: Top Free Tools
Slug: best-compound-interest-calculator-comparison-2025-top-free-tools
Primary Keyword: compound interest calculator comparison 2025
Target Word Count: 900

CONTENT BRIEF:
Create a comprehensive comparison guide of the best compound interest calculators...
```

### Step 3: Generate Content with SEO Agent

**In Claude Code:**

1. Copy the content brief from the console output
2. Launch the seo-content-strategist agent:
   ```
   Use the Task tool with seo-content-strategist agent
   ```
3. Provide the content brief as the prompt
4. Request output in the BlogPost JSON format

The agent will create:
- SEO-optimized content (900+ words)
- Proper keyword placement
- E-E-A-T compliant content
- Schema.org structured data
- Internal linking strategy
- FAQ section

### Step 4: Save Generated Content

The agent outputs a JSON file. Process it:

1. **Read the agent's output** - Usually saved to a temp location
2. **Clean the JSON** - Remove extra metadata fields (seoMetadata, editorialNotes)
3. **Save to posts directory**:
   ```bash
   # The slug from the specification
   src/data/blog/posts/[slug].json
   ```

**Required JSON Structure:**
```json
{
  "slug": "...",
  "title": "...",
  "metaDescription": "...",
  "primaryKeyword": "...",
  "secondaryKeywords": [...],
  "category": "...",
  "publishDate": "YYYY-MM-DD",
  "readTime": "X min read",
  "featured": false,
  "content": {
    "introduction": "<p>HTML content</p>",
    "sections": [
      {
        "heading": "Section Title",
        "level": "h2",
        "content": "<p>HTML content</p>"
      }
    ],
    "practicalExample": "<p>HTML content</p>",
    "conclusion": "<p>HTML content</p>",
    "faqs": [
      {
        "question": "...",
        "answer": "..."
      }
    ]
  },
  "internalLinks": ["/calculators/..."],
  "author": "FinSavvy Future Forge Financial Team",
  "template": "calculator-comparison"
}
```

### Step 5: Update Blog Index

After saving the blog post JSON, update the index:

```bash
node scripts/updateBlogIndex.cjs
```

This automatically:
- Scans all files in `src/data/blog/posts/`
- Extracts metadata from each post
- Generates `src/data/blog/blog-posts.json`
- Sorts posts by publish date (newest first)

### Step 6: Verify Build

Test that everything compiles correctly:

```bash
npm run build
```

The new post should appear as a separate code-split chunk in the build output.

### Step 7: Test in Development

Start the dev server and navigate to the blog:

```bash
npm run dev
# Visit http://localhost:8080/blog
# Click the new blog post
# Verify content renders correctly
```

### Step 8: Commit and Deploy

```bash
git add src/data/blog/posts/[slug].json
git add src/data/blog/blog-posts.json
git add scripts/blogPostsConfig.json  # If you added new configs
git commit -m "Add blog post: [Title]"
git push
```

## Template-Specific Guidelines

### Calculator Comparison Template

**Good for:**
- Comparing multiple calculators for the same purpose
- Feature-by-feature analysis
- User type recommendations

**Required fields:**
- `calculatorType` (e.g., "Retirement", "Mortgage")
- `year` (e.g., "2025")
- `primaryKeyword`
- `targetAudience`

**Content should include:**
- Why the calculator type matters
- Key features to compare
- Top 3-5 calculator reviews
- Selection guidance
- Common mistakes

### Location-Specific Template

**Good for:**
- State or region-specific financial planning
- Tax considerations by location
- Local cost-of-living adjustments

**Required fields:**
- `calculatorType`
- `state` (e.g., "California", "Texas")
- `stateTaxRate` (e.g., 9.3 for CA, 0 for TX)
- `primaryKeyword`
- `targetAudience`

**Content should include:**
- State-specific factors
- Tax implications
- Local cost adjustments
- Regional examples

### Demographic-Targeted Template

**Good for:**
- Age-specific planning advice
- Life-stage financial guidance
- Generational wealth building

**Required fields:**
- `calculatorType`
- `demographic` (e.g., "millennials", "retirees")
- `ageRange` (e.g., "25-40")
- `primaryKeyword`
- `targetAudience`

**Content should include:**
- Demographic-specific challenges
- Life-stage considerations
- Relevant scenarios
- Age-appropriate strategies

### VS Comparison Template

**Good for:**
- Deciding between two tools
- Understanding use case differences
- Feature comparison

**Required fields:**
- `calculator1` (e.g., "Compound Interest")
- `calculator2` (e.g., "Savings")
- `primaryKeyword`
- `targetAudience`

**Content should include:**
- What each tool does
- When to use each
- Side-by-side comparison
- Decision framework

## Quality Checklist

Before publishing, verify:

- [ ] Primary keyword appears in first 100 words
- [ ] All secondary keywords used naturally
- [ ] Internal links to relevant calculators
- [ ] 3-4 FAQs with comprehensive answers
- [ ] Practical example with specific numbers
- [ ] Meta description 150-160 characters
- [ ] Content is 800-1000 words
- [ ] All HTML tags properly closed
- [ ] Schema.org data included (auto-generated by template)
- [ ] E-E-A-T principles followed
- [ ] US-specific information and context
- [ ] Professional yet accessible tone

## Scaling to 100+ Posts

To generate the full suite of blog posts:

1. **Add all topics to `blogPostsConfig.json`**
   - Calculator comparisons (all calculator types)
   - Location-specific guides (top 50 US states)
   - Demographic guides (various age groups)
   - VS comparisons (all tool pairings)

2. **Batch generate specifications**
   ```bash
   # Generate specs for posts 0-9
   for i in {0..9}; do
     node scripts/generateBlogPostsWithAgent.cjs $i
   done
   ```

3. **Create content in batches**
   - Use seo-content-strategist agent for 5-10 posts per session
   - Maintain consistency across posts
   - Vary examples and language to avoid repetition

4. **Update sitemap after each batch**
   - Add new URLs to `public/sitemap.xml`
   - Update lastmod dates

5. **Monitor performance**
   - Track indexing in Google Search Console
   - Monitor for duplicate content issues
   - Adjust templates based on performance

## Troubleshooting

**Build errors:**
- Ensure JSON is valid (use JSONLint if needed)
- Check all HTML tags are properly closed
- Verify slug matches filename

**Content not appearing:**
- Run `updateBlogIndex.cjs` after adding posts
- Check slug in URL matches filename
- Clear browser cache

**SEO issues:**
- Verify meta description length
- Check keyword placement
- Ensure internal links use correct paths

## Best Practices

1. **Use conservative estimates** in financial examples
2. **Cite authoritative sources** (government sites, established financial institutions)
3. **Maintain consistent tone** across all posts
4. **Update dates annually** for evergreen content
5. **Monitor competitor content** for topic gaps
6. **Track keyword rankings** to identify optimization opportunities
7. **Refresh underperforming content** quarterly

## Maintenance

**Monthly:**
- Review top-performing posts
- Update statistics and examples
- Check for broken internal links

**Quarterly:**
- Refresh dates on time-sensitive content
- Add new FAQ questions based on user queries
- Update calculator comparisons if features change

**Annually:**
- Complete content audit
- Update all year-specific references
- Refresh all examples and scenarios

## Support

For issues or questions about the blog generation workflow:
1. Check this documentation
2. Review example posts in `src/data/blog/posts/`
3. Examine the TypeScript interface in `src/types/blog.ts`
4. Test with a simple post first before scaling

---

**Last Updated:** 2025-10-12
**Version:** 1.0
