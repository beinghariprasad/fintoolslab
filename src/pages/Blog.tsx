import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import blogPostsData from '@/data/blog/blog-posts.json';

/* ---------- Inline SVG illustrations for blog cards ---------- */
function IlloComparison() {
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#0f1d33" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#bg1)" />
      <g transform="translate(50 80)">
        <rect width="220" height="200" rx="12" fill="#d97706" opacity="0.92" />
        <text x="20" y="38" fontFamily="Geist Mono, monospace" fontSize="10" fill="#4a2c05" letterSpacing="2">VARIANT A</text>
        <text x="20" y="90" fontFamily="Instrument Serif, serif" fontSize="48" fill="#4a2c05">$821K</text>
        <text x="20" y="120" fontFamily="Geist Mono, monospace" fontSize="11" fill="#4a2c05">+ 7.0% return</text>
        <line x1="20" y1="160" x2="200" y2="160" stroke="#4a2c05" opacity="0.3" />
        <text x="20" y="180" fontFamily="Geist, sans-serif" fontSize="11" fill="#4a2c05">30 years · $500/mo</text>
      </g>
      <g transform="translate(330 80)">
        <rect width="220" height="200" rx="12" fill="#f5f7f3" />
        <text x="20" y="38" fontFamily="Geist Mono, monospace" fontSize="10" fill="#5c6779" letterSpacing="2">VARIANT B</text>
        <text x="20" y="90" fontFamily="Instrument Serif, serif" fontSize="48" fill="#0a1628">$574K</text>
        <text x="20" y="120" fontFamily="Geist Mono, monospace" fontSize="11" fill="#5c6779">+ 5.5% return</text>
        <line x1="20" y1="160" x2="200" y2="160" stroke="#e3e5df" />
        <text x="20" y="180" fontFamily="Geist, sans-serif" fontSize="11" fill="#5c6779">30 years · $500/mo</text>
      </g>
      <text x="300" y="320" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="22" fill="#f5f7f3" opacity="0.7">2 calculators compared</text>
    </svg>
  );
}

function IlloMortgage() {
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <rect width="600" height="360" fill="#ecede9" />
      <g transform="translate(150 50)" stroke="#0a1628" strokeWidth="2.5" fill="none" strokeLinejoin="round">
        <path d="M0 130 L 150 30 L 300 130 V 280 H 0 Z" />
        <rect x="60" y="170" width="80" height="110" />
        <rect x="180" y="160" width="60" height="60" />
        <line x1="150" y1="30" x2="150" y2="0" />
        <rect x="135" y="-10" width="30" height="20" fill="#d97706" stroke="none" />
      </g>
      <g transform="translate(30 290)">
        {[12, 20, 28, 36, 42].map((h, i) => (
          <g key={i}>
            <rect x={i * 70} y={-h} width="22" height={h} fill="#d97706" />
            <rect x={i * 70 + 24} y={-h * 0.5} width="22" height={h * 0.5} fill="#0a1628" />
          </g>
        ))}
      </g>
      <text x="300" y="335" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="20" fill="#0a1628">New York · 2025</text>
    </svg>
  );
}

function IlloRetire() {
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <rect width="600" height="360" fill="#f6f7f5" />
      <path d="M30 320 Q 150 280 250 240 T 450 110 T 580 30" stroke="#0a1628" strokeWidth="2.5" fill="none" />
      <path d="M30 320 Q 150 280 250 240 T 450 110 T 580 30 L 580 340 L 30 340 Z" fill="#d97706" opacity="0.14" />
      <g fontFamily="Geist Mono, monospace" fontSize="10" fill="#5c6779">
        <text x="40" y="320">25</text>
        <text x="250" y="240">40</text>
        <text x="450" y="110">55</text>
        <text x="555" y="30">65</text>
      </g>
      <circle cx="40" cy="320" r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
      <circle cx="250" cy="240" r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
      <circle cx="450" cy="110" r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
      <circle cx="580" cy="30" r="6" fill="#0a1628" stroke="#d97706" strokeWidth="2" />
      <text x="60" y="80" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="32" fill="#0a1628">
        Millennials, <tspan fill="#d97706">start now</tspan>
      </text>
    </svg>
  );
}

