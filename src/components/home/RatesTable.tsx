import { useState } from 'react';

interface RateRow {
  name: string;
  sub: string;
  apy: number;
  min: string;
  stars: number;
  mark: string;
  color: string;
  best?: string;
}

interface TabData {
  label: string;
  headers: string[];
  maxApy: number;
  rows: RateRow[];
}

const TAB_DATA: Record<string, TabData> = {
  hysa: {
    label: 'High-yield savings',
    headers: ['Provider', 'APY', 'Min. deposit', 'Rating'],
    maxApy: 5.0,
    rows: [
      { name: 'Marlowe Bank', sub: 'Online savings · FDIC', apy: 4.85, min: '$0', stars: 4.8, mark: 'M', color: '#0a1628', best: 'Top rate' },
      { name: 'North Ridge', sub: 'Money market account', apy: 4.65, min: '$100', stars: 4.7, mark: 'N', color: '#2d6a4f' },
      { name: 'Crestline Financial', sub: 'Premier savings · FDIC', apy: 4.50, min: '$0', stars: 4.6, mark: 'C', color: '#1e3a8a' },
      { name: 'Coastline Credit Union', sub: 'Member savings · NCUA', apy: 4.40, min: '$5', stars: 4.5, mark: 'C', color: '#d97706' },
      { name: 'Heritage Bank', sub: 'Online-only savings', apy: 4.25, min: '$0', stars: 4.3, mark: 'H', color: '#0a1628' },
      { name: 'Pinnacle Trust', sub: 'Smart saver account', apy: 4.10, min: '$500', stars: 4.2, mark: 'P', color: '#6d28d9' },
    ],
  },
  cd: {
    label: '12-month CDs',
    headers: ['Provider', 'APY', 'Min. deposit', 'Rating'],
    maxApy: 5.5,
    rows: [
      { name: 'Marlowe Bank', sub: '12-month CD · FDIC', apy: 5.25, min: '$500', stars: 4.8, mark: 'M', color: '#0a1628', best: 'Top rate' },
      { name: 'Heritage Bank', sub: 'Bump-up CD', apy: 5.10, min: '$1,000', stars: 4.7, mark: 'H', color: '#0a1628' },
      { name: 'Crestline Financial', sub: 'Fixed-term CD', apy: 5.00, min: '$1,000', stars: 4.6, mark: 'C', color: '#1e3a8a' },
      { name: 'Pinnacle Trust', sub: 'Premier CD', apy: 4.85, min: '$2,500', stars: 4.4, mark: 'P', color: '#6d28d9' },
      { name: 'Coastline Credit Union', sub: 'Member CD', apy: 4.75, min: '$500', stars: 4.5, mark: 'C', color: '#d97706' },
      { name: 'North Ridge', sub: 'Standard CD', apy: 4.60, min: '$1,000', stars: 4.3, mark: 'N', color: '#2d6a4f' },
    ],
  },
  mortgage: {
    label: '30-yr fixed mortgage',
    headers: ['Lender', 'Rate', 'Points', 'Rating'],
    maxApy: 8.0,
    rows: [
      { name: 'Crestline Mortgage', sub: 'Conventional 30-yr', apy: 6.39, min: '0.5 pts', stars: 4.7, mark: 'C', color: '#1e3a8a', best: 'Lowest rate' },
      { name: 'Heritage Home Loans', sub: 'Conventional 30-yr', apy: 6.45, min: '0 pts', stars: 4.6, mark: 'H', color: '#0a1628' },
      { name: 'Marlowe Direct', sub: 'Online mortgage · 30-yr', apy: 6.49, min: '0.25 pts', stars: 4.5, mark: 'M', color: '#0a1628' },
      { name: 'Pinnacle Lending', sub: 'Conventional 30-yr', apy: 6.55, min: '0 pts', stars: 4.3, mark: 'P', color: '#6d28d9' },
      { name: 'North Ridge', sub: 'First-time buyer · 30-yr', apy: 6.62, min: '0.75 pts', stars: 4.2, mark: 'N', color: '#2d6a4f' },
      { name: 'Coastline Mortgage', sub: 'Conventional 30-yr', apy: 6.70, min: '0 pts', stars: 4.1, mark: 'C', color: '#d97706' },
    ],
  },
};

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="stars">
      <b>{value.toFixed(1)}</b>{' '}
      <span aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            style={{
              color:
                i < full
                  ? 'var(--ft-accent)'
                  : i === full && half
                  ? 'var(--ft-accent)'
                  : 'var(--line-2)',
            }}
          >
            ★
          </span>
        ))}
      </span>
    </span>
  );
}

export function RatesTable() {
  const [tab, setTab] = useState('hysa');
  const data = TAB_DATA[tab];
  const isRate = tab === 'mortgage';

  return (
    <section className="rates section-tight" id="rates">
      <div className="container">
        <div className="rates-head">
          <div>
            <div className="eyebrow">Sample comparison · illustrative only</div>
            <h2>
              Where the <em>best rates</em> live this week.
            </h2>
          </div>
          <div className="rates-tabs" role="tablist">
            {Object.entries(TAB_DATA).map(([k, v]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="rates-table">
            <thead>
              <tr>
                <th>{data.headers[0]}</th>
                <th>{data.headers[1]}</th>
                <th className="c">{data.headers[2]}</th>
                <th className="r">{data.headers[3]}</th>
                <th className="r">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={i}>
                  <td>
                    <div className="bank">
                      <div className="bank-mark" style={{ background: row.color }}>{row.mark}</div>
                      <div>
                        <div className="bank-name">
                          {row.name}
                          {row.best && (
                            <span className="pill-best" style={{ marginLeft: 10 }}>{row.best}</span>
                          )}
                        </div>
                        <div className="bank-sub">{row.sub}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="apy-bar-wrap" style={{ justifyContent: 'flex-start' }}>
                      <span className="apy">
                        {row.apy.toFixed(2)}
                        <span style={{ color: 'var(--ink-3)', fontSize: 13, marginLeft: 2 }}>
                          %{isRate ? '' : ' APY'}
                        </span>
                      </span>
                      <span className="apy-bar">
                        <div style={{ width: `${(row.apy / data.maxApy) * 100}%` }} />
                      </span>
                    </div>
                  </td>
                  <td className="c" style={{ color: 'var(--ink-2)' }}>{row.min}</td>
                  <td className="r"><Stars value={row.stars} /></td>
                  <td className="r">
                    <button type="button" className="btn btn-ghost btn-sm">
                      Learn more
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, fontSize: 13, color: 'var(--ink-3)' }}>
          <span>Sample rates for illustration only — not live data. Actual rates vary by provider. We may earn a referral fee.</span>
          <a href="/blog" style={{ color: 'var(--ink)', display: 'inline-flex', gap: 6, alignItems: 'center', fontWeight: 500 }}>
            See full methodology
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
