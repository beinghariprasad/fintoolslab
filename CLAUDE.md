# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FinSavvy Future Forge** is a financial calculator web application built with React, TypeScript, Vite, and shadcn/ui components. It provides various financial calculators (compound interest, mortgage, investment, loan, retirement, savings, rent vs buy) with visualization capabilities and a blog for educational content. The application is designed for performance with lazy loading, code splitting, and Firebase hosting.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on port 8080
- `npm run build` - Production build
- `npm run build:dev` - Development build (includes source maps, keeps console logs)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

### Alternative: Bun
Project includes `bun.lockb`, indicating Bun is used. Commands work with both npm and bun.

## Architecture

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS with custom configuration
- **Routing**: React Router v6 with lazy loading
- **State Management**: React Query (@tanstack/react-query)
- **Charts**: Recharts for data visualization
- **Forms**: react-hook-form with Zod validation
- **SEO**: react-helmet-async for meta tags
- **Hosting**: Firebase (see firebase.json)

### Project Structure
```
src/
├── components/
│   ├── ads/              # AdSense integration components
│   ├── calculators/      # Financial calculator components
│   ├── home/            # Homepage sections (HeroSection, CalculatorPreview)
│   ├── layout/          # Layout components (Header, Footer, Disclaimer, Layout wrapper)
│   └── ui/              # shadcn/ui components (40+ reusable UI primitives)
├── pages/               # Route pages (Index, Calculator pages, Blog, Legal pages)
│   └── blog/           # Blog article pages
├── hooks/              # Custom React hooks (use-mobile, use-performance, use-toast)
├── lib/                # Utility functions (cn() for className merging)
└── App.tsx            # Root component with routing configuration
```

### Key Architectural Patterns

**Lazy Loading Strategy:**
- Critical routes (Index, CompoundInterestPage) are loaded eagerly
- Other calculator pages and blog routes use React.lazy() with Suspense
- Fallback uses PageLoadingSpinner component
- See App.tsx for complete routing configuration

**Performance Optimizations:**
- Manual chunk splitting in vite.config.ts separates vendor libraries (react, router, ui, utils, query, helmet)
- Terser minification with console.log removal in production
- Asset optimization with content hashing for cache busting
- Firebase hosting with aggressive caching headers (31536000s for static assets)

**Component Architecture:**
- shadcn/ui components are installed locally in `src/components/ui/` for customization
- Use `cn()` utility from `@/lib/utils` for conditional className merging
- Calculator components follow consistent structure: inputs, calculation logic, results display, charts
- All calculators support multiple currencies and frequency options

**Path Aliases:**
Configured in vite.config.ts and tsconfig.json:
- `@/` → `./src/`
- `@/components` → `./src/components`
- `@/lib` → `./src/lib`
- `@/hooks` → `./src/hooks`

### Important Implementation Details

**Calculator Pattern:**
All calculator components follow this structure:
1. Input form with validation (principal, rate, time, contributions, etc.)
2. Currency and frequency selectors
3. Real-time calculation with useEffect
4. Results display with formatted values
5. Tabbed visualizations (line chart, area chart, pie chart, breakdown table)
6. Tooltips for help text
7. AdSense integration via InContentAd component

**Styling Conventions:**
- Use Tailwind utility classes
- Custom colors defined in tailwind.config.ts (blue, emerald, violet, orange, rose, cyan, amber)
- HSL color system with CSS variables in index.css
- Responsive design with mobile-first approach
- Custom animations: fade-in, slide-up, accordion transitions

**Chart Components:**
- Use EnhancedLineChart, EnhancedAreaChart, EnhancedPieChart from `@/components/ui/enhanced-chart`
- Based on Recharts library
- Consistent color scheme using chart-1 through chart-6 CSS variables

## Testing & Debugging

**Development Mode:**
- Source maps enabled in development build
- Console logs preserved
- Component tagging via lovable-tagger plugin (only in dev mode)

**Performance Monitoring:**
- Custom usePerformance hook tracks performance metrics
- See src/hooks/use-performance.ts

## SEO & Content Strategy

**Meta Tags:**
- react-helmet-async used for dynamic meta tags per page
- Each calculator page should have unique title, description, keywords

**Content Requirements:**
Per ADSENSE_REQUIREMENTS_ANALYSIS.md, the site needs:
- 20-30+ blog articles for AdSense approval
- Substantial educational content on each calculator page
- Internal linking between related content
- Current state: Only 1 blog article (CompoundInterestGuide)

## Deployment

**Vercel Hosting:**
1. Build: `npm run build`
2. Deploy: `vercel` or push to connected Git repository
3. Build output: `dist/` directory
4. Preview: `npm run preview`

**Cache Strategy (vercel.json):**
- Assets: 1 year cache, immutable
- Images/Fonts: 1 year cache, immutable
- SPA routing with catch-all rewrite to index.html

## Code Standards

**ESLint Configuration:**
- Extends recommended JS and TypeScript configs
- React Hooks rules enforced
- Unused variables warnings disabled
- React Refresh for fast HMR

**TypeScript:**
- Strict mode not explicitly enabled
- ES2020 target
- Path mapping configured for `@/` alias

## Adding New Features

**New Calculator:**
1. Create component in `src/components/calculators/`
2. Create page in `src/pages/`
3. Add lazy route in App.tsx
4. Follow existing calculator pattern for consistency
5. Add to CalculatorList page
6. Create corresponding blog guide

**New UI Component:**
Use shadcn CLI: `npx shadcn-ui@latest add [component-name]`
Components install to `src/components/ui/`

**New Blog Article:**
1. Create page in `src/pages/blog/`
2. Add lazy route in App.tsx
3. Add to Blog index page
4. Use react-helmet-async for SEO metadata
5. Follow CompoundInterestGuide.tsx as template