function IlloDecision() {
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <rect width="600" height="360" fill="#0a1628" />
      <g transform="translate(60 90)" fontFamily="Instrument Serif, serif" fill="#f5f7f3">
        <text fontSize="100" fontStyle="italic">vs</text>
      </g>
      <g transform="translate(180 80)" fontFamily="Instrument Serif, serif" fill="#f5f7f3">
        <text fontSize="48">Rent</text>
        <text y="50" fontFamily="Geist Mono, monospace" fontSize="11" fill="#a8b3a8">FLEXIBILITY · LIQUID</text>
      </g>
      <g transform="translate(370 80)" fontFamily="Instrument Serif, serif" fill="#d97706">
        <text fontSize="48" fontStyle="italic">Buy</text>
        <text y="50" fontFamily="Geist Mono, monospace" fontSize="11" fill="#a8b3a8">EQUITY · APPRECIATION</text>
      </g>
      <g transform="translate(60 200)">
        <path d="M0 100 L 100 70 L 200 75 L 300 50 L 400 65 L 480 45" stroke="#a8b3a8" strokeWidth="1.5" fill="none" />
        <path d="M0 100 L 100 60 L 200 40 L 300 30 L 400 15 L 480 0" stroke="#d97706" strokeWidth="2" fill="none" />
        <text x="490" y="50" fontFamily="Geist Mono, monospace" fontSize="11" fill="#a8b3a8">RENT</text>
        <text x="490" y="0" fontFamily="Geist Mono, monospace" fontSize="11" fill="#d97706">BUY</text>
      </g>
    </svg>
  );
}

function IlloStudent() {
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <rect width="600" height="360" fill="#f6f7f5" />
      <text x="40" y="100" fontFamily="Instrument Serif, serif" fontSize="58" fill="#0a1628">$25K</text>
      <text x="40" y="130" fontFamily="Geist Mono, monospace" fontSize="11" fill="#5c6779" letterSpacing="2">STUDENT LOAN @ 8.5%</text>
      <g transform="translate(40 200)">
        <path d="M0 100 Q 100 80 200 60 T 400 20 T 520 0" stroke="#d97706" strokeWidth="2.5" fill="none" />
        <text x="525" y="5" fontFamily="Geist Mono, monospace" fontSize="11" fill="#d97706">PAID OFF</text>
        {[0, 100, 200, 300, 400, 520].map((x, i) => (
          <circle key={i} cx={x} cy={[100, 80, 60, 40, 20, 0][i]} r="4" fill="#d97706" stroke="#f6f7f5" strokeWidth="2" />
        ))}
      </g>
      <text x="40" y="170" fontFamily="Geist, sans-serif" fontSize="12" fill="#2a3547">$513/mo · 5 years to debt-free</text>
    </svg>
  );
}

function IlloFlorida() {
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg-fl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#0f1d33" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#bg-fl)" />
      <g transform="translate(100 130)" fontFamily="Instrument Serif, serif" fill="#f5f7f3">
        <text fontSize="68" fontStyle="italic" fill="#d97706">0%</text>
        <text x="160" y="-10" fontSize="14" fontFamily="Geist Mono, monospace" fill="#a8b3a8" letterSpacing="2">FLORIDA</text>
        <text x="160" y="20" fontSize="40">state tax</text>
        <text x="160" y="56" fontSize="14" fontFamily="Geist, sans-serif" fill="#a8b3a8">on investment gains</text>
      </g>
      <g transform="translate(420 60)" stroke="#d97706" strokeWidth="2" fill="none">
        <path d="M0 80 Q 20 40 40 60 Q 60 30 80 50 Q 100 20 120 40" />
        <circle cx="60" cy="20" r="3" fill="#d97706" />
      </g>
    </svg>
  );
}

/* ---------- Post illustration map ---------- */
const ILLUSTRATIONS: Record<string, JSX.Element> = {
  'compound-interest': <IlloComparison />,
  'mortgage': <IlloMortgage />,
  'retirement': <IlloRetire />,
  'rent-vs-buy': <IlloDecision />,
  'loan': <IlloStudent />,
  'investment': <IlloFlorida />,
};

function getIllustration(slug: string) {
  for (const [key, illo] of Object.entries(ILLUSTRATIONS)) {
    if (slug.includes(key)) return illo;
  }
  return null;
}

