import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdSlot } from '@/components/ads/AdSlot';

const TOOLS = [
  { id: 'compound-interest', name: 'Compound interest', desc: 'See how your money grows when returns compound over time.', cat: 'Investing', time: '30 sec', href: '/calculators/compound-interest', featured: true },
  { id: 'mortgage', name: 'Mortgage calculator', desc: 'Calculate monthly payments, total interest, and amortization.', cat: 'Borrowing', time: '1 min', href: '/calculators/mortgage', featured: true },
  { id: 'investment', name: 'Investment growth', desc: 'Model lump sum or regular contributions over any timeframe.', cat: 'Investing', time: '1 min', href: '/calculators/investment' },
  { id: 'loan', name: 'Loan calculator', desc: 'Payment schedules and interest breakdown for any loan type.', cat: 'Borrowing', time: '30 sec', href: '/calculators/loan' },
  { id: 'retirement', name: 'Retirement planner', desc: "Project the nest egg you'll have and what it produces monthly.", cat: 'Planning', time: '2 min', href: '/calculators/retirement' },
  { id: 'savings', name: 'Savings goal', desc: 'Reverse-engineer the monthly deposit needed to hit your target.', cat: 'Saving', time: '30 sec', href: '/calculators/savings' },
  { id: 'rent-vs-buy', name: 'Rent vs. buy', desc: 'Compare the true cost of renting against buying over time.', cat: 'Real estate', time: '2 min', href: '/calculators/rent-vs-buy' },
];

const CATS = ['All', 'Investing', 'Borrowing', 'Saving', 'Planning', 'Real estate'];

export default function CalculatorList() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? TOOLS : TOOLS.filter(t => t.cat === cat);

  return (
    <>
      <Helmet>
        <title>Financial Calculators - Free Tools for Every Decision | Fin Tools Lab</title>
        <meta name="description" content="Free financial calculators for compound interest, mortgage, investment, loan, retirement and savings. Professional-grade tools, beautifully simple." />
        <link rel="canonical" href="https://fintoolslab.com/calculators" />
        <meta property="og:title" content="Financial Calculators - Free Tools for Every Decision" />
        <meta property="og:description" content="Free financial calculators for compound interest, mortgage, investment, loan, retirement and savings." />
        <meta property="og:url" content="https://fintoolslab.com/calculators" />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Financial Calculators",
            "description": "Free professional-grade financial calculators",
            "url": "https://fintoolslab.com/calculators",
            "numberOfItems": 7,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Compound Interest Calculator", "url": "https://fintoolslab.com/calculators/compound-interest" },
              { "@type": "ListItem", "position": 2, "name": "Mortgage Calculator", "url": "https://fintoolslab.com/calculators/mortgage" },
              { "@type": "ListItem", "position": 3, "name": "Investment Growth Calculator", "url": "https://fintoolslab.com/calculators/investment" },
              { "@type": "ListItem", "position": 4, "name": "Loan Calculator", "url": "https://fintoolslab.com/calculators/loan" },
              { "@type": "ListItem", "position": 5, "name": "Retirement Planner", "url": "https://fintoolslab.com/calculators/retirement" },
              { "@type": "ListItem", "position": 6, "name": "Savings Goal Calculator", "url": "https://fintoolslab.com/calculators/savings" },
              { "@type": "ListItem", "position": 7, "name": "Rent vs. Buy Calculator", "url": "https://fintoolslab.com/calculators/rent-vs-buy" },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fintoolslab.com" },
              { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://fintoolslab.com/calculators" },
            ],
          })}
        </script>
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Calculator directory</div>
          <h1>Every tool you <em>need</em>.</h1>
          <p className="lede">Professional-grade financial calculators, free forever. Pick the one that matches your question.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="dir-filter">
            {CATS.map(c => (
              <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="dir-grid">
            {filtered.map(t => (
              <Link key={t.id} to={t.href} className={`tool-card${t.featured ? ' featured' : ''}`}>
                <div className="tool-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 19 L 10 13 L 14 16 L 20 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {t.featured && <span className="tool-badge">Popular</span>}
                <h3 className="tool-name">{t.name}</h3>
                <p className="tool-desc">{t.desc}</p>
                <div className="tool-meta">
                  <span>{t.cat} · {t.time}</span>
                  <span className="tool-arrow">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdSlot size="leaderboard" />
    </>
  );
}
