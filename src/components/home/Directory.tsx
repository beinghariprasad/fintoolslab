import { useState } from 'react';
import { Link } from 'react-router-dom';

const ToolIcons: Record<string, JSX.Element> = {
  compound: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 19 L 9 14 L 13 16 L 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="8" r="2" fill="currentColor" />
      <path d="M4 19 L 20 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  mortgage: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 11 L 12 5 L 20 11 V 20 H 4 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 20 V 14 H 14 V 20" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  loan: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 6 V 4 M 18 6 V 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  retire: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7 V 12 L 15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  invest: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="13" width="4" height="7" stroke="currentColor" strokeWidth="1.8" />
      <rect x="10" y="9" width="4" height="11" stroke="currentColor" strokeWidth="1.8" />
      <rect x="17" y="4" width="4" height="16" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  savings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  rentvsbuy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 12 H 7 L 9 6 L 13 18 L 15 12 H 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

interface Tool {
  id: string;
  cat: string;
  name: string;
  desc: string;
  icon: string;
  featured?: boolean;
  badge?: string;
  time: string;
  href: string;
}

const TOOLS: Tool[] = [
  { id: 'compound', cat: 'Investing', name: 'Compound interest', desc: 'Model how contributions and time multiply your money.', icon: 'compound', featured: true, badge: 'Most used', time: '30 sec', href: '/calculators/compound-interest' },
  { id: 'mortgage', cat: 'Borrowing', name: 'Mortgage', desc: 'Monthly payment, total interest, and full amortization table.', icon: 'mortgage', time: '1 min', href: '/calculators/mortgage' },
  { id: 'retire', cat: 'Investing', name: 'Retirement planner', desc: 'Project the nest egg you\'ll have, and what it spins off monthly.', icon: 'retire', badge: 'Popular', time: '2 min', href: '/calculators/retirement' },
  { id: 'loan', cat: 'Borrowing', name: 'Loan calculator', desc: 'Personal, auto, student — payments and payoff schedules.', icon: 'loan', time: '30 sec', href: '/calculators/loan' },
  { id: 'invest', cat: 'Investing', name: 'Investment growth', desc: 'Model portfolio performance with contribution strategies.', icon: 'invest', time: '1 min', href: '/calculators/investment' },
  { id: 'savings', cat: 'Saving', name: 'Savings goal', desc: 'Reverse-engineer the monthly habit to hit a target.', icon: 'savings', time: '30 sec', href: '/calculators/savings' },
  { id: 'rentvsbuy', cat: 'Planning', name: 'Rent vs. buy', desc: 'Should you rent or buy? Compare the true cost of each path.', icon: 'rentvsbuy', time: '2 min', href: '/calculators/rent-vs-buy' },
];

const CATS = ['All', 'Investing', 'Borrowing', 'Saving', 'Planning'];

export function Directory() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? TOOLS : TOOLS.filter((t) => t.cat === cat);

  return (
    <section className="container" id="calculators">
      <div className="dir-head">
        <div>
          <div className="eyebrow">The toolkit</div>
          <h2>
            Seven calculators.<br />
            <em>One workspace.</em>
          </h2>
        </div>
        <div className="right">
          Every tool is free, runs in your browser, and keeps your data private. No sign-up required.
        </div>
      </div>

      <div className="dir-filter no-scrollbar" role="tablist">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
          >
            {c}
            <span style={{ marginLeft: 6, opacity: 0.5, fontSize: 11 }}>
              {c === 'All' ? TOOLS.length : TOOLS.filter((t) => t.cat === c).length}
            </span>
          </button>
        ))}
      </div>

      <div className="dir-grid">
        {filtered.map((t) => (
          <Link
            key={t.id}
            className={`tool-card${t.featured ? ' featured' : ''}`}
            to={t.href}
          >
            {t.badge && <span className="tool-badge">{t.badge}</span>}
            <div className="tool-icon">{ToolIcons[t.icon]}</div>
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
    </section>
  );
}
