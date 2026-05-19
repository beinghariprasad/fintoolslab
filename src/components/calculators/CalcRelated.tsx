import { Link } from 'react-router-dom';

interface RelatedItem {
  name: string;
  desc: string;
  mark: string;
  href: string;
  cat?: string;
  time?: string;
}

interface CalcRelatedGridProps {
  items: RelatedItem[];
  heading?: React.ReactNode;
}

export function CalcRelatedGrid({ items, heading }: CalcRelatedGridProps) {
  return (
    <section className="container">
      <div className="learn-head">
        <div>
          <div className="eyebrow">Keep going</div>
          <h2>{heading || <>Other calculators in the <em>same family</em>.</>}</h2>
        </div>
        <Link to="/calculators" className="btn btn-ghost">
          See all
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
      <div className="related-grid">
        {items.map((t) => (
          <Link key={t.name} className="tool-card" to={t.href}>
            <div className="tool-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 19 L 10 13 L 14 16 L 20 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="tool-name">{t.name}</h3>
            <p className="tool-desc">{t.desc}</p>
            <div className="tool-meta">
              <span>{t.cat || 'Calculator'} · {t.time || '30 sec'}</span>
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

interface RailCardProps {
  items: RelatedItem[];
}

export function RailCard({ items }: RailCardProps) {
  return (
    <div className="rail-card">
      <h4>Related calculators</h4>
      {items.map((r, i) => (
        <Link key={i} to={r.href} className="item" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span className="item-mark">{r.mark}</span>
          <div style={{ flex: 1 }}>
            <div className="item-name">{r.name}</div>
            <div className="item-meta">{r.desc}</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginTop: 6, color: 'var(--ink-4)' }}>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
