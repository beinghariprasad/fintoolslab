# Blog Generation Automation Guide

**Automate SEO blog generation with Claude Code's seo-content-strategist agent**

## Overview

This guide explains how to integrate the zero-cost SEO workflow with automated blog generation. It covers:
- **Semi-Automated Workflow** (Recommended, $0 cost)
- **Scheduled Generation** (Batch processing)
- **Full Automation** (Requires API access, costs apply)

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Zero-Cost SEO Workflow (batchOrchestrator.cjs)            │
│                                                              │
│  Stage 1: Keyword Validation  → configs_validated.json     │
│  Stage 2: Uniqueness Check    → uniqueness_report.json     │
│  Stage 3: PAA Scraping        → paa_questions.json         │
│  Stage 4: Enhanced Prompts    → enhanced_prompts/*.txt     │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Blog Batch Processor (processBlogBatch.cjs)               │
│                                                              │
│  • Tracks processed vs pending prompts                     │
│  • Provides task lists for Claude Code                     │
│  • Saves agent outputs automatically                       │
│  • Updates blog index                                       │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Claude Code + seo-content-strategist Agent                │
│                                                              │
│  Task tool → Agent generates blog post JSON                │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Blog Posts → Index → Build → Deploy                       │
│                                                              │
│  src/data/blog/posts/*.json → blog-posts.json → Vercel     │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflow Options

### Option 1: Semi-Automated (Recommended - $0 Cost)

**Best for:** Quality content, zero API costs, manageable batches

**Process:**
1. Generate enhanced prompts (automated)
2. Use prompts with Claude Code agent (manual/interactive)
3. Save outputs and update index (automated)
4. Build and deploy (automated)

**Time investment:** 2-3 minutes per blog post
**Cost:** $0.00

---

### Option 2: Scheduled Batch Processing

**Best for:** Regular content generation, consistent publishing schedule

**Process:**
1. Schedule workflow runs (daily/weekly)
2. Process prompts in batches during dedicated sessions
3. Automated building and deployment

**Time investment:** 30-60 minutes per scheduled session
**Cost:** $0.00

---

### Option 3: Full Automation (Requires API)

**Best for:** High-volume generation, hands-off operation

**Requirements:**
- Claude API key (costs apply)
- API integration script
- Automated error handling

**Time investment:** Initial setup only
**Cost:** ~$0.50-$2.00 per blog post (API usage)

⚠️ **Note:** This violates the "zero-cost" principle and is not included in this guide.

---

## Semi-Automated Workflow (Detailed)

### Step 1: Generate Enhanced Prompts

**Frequency:** Once per batch (20 posts)

```bash
# Run complete workflow
cd D:\FTL\fin-savvy-future-forge
node scripts/batchOrchestrator.cjs all
```

**Output:**
- `scripts/enhanced_prompts/config-*.txt` (ready for agent)

**Time:** 25-35 minutes (includes human approval checkpoints)

---

### Step 2: Check Pending Prompts

```bash
node scripts/processBlogBatch.cjs list
```

**Example Output:**
```
⏳ PENDING (10):
──────────────────────────────────────────────────────────────

[0] Best Savings Calculator Comparison 2025: Top Free Tools
    Keyword: savings calculator comparison 2025
    File: config-3-best-savings-calculator-comparison-2025.txt (4.2 KB)

[1] Mortgage Calculator for New York Residents 2025
    Keyword: mortgage calculator for new york residents
    File: config-4-mortgage-calculator-for-new-york.txt (4.3 KB)

... (8 more)

📋 NEXT STEPS:
Option 1: Manual Processing (Recommended for Quality)
  1. Copy prompt content from enhanced_prompts/ directory
  2. In Claude Code, use Task tool with seo-content-strategist agent
  3. Save agent output using: node scripts/processBlogBatch.cjs save <id>
```

---

### Step 3: Process Prompts with Claude Code Agent

**For each pending prompt:**

1. **Read the enhanced prompt:**
   ```bash
   # Example for prompt ID 0
   cat scripts/enhanced_prompts/config-3-best-savings-calculator-comparison-2025.txt
   ```

2. **In Claude Code, use Task tool:**

   In your Claude Code chat, type:

   ```
   Use the Task tool with seo-content-strategist agent to generate a blog post.

   Read the enhanced prompt from:
   D:\FTL\fin-savvy-future-forge\scripts\enhanced_prompts\config-3-best-savings-calculator-comparison-2025.txt

   Generate the complete blog post JSON according to the prompt requirements.
   ```

3. **Claude Code will:**
   - Launch the seo-content-strategist agent
   - Read the enhanced prompt
   - Generate comprehensive blog post JSON
   - Return the result to you

4. **Save the output:**
   ```bash
   node scripts/processBlogBatch.cjs save 0
   ```

   Then paste the JSON output when prompted (or save to file first).

**Time per post:** 2-3 minutes (agent generation + saving)

---

### Step 4: Verify and Deploy

After processing all prompts:

```bash
# Verify blog index was updated
cat src/data/blog/blog-posts.json

# Build and test
npm run build
npm run preview

# Commit and deploy
git add .
git commit -m "Add batch of SEO-optimized blog posts"
git push
```

**Time:** 5 minutes

---

## Batch Processing Strategy

### Recommended Batch Sizes

| Batch Size | Time Investment | Use Case |
|------------|----------------|----------|
| **5 posts** | 15-20 minutes | Quick wins, testing |
| **10 posts** | 30-40 minutes | Weekly generation |
| **20 posts** | 60-90 minutes | Monthly generation |
| **50 posts** | 2.5-3.5 hours | One-time bulk setup |

### Example Weekly Schedule

**Monday (30 mins):**
- Generate 10 enhanced prompts
- Review and approve at checkpoints

**Tuesday-Friday (10 mins/day):**
- Process 2-3 prompts per day with agent
- Save outputs automatically

**Friday (10 mins):**
- Build, test, commit, deploy
- Review analytics

**Total time:** ~1 hour/week for 10 blog posts

---

## Scheduling with Task Scheduler

### Windows Task Scheduler

**Schedule enhanced prompt generation:**

1. Open Task Scheduler
2. Create Basic Task
3. Configure:
   - **Trigger:** Weekly, Monday 9:00 AM
   - **Action:** Start a program
   - **Program:** `node`
   - **Arguments:** `scripts\batchOrchestrator.cjs validate uniqueness enhance`
   - **Start in:** `D:\FTL\fin-savvy-future-forge`

**Note:** PAA scraping skipped for reliability (optional stage)

**Create notification:**
```powershell
# Add to task's "Actions" tab
powershell.exe -Command "& {[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('Enhanced prompts ready! Process with Claude Code.', 'Blog Generation')}"
```

---

### macOS/Linux Cron

**Edit crontab:**
```bash
crontab -e
```

**Add entry (every Monday at 9 AM):**
```cron
0 9 * * 1 cd /path/to/fin-savvy-future-forge && node scripts/batchOrchestrator.cjs validate uniqueness enhance > /tmp/blog-gen.log 2>&1
```

**Add notification (macOS):**
```bash
0 9 * * 1 cd /path/to/fin-savvy-future-forge && node scripts/batchOrchestrator.cjs validate uniqueness enhance && osascript -e 'display notification "Enhanced prompts ready!" with title "Blog Generation"'
```

**Add notification (Linux):**
```bash
0 9 * * 1 cd /path/to/fin-savvy-future-forge && node scripts/batchOrchestrator.cjs validate uniqueness enhance && notify-send "Blog Generation" "Enhanced prompts ready!"
```

---

## Automated Saving with File Monitoring

For power users who want to streamline saving agent outputs:

### Option 1: Save to File, Then Import

**Workflow:**
1. Configure Claude Code to save agent outputs to a specific directory
2. Run import script to process all files

**Create import script:**
```bash
#!/bin/bash
# import-agent-outputs.sh

OUTPUT_DIR="D:/FTL/fin-savvy-future-forge/agent-outputs"
PROMPT_ID=0

for file in "$OUTPUT_DIR"/*.json; do
  echo "Processing: $file"
  node scripts/processBlogBatch.cjs save $PROMPT_ID "$file"
  PROMPT_ID=$((PROMPT_ID + 1))
  rm "$file"  # Remove after import
done
```

---

### Option 2: Clipboard Monitoring (Advanced)

**Windows PowerShell script:**
```powershell
# monitor-clipboard.ps1
# Monitors clipboard for JSON blog posts and auto-saves

while ($true) {
  $clip = Get-Clipboard -Raw

  if ($clip -match '"slug":\s*"' -and $clip -match '"content":') {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $outputPath = "D:\FTL\fin-savvy-future-forge\agent-outputs\post_$timestamp.json"

    $clip | Out-File -FilePath $outputPath -Encoding UTF8

    Write-Host "✅ Saved blog post to: $outputPath"

    # Play sound notification
    [System.Media.SystemSounds]::Asterisk.Play()
  }

  Start-Sleep -Seconds 5
}
```

**Usage:**
1. Start script: `powershell -File monitor-clipboard.ps1`
2. Copy agent JSON output to clipboard
3. Script auto-saves to file
4. Import with: `node scripts/processBlogBatch.cjs save <id> <file>`

---

## Integration with Existing Templates

### BlogPostTemplate.tsx

The enhanced prompts already specify the exact JSON format expected by your template:

```typescript
// src/pages/blog/BlogPostTemplate.tsx expects:
{
  slug: string,
  title: string,
  metaDescription: string,
  primaryKeyword: string,
  secondaryKeywords: string[],
  category: string,
  publishDate: string,
  readTime: string,
  featured: boolean,
  content: {
    introduction: string,      // HTML
    sections: Section[],        // Array of {heading, level, content}
    practicalExample: string,   // HTML
    conclusion: string,         // HTML
    faqs: FAQ[]                 // Array of {question, answer}
  },
  internalLinks: string[],
  author: string,
  template: string
}
```

✅ **seo-content-strategist agent outputs exactly this format!**

No manual conversion needed - the agent output can be saved directly.

---

## Quality Assurance Workflow

### Before Saving (Manual Check)

Review agent output for:
- [ ] All required JSON fields present
- [ ] Word count meets target (check content.sections length)
- [ ] Internal links are valid paths
- [ ] FAQ section has 4+ questions
- [ ] Meta description is 150-160 characters
- [ ] HTML tags properly closed

### After Saving (Automated Check)

```bash
# Validate JSON structure
node -e "const post = require('./src/data/blog/posts/[slug].json'); console.log('Valid:', !!post.content)"

# Check word count
node scripts/validateBlogPost.cjs [slug]
```

**Create validation script:**
```javascript
// scripts/validateBlogPost.cjs
const fs = require('fs');
const post = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));

const wordCount = post.content.sections
  .map(s => s.content.replace(/<[^>]*>/g, '').split(/\s+/).length)
  .reduce((a, b) => a + b, 0);

console.log(`Word count: ${wordCount}`);
console.log(wordCount >= 800 ? '✅ Meets minimum' : '❌ Too short');
```

---

## Troubleshooting

### Issue: "Agent output is not valid JSON"

**Symptom:** Error when saving agent output

**Solution:**
1. Check that you copied the complete JSON (starting with `{`, ending with `}`)
2. Ensure no extra text before/after JSON
3. Validate JSON: https://jsonlint.com/
4. Re-run agent if output was truncated

---

### Issue: "Prompt ID not found"

**Symptom:** `❌ Error: Prompt ID X not found`

**Solution:**
1. Run `node scripts/processBlogBatch.cjs list` to see valid IDs
2. IDs start at 0, not 1
3. IDs correspond to file order in `enhanced_prompts/` directory

---

### Issue: "Blog index not updating"

**Symptom:** New posts don't appear in blog list

**Solution:**
```bash
# Manually update blog index
node scripts/updateBlogIndex.cjs

# Verify
cat src/data/blog/blog-posts.json | grep "slug"
```

---

### Issue: "Agent takes too long"

**Symptom:** seo-content-strategist agent times out

**Solution:**
1. Check prompt word count target (reduce if >2500 words)
2. Remove PAA questions section from prompt if too many
3. Process prompts during off-peak hours
4. Split large batches into smaller chunks

---

## Performance Optimization

### Parallel Processing

Process multiple prompts simultaneously in different Claude Code sessions:

**Terminal 1:**
```bash
# Process prompts 0-4
claude code
```

**Terminal 2:**
```bash
# Process prompts 5-9
claude code
```

Each session can process 2-3 prompts per hour.

**Time savings:** 50% faster for batches of 10+

---

### Caching Strategy

**Enhanced prompts are cached:**
- Re-running Stage 4 (enhance) regenerates prompts
- Original prompts remain in `enhanced_prompts/`
- Processed tracker prevents duplicate work

**Best practice:**
- Keep `enhanced_prompts/` directory
- Only delete after all posts are published
- Backup before major changes

---

## Scaling to 100+ Posts

### Month 1: Foundation (20 posts)
- **Week 1:** Generate 10 prompts, process 10 posts
- **Week 2:** Generate 10 prompts, process 10 posts
- **Week 3:** Monitor analytics, adjust strategy
- **Week 4:** Review and optimize

### Month 2-3: Ramp Up (40 posts each)
- **Batch size:** 20 prompts/week
- **Processing:** 10 posts/weekday (2 per day)
- **Weekend:** Review, optimize, publish

### Month 4: Maintenance (20 posts)
- Focus on high-performing keywords
- Refresh older content
- Monitor rankings

**Total:** 120 posts in 4 months
**Time investment:** 2-3 hours/week
**Cost:** $0.00

---

## API Integration (Optional - Costs Apply)

For users who want full automation with Claude API:

### Requirements
- Anthropic API key
- Node.js API client
- Error handling and retry logic
- Cost monitoring

### Estimated Costs

**Per blog post (2000 words):**
- Prompt tokens: ~5,000 tokens ($0.015)
- Completion tokens: ~3,000 tokens ($0.045)
- **Total: ~$0.06 per post**

**For 100 posts:** ~$6.00

**vs Manual Processing:** $0.00

### Implementation Sketch

```javascript
// scripts/generateWithAPI.cjs (NOT INCLUDED)
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateBlogPost(promptPath) {
  const prompt = fs.readFileSync(promptPath, 'utf-8');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return JSON.parse(response.content[0].text);
}
```

⚠️ **Not recommended** if maintaining zero-cost principle.

---

## Best Practices

### Do's ✅
- Process in small batches (5-10 posts)
- Review agent output before saving
- Test builds after each batch
- Monitor Google Search Console
- Refresh top-performing posts quarterly

### Don'ts ❌
- Don't skip uniqueness checks
- Don't process 50+ posts without testing
- Don't ignore word count minimums
- Don't commit without building first
- Don't automate without quality checks

---

## Monitoring & Analytics

### Track Success Metrics

After deploying each batch, monitor:

**Week 1-2 (Indexing):**
- Google Search Console > Coverage > Indexed pages
- Target: 90%+ indexed within 14 days

**Week 3-4 (Impressions):**
- Search Console > Performance > Impressions
- Target: 100+ impressions per post/month

**Month 2-3 (Clicks):**
- Search Console > Performance > Clicks
- Target: 3-5% CTR

**Month 4+ (Conversions):**
- Google Analytics > Calculator page visits
- Track internal link clicks from blog posts

### Dashboard Setup

**Create monitoring script:**
```bash
# scripts/check-performance.sh
echo "Blog Posts: $(ls src/data/blog/posts/*.json | wc -l)"
echo "Pending Prompts: $(node scripts/processBlogBatch.cjs list | grep 'PENDING' | cut -d'(' -f2 | cut -d')' -f1)"
echo "Last Build: $(git log -1 --format=%cd)"
```

Run daily to track progress.

---

## Summary

### Time Investment vs Value

| Approach | Setup | Per Batch | Per Post | Cost | Quality |
|----------|-------|-----------|----------|------|---------|
| **Semi-Automated** | 30 mins | 60 mins | 3 mins | $0 | ⭐⭐⭐⭐⭐ |
| **Scheduled Batch** | 60 mins | 45 mins | 2 mins | $0 | ⭐⭐⭐⭐ |
| **Full API** | 120 mins | 5 mins | <1 min | ~$0.06 | ⭐⭐⭐ |

**Recommendation:** Semi-Automated approach for best quality at zero cost.

---

## Quick Reference

### Commands Cheat Sheet

```bash
# Complete workflow
node scripts/batchOrchestrator.cjs all

# List pending prompts
node scripts/processBlogBatch.cjs list

# Generate task list for Claude Code
node scripts/processBlogBatch.cjs generate-tasks

# Save agent output (interactive)
node scripts/processBlogBatch.cjs save <id>

# Save from file
node scripts/processBlogBatch.cjs save <id> path/to/output.json

# Update blog index
node scripts/updateBlogIndex.cjs

# Build and deploy
npm run build && git add . && git commit -m "Add blog batch" && git push
```

---

**Ready to automate your blog generation?**

Start with the semi-automated workflow:

```bash
# Step 1: Generate prompts
node scripts/batchOrchestrator.cjs all

# Step 2: Check what's pending
node scripts/processBlogBatch.cjs list

# Step 3: Process with Claude Code agent
# (Use Task tool with prompts from enhanced_prompts/)

# Step 4: Save outputs
node scripts/processBlogBatch.cjs save 0

# Step 5: Deploy
npm run build && git push
```

Let's scale to 100+ blog posts! 🚀
