# SEO Bot

Automation implementing `SEO_ROADMAP.md`. Three moving parts:

## 1. Prerendering (`prerender.mjs`)
The site is a client-rendered SPA — without this, every URL serves the same
empty HTML shell (the roadmap's #1 blocker). `npm run build:seo` runs
`vite build`, then renders every known route with headless Chrome and writes
real HTML into `dist/`, then generates `dist/sitemap.xml`. Vercel runs this via
`buildCommand` in `vercel.json`; static files are served before the SPA
rewrite, so crawlers get full HTML with per-page titles, meta, and JSON-LD.

Routes come from three sources (shared with the sitemap generator):
- `scripts/seo-bot/routes.json` — static/calculator routes
- `src/data/blog/blog-posts.json` — blog posts (broken + superseded 2025 slugs excluded)
- `src/data/programmatic/manifest.json` — **published** programmatic pages only

Local run: `npm run build:seo` (first time: `npx puppeteer browsers install chrome`).

## 2. Programmatic pages (`generate-pages.mjs`)
Generates the manifest + per-page JSON data (salary, hourly, mortgage,
auto-loan, growth categories). Every page has unique computed tables, prose,
and FAQs — the anti-thin-content pattern. Regenerate after changing configs:
`npm run seo:generate`. Pages are created `published: false` in batches.

## 3. Weekly release bot (`.github/workflows/seo-bot.yml`)
Every Monday 09:00 UTC (or manual `workflow_dispatch`):
1. `release-batch.mjs` flips the next batch to `published: true` and
   regenerates `public/sitemap.xml`.
2. Commits and pushes → Vercel deploys → new pages go live prerendered.
3. `ping-indexnow.mjs` notifies Bing/IndexNow of exactly the released URLs
   (key file lives at `public/<key>.txt`).

Releasing ~35 pages/week instead of 150 at once avoids the scaled-content
spam signal and lets you watch GSC for indexing problems between batches.

## Still requires a human (cannot be automated from the repo)
- **AdSense**: create real ad units and replace the placeholder slot IDs in
  `src/components/ads/`; enable Google's certified CMP (Privacy & Messaging)
  for EEA/UK consent.
- **Google Search Console**: add the verification meta tag in `index.html`
  (currently commented out), submit `https://fintoolslab.com/sitemap.xml`,
  and watch Pages → indexing reports weekly.
- **State-guide rehab**: the 100 templated state posts need real per-state
  data or consolidation (roadmap Phase 2).
