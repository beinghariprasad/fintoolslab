import { Link } from 'react-router-dom';

interface WorkedExample {
  amount: string;
  label: string;
  features: string[];
}

interface CalcPageHeroProps {
  chip: string;
  title: React.ReactNode;
  lede: string;
  meta: { label: string; value: string }[];
  breadcrumb: { label: string; href?: string }[];
  workedExample?: WorkedExample;
}

export function CalcPageHero({ chip, title, lede, meta, breadcrumb, workedExample }: CalcPageHeroProps) {
  return (
    <>
      <div className="container">
        <nav className="crumb" aria-label="Breadcrumb">
          {breadcrumb.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className="sep"> · </span>}
              {item.href ? <Link to={item.href}>{item.label}</Link> : <span className="here">{item.label}</span>}
            </span>
          ))}
        </nav>
      </div>
      <section className="cphero">
        <div className="container cphero-grid">
          <div>
            <span className="chip chip-dot">{chip}</span>
            <h1>{title}</h1>
            <p className="lede">{lede}</p>
            <div className="cphero-meta">
              {meta.map((m, i) => (
                <span key={i}>
                  {i > 0 && <span className="dot" style={{ color: 'var(--ink-4)' }}> · </span>}
                  <b>{m.label}</b> {m.value}
                </span>
              ))}
            </div>
          </div>
          {workedExample && (
            <aside className="cphero-tile">
              <h4>Worked example</h4>
              <div className="num">
                <span style={{ color: 'var(--ink-3)', fontSize: 24 }}>$</span>
                <span className="tnum">{workedExample.amount}</span>
              </div>
              <div className="lbl">{workedExample.label}</div>
              <ul>
                {workedExample.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