/* ---------- Blog posts with handoff additions ---------- */
interface BlogPostEntry {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cat: string;
  readTime: string;
  publishDate: string;
  author: string;
  featured?: boolean;
}

const POSTS: BlogPostEntry[] = [
  {
    slug: 'best-compound-interest-calculator-comparison-2025-top-free-tools',
    title: 'Best Compound Interest Calculator Comparison: 2025 Top Free Tools',
    excerpt: 'We tested every free compound interest calculator on the open web against the same 30-year scenario. Here\'s which ones round correctly, which hide their assumptions, and which we\'d actually recommend.',
    category: 'Comparison',
    cat: 'comparison',
    readTime: '9 min read',
    publishDate: '2026-05-12',
    author: 'Eli Tran',
    featured: true,
  },
  {
    slug: 'mortgage-calculator-for-new-york-residents-2025-guide',
    title: 'Mortgage Calculator for New York Residents: 2025 Guide',
    excerpt: "New York's transfer taxes, mansion tax, and high property tax rates change the affordability math. Here's how to use a mortgage calculator the right way as an NYC or upstate buyer.",
    category: 'Location',
    cat: 'location',
    readTime: '8 min read',
    publishDate: '2026-05-04',
    author: 'Maya Chen',
  },
  {
    slug: 'retirement-calculator-for-millennials',
    title: 'Retirement Calculator for Millennials: An Honest Starting Point',
    excerpt: "If you're 28 and haven't saved, the headlines are scarier than the math. Here's a millennial-specific framing — with realistic return assumptions and the FIRE-skeptic take.",
    category: 'Demographic',
    cat: 'demographic',
    readTime: '12 min read',
    publishDate: '2026-04-28',
    author: 'Eli Tran',
  },
  {
    slug: 'rent-vs-buy-calculator-comparison',
    title: 'Rent vs Buy Calculator: The Decision Framework Most People Skip',
    excerpt: "A working calculator is necessary but not sufficient. The harder question is which inputs to trust — and how to weight opportunity cost honestly.",
    category: 'Decision',
    cat: 'comparison',
    readTime: '11 min read',
    publishDate: '2026-04-19',
    author: 'Maya Chen',
  },
  {
    slug: 'loan-calculator-comparison-2025',
    title: 'Loan Calculator Comparison 2025: Which Hidden Fees They Miss',
    excerpt: "Most loan calculators silently ignore origination fees, prepayment penalties, and the actual APR you'll see on the loan estimate. We re-ran four with the full picture.",
    category: 'Comparison',
    cat: 'comparison',
    readTime: '7 min read',
    publishDate: '2026-04-09',
    author: 'Eli Tran',
  },
  {
    slug: 'investment-calculator-for-florida-residents',
    title: "Investment Calculator for Florida Residents: The 0% Tax Edge",
    excerpt: "Florida's lack of state income tax is real money for high-income earners — but the federal capital gains math doesn't change. Here's what to plug in.",
    category: 'Location',
    cat: 'location',
    readTime: '6 min read',
    publishDate: '2026-04-02',
    author: 'Maya Chen',
  },
  // Existing programmatic SEO posts
  ...blogPostsData
    .filter((p: any) => !['best-compound-interest-calculator-comparison-2025-top-free-tools', 'mortgage-calculator-for-new-york-residents-2025-guide'].includes(p.slug))
    .map((p: any) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.description,
      category: p.category === 'State-Specific Guides' ? 'Location' : 'Comparison',
      cat: p.category === 'State-Specific Guides' ? 'location' : 'comparison',
      readTime: p.readTime,
      publishDate: p.publishDate,
      author: 'Fin Tools Lab',
    })),
];

const CATS = [
  { id: 'all', label: 'All articles' },
  { id: 'comparison', label: 'Comparisons' },
  { id: 'location', label: 'Location guides' },
  { id: 'demographic', label: 'By life stage' },
];

