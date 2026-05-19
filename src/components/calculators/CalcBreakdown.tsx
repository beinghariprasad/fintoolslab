import { useState, useMemo } from 'react';

interface Column {
  key: string;
  label: string;
  accent?: boolean;
}

interface CalcBreakdownProps {
  schedule: Record<string, number>[];
  columns: Column[];
  yearKey?: string;
  yearFormat?: (row: Record<string, number>) => string;
  shareKey?: string;
  shareBase?: string | string[];
  shareLabel?: string;
  title?: React.ReactNode;
  csvFilename?: string;
}

function fmtMoney(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getShareDenom(row: Record<string, number>, shareBase: string | string[]): number {
  if (Array.isArray(shareBase)) {
    return shareBase.reduce((sum, k) => sum + (row[k] ?? 0), 0);
  }
  return row[shareBase] ?? 0;
}

export function CalcBreakdown({
  schedule,
  columns,
  yearKey = 'year',
  yearFormat,
  shareKey,
  shareBase = 'balance',
  shareLabel = 'Interest share',
  title,
  csvFilename = 'breakdown',
}: CalcBreakdownProps) {
  const [view, setView] = useState<'all' | '5' | '10'>('all');

  const rows = useMemo(() => {
    const rs = schedule.slice(1);
    if (view === '5') return rs.filter((r) => r[yearKey] % 5 === 0 || r === rs[rs.length - 1]);
    if (view === '10') return rs.filter((r) => r[yearKey] % 10 === 0 || r === rs[rs.length - 1]);
    return rs;
  }, [schedule, view, yearKey]);

  const maxShare = shareKey ? Math.max(...rows.map((r) => r[shareKey] ?? 0), 1) : 1;

  const downloadCSV = () => {
    const header = [
      yearFormat ? 'Period' : 'Year',
      ...columns.map((c) => c.label),
      ...(shareKey ? [shareLabel] : []),
    ];
    const csvRows = rows.map((r) => {
      const yVal = yearFormat ? yearFormat(r) : `Y${String(r[yearKey]).padStart(2, '0')}`;
      const vals = columns.map((c) => r[c.key]?.toFixed(2) ?? '0');
      if (shareKey) {
        const denom = getShareDenom(r, shareBase);
        const share = denom > 0 ? ((r[shareKey] / denom) * 100).toFixed(1) + '%' : '0%';
        vals.push(share);
      }
      return [yVal, ...vals];
    });
    const csv = [header, ...csvRows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${csvFilename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="bd-head">
        <div>
          <div className="eyebrow">Year-by-year</div>
          <h2>{title || <>The <em>full breakdown</em>.</>}</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className="bd-csv" onClick={downloadCSV} title="Download CSV">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            CSV
          </button>
          <div className="bd-toggle" role="tablist" aria-label="View density">
            {(['all', '5', '10'] as const).map((v) => (
              <button key={v} type="button" aria-selected={view === v} onClick={() => setView(v)}>
                {v === 'all' ? 'Every year' : v === '5' ? '5-yr' : '10-yr'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="bd-table">
          <thead>
            <tr>
              <th>{yearFormat ? 'Period' : 'Year'}</th>
              {columns.map((c) => (
                <th key={c.key} className="r">{c.label}</th>
              ))}
              {shareKey && <th className="r" style={{ width: 200 }}>{shareLabel}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const denom = getShareDenom(r, shareBase);
              const share = shareKey && denom > 0 ? r[shareKey] / denom : 0;
              return (
                <tr key={idx}>
                  <td className="row-y">
                    {yearFormat ? yearFormat(r) : `Y${String(r[yearKey]).padStart(2, '0')}`}
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} className="r" style={c.accent ? { color: 'var(--ft-accent)' } : undefined}>
                      ${fmtMoney(r[c.key] ?? 0)}
                    </td>
                  ))}
                  {shareKey && (
                    <td className="r">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                        <span className="interest-bar" style={{ width: `${Math.max(2, ((r[shareKey] ?? 0) / maxShare) * 120)}px` }} />
                        <span className="tnum" style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--ink-3)', minWidth: 38, textAlign: 'right' }}>
                          {(share * 100).toFixed(0)}%
                        </span>
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
