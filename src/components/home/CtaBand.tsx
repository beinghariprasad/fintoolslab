import { Link } from 'react-router-dom';

export function CtaBand() {
  return (
    <section style={{ paddingBlock: 'clamp(48px, 6vw, 96px)' }}>
      <div className="container">
        <div className="cta-band">
          <div>
            <div className="eyebrow" style={{ color: 'var(--ink-on-dark-2)', marginBottom: 16 }}>
              Start planning today
            </div>
            <h2>
              Built for the question<br />
              you'll ask <em>next month</em>.
            </h2>
            <p>
              Pin scenarios to your workspace, compare outcomes side by side, and revisit them
              the next time the market moves. Free forever — no sign-up needed.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch' }}>
            <Link
              to="/calculators"
              className="btn btn-accent"
              style={{ height: 52, fontSize: 15, padding: '0 22px' }}
            >
              Explore all calculators
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              to="/blog"
              className="btn btn-on-dark"
              style={{
                background: 'transparent',
                color: 'var(--ink-on-dark-2)',
                border: '1px solid var(--line-on-dark)',
                height: 52,
                fontSize: 14,
              }}
            >
              Read our guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