export default function Blog() {
  const [cat, setCat] = useState('all');

  const filtered = useMemo(
    () => (cat === 'all' ? POSTS : POSTS.filter((p) => p.cat === cat)),
    [cat],
  );
  const featured = POSTS.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || cat !== 'all');

  return (
    <>
      <Helmet>
        <title>Field Notes — The Math Behind Money | Fin Tools Lab</title>
        <meta name="description" content="Long-form guides, calculator comparisons, and location-specific walkthroughs for the tools we build. Written by an independent team of engineers and former planners." />
        <link rel="canonical" href="https://fintoolslab.com/blog" />
        <meta property="og:title" content="Field Notes — The Math Behind Money" />
        <meta property="og:description" content="Long-form guides, calculator comparisons, and location-specific walkthroughs. Written by engineers and former financial planners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/blog" />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Field Notes — The Math Behind Money",
            "description": "Long-form guides, calculator comparisons, and location-specific walkthroughs for our financial calculators.",
            "url": "https://fintoolslab.com/blog",
            "publisher": { "@type": "Organization", "@id": "https://fintoolslab.com/#organization", "name": "Fin Tools Lab" },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fintoolslab.com" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://fintoolslab.com/blog" },
            ],
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="container blog-hero">
        <div className="blog-hero-grid">
          <div>
            <span className="chip chip-dot">Field notes · Updated weekly</span>
            <h1>The math behind <em>money</em>, in plain English.</h1>
            <p className="lede">
              Long-form guides, calculator comparisons, and location-specific walkthroughs for the
              tools we build. Written by an independent team of engineers and former planners.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Subscribe — one email a week, no fluff:</div>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}
              style={{ background: 'var(--bg-elev)', borderColor: 'var(--line)' }}>
              <input type="email" placeholder="you@inbox.com" style={{ color: 'var(--ink)' }} />
              <button type="submit">Subscribe</button>
            </form>
            <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Join our readers · Unsubscribe anytime.</div>
          </div>
        </div>
      </section>

      {/* Filters + Articles */}
      <section className="container" style={{ paddingTop: 0, paddingBottom: 'clamp(80px, 9vw, 140px)' }}>
        <div className="blog-filters no-scrollbar" role="tablist">
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-pressed={cat === c.id}
              onClick={() => setCat(c.id)}
            >
              {c.label}
              <span className="count">
                {c.id === 'all' ? POSTS.length : POSTS.filter((p) => p.cat === c.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Featured article */}
        {featured && cat === 'all' && (
          <Link to={`/blog/${featured.slug}`} className="featured-article">
            <div className="img">{getIllustration(featured.slug)}</div>
            <div className="body">
              <span className="cat" style={{ display: 'inline-flex', alignSelf: 'flex-start', background: 'var(--ft-accent-soft)', color: 'var(--ft-accent-ink)', padding: '3px 10px', borderRadius: 999, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                {featured.category}
              </span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 13, color: 'var(--ink-3)' }}>
                <span>{featured.author}</span>
                <span style={{ color: 'var(--ink-4)' }}>·</span>
                <span>{new Date(featured.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span style={{ color: 'var(--ink-4)' }}>·</span>
                <span>{featured.readTime}</span>
              </div>
              <div style={{ marginTop: 12 }}>
                <span className="btn btn-primary btn-sm">
                  Read article
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Blog card grid */}
        <div className="blog-grid">
          {rest.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="blog-card">
              <div className="img">{getIllustration(p.slug)}</div>
              <div className="body">
                <span className="cat">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <div className="meta">
                  <span>{p.author}</span>
                  <span>{p.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter band */}
      <section style={{ paddingBlock: 'clamp(48px, 6vw, 96px)' }}>
        <div className="container">
          <div className="newsletter-band">
            <div>
              <div className="eyebrow" style={{ color: 'var(--ink-on-dark-2)', marginBottom: 14 }}>The Compound newsletter</div>
              <h2>One useful idea<br />about money, <em>every Sunday</em>.</h2>
              <p style={{ marginTop: 16 }}>
                No hot takes, no "10 things millionaires do." Just one solid framework or tool we found
                useful this week — like the article you just read.
              </p>
            </div>
            <div>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="you@inbox.com" />
                <button type="submit">Subscribe</button>
              </form>
              <div style={{ fontSize: 12, color: 'var(--ink-on-dark-3)', marginTop: 12 }}>
                Join our readers · 4.8 avg rating · One-click unsubscribe.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
