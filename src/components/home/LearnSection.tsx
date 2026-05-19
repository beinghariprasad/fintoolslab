import { Link } from 'react-router-dom';

function IllustrationGrowth() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="ig-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#0f1d33" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill="url(#ig-bg)" />
      {[60, 110, 160, 210].map((y) => (
        <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="rgba(255,255,255,0.06)" />
      ))}
      {Array.from({ length: 14 }).map((_, i) => {
        const h = 18 + i * i * 0.7;
        const x = 30 + i * 25;
        const baseH = Math.min(h * 0.55, 80);
        return (
          <g key={i}>
            <rect x={x} y={220 - baseH} width="14" height={baseH} fill="rgba(245,247,243,0.45)" rx="2" />
            <rect x={x} y={220 - h} width="14" height={Math.max(0, h - baseH)} fill="#d97706" rx="2" />
          </g>
        );
      })}
      <text x="30" y="40" fontFamily="Instrument Serif, serif" fontSize="22" fill="#f5f7f3">
        $1 → <tspan fill="#d97706" fontStyle="italic">$8.42</tspan>
      </text>
      <text x="30" y="58" fontFamily="Geist Mono, monospace" fontSize="10" fill="rgba(245,247,243,0.55)">
        30 YEARS · 7% RETURN
      </text>
    </svg>
  );
}

function IllustrationMortgage() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="400" height="250" fill="#ecede9" />
      <g transform="translate(200 125)">
        <circle r="74" fill="none" stroke="#0a1628" strokeWidth="22" />
        <circle r="74" fill="none" stroke="#d97706" strokeWidth="22" strokeDasharray="290 1000" transform="rotate(-90)" strokeLinecap="butt" />
        <text textAnchor="middle" y="-6" fontFamily="Instrument Serif, serif" fontSize="30" fill="#0a1628">62%</text>
        <text textAnchor="middle" y="14" fontFamily="Geist Mono, monospace" fontSize="9" fill="#5c6779" letterSpacing="1">INTEREST</text>
      </g>
      <g transform="translate(30 30)" fontFamily="Geist, sans-serif" fontSize="11" fill="#2a3547">
        <rect width="10" height="10" fill="#d97706" rx="2" />
        <text x="18" y="9">Interest</text>
        <rect y="20" width="10" height="10" fill="#0a1628" rx="2" />
        <text x="18" y="29">Principal</text>
      </g>
    </svg>
  );
}

function IllustrationRetire() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="400" height="250" fill="#f6f7f5" />
      <path d="M20 220 Q 100 200 150 180 T 250 130 T 380 30" stroke="#0a1628" strokeWidth="2" fill="none" />
      <path d="M20 220 Q 100 200 150 180 T 250 130 T 380 30 L 380 230 L 20 230 Z" fill="#d97706" opacity="0.12" />
      <circle cx="150" cy="180" r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
      <circle cx="250" cy="130" r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
      <circle cx="380" cy="30" r="6" fill="#0a1628" stroke="#d97706" strokeWidth="2" />
      <text x="380" y="20" textAnchor="end" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="18" fill="#0a1628">Year 65</text>
    </svg>
  );
}

interface Article {
  cat: string;
  title: string;
  excerpt: string;
  read: string;
  date: string;
  lg?: boolean;
  illustration: JSX.Element;
  href: string;
}

const ARTICLES: Article[] = [
  {
    cat: 'Investing',
    title: 'The simple math behind why your 20s matter most.',
    excerpt: 'A single year of contributions at 25 can outpace ten years starting at 40. Here\'s the model that shows why — and how to use it.',
    read: '7 min read',
    date: 'May 2026',
    lg: true,
    illustration: <IllustrationGrowth />,
    href: '/blog/compound-interest-guide',
  },
  {
    cat: 'Borrowing',
    title: 'Best mortgage calculators compared for 2025.',
    excerpt: 'We tested the top free mortgage calculators side by side — features, accuracy, and usability — so you can pick the right one.',
    read: '5 min read',
    date: 'Apr 2026',
    illustration: <IllustrationMortgage />,
    href: '/blog/best-mortgage-calculator-comparison-2025-top-free-tools',
  },
  {
    cat: 'Planning',
    title: 'Best retirement calculators compared for 2025.',
    excerpt: 'From simple projections to Monte Carlo simulations — we compared the top free retirement calculators so you don\'t have to.',
    read: '9 min read',
    date: 'Apr 2026',
    illustration: <IllustrationRetire />,
    href: '/blog/best-retirement-calculator-comparison-2025-top-free-tools',
  },
];

export function LearnSection() {
  return (
    <section className="container" id="learn">
      <div className="learn-head">
        <div>
          <div className="eyebrow">Learn — Field notes</div>
          <h2>
            Plain-spoken guides to the <em>math behind money</em>.
          </h2>
        </div>
        <Link to="/blog" className="btn btn-ghost">
          Browse all articles
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="learn-grid">
        {ARTICLES.map((a, i) => (
          <Link to={a.href} key={i} className={`article${a.lg ? ' lg' : ''}`}>
            <div className="article-img">{a.illustration}</div>
            <div className="article-body">
              <div className="article-eyebrow">
                <span className="cat">{a.cat}</span>
                <span>{a.read}</span>
              </div>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <div className="article-foot">
                <span>{a.date}</span>
                <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', color: 'var(--ink-2)' }}>
                  Read
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
