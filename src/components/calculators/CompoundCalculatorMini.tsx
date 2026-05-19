import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

function fmtMoney(n: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000000) {
    return (n / 1000000).toFixed(n >= 10000000 ? 1 : 2) + 'M';
  }
  if (compact && Math.abs(n) >= 10000) {
    return (n / 1000).toFixed(0) + 'K';
  }
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface ScheduleRow {
  year: number;
  balance: number;
  contributed: number;
  interest: number;
}

export function CompoundCalculatorMini() {
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [freq, setFreq] = useState<'monthly' | 'yearly'>('monthly');
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const schedule: ScheduleRow[] = useMemo(() => {
    const n = freq === 'monthly' ? 12 : 1;
    const r = rate / 100;
    const perPeriod = freq === 'monthly' ? monthly : monthly * 12;
    let balance = principal;
    let contributed = principal;
    const rows: ScheduleRow[] = [{ year: 0, balance, contributed, interest: 0 }];
    for (let y = 1; y <= years; y++) {
      for (let i = 0; i < n; i++) {
        balance = balance * (1 + r / n) + perPeriod;
        contributed += perPeriod;
      }
      rows.push({ year: y, balance, contributed, interest: balance - contributed });
    }
    return rows;
  }, [principal, monthly, rate, years, freq]);

  // Broadcast schedule for breakdown table on dedicated calc page
  useEffect(() => {
    const detail = { schedule };
    (window as any).__finCalcSchedule = schedule;
    const emit = () => window.dispatchEvent(new CustomEvent('calc:schedule', { detail }));
    emit();
    setTimeout(emit, 0);
  }, [schedule]);

  const final = schedule[schedule.length - 1];
  const totalContrib = final.contributed;
  const totalInterest = Math.max(0, final.interest);
  const multiple = final.balance / Math.max(1, totalContrib);

  const W = 560;
  const H = 220;
  const padL = 8;
  const padR = 8;
  const padT = 8;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxBal = Math.max(...schedule.map((r) => r.balance));
  const yearsArr = schedule.slice(1);
  const barCount = yearsArr.length;
  const gap = Math.max(2, (innerW / barCount) * 0.18);
  const barW = (innerW - gap * (barCount - 1)) / barCount;

  const handleMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * W - padL;
      const idx = Math.max(0, Math.min(barCount - 1, Math.floor(x / (barW + gap))));
      setHover(idx);
    },
    [barCount, barW, gap]
  );

  const tickStep = years > 30 ? 10 : years > 15 ? 5 : years > 8 ? 2 : 1;
  const ticks: number[] = [];
  for (let y = 0; y <= years; y += tickStep) ticks.push(y);
  if (ticks[ticks.length - 1] !== years) ticks.push(years);

  const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="calc">
      <div className="calc-head">
        <div className="calc-title">
          <span className="dot" />
          <span><b>Compound interest</b> · live model</span>
        </div>
      </div>

      <div className="calc-result">
        <div>
          <div className="label">Balance in {years} years</div>
          <div className="value">
            <span className="currency">$</span>
            <span className="tnum">{fmtMoney(final.balance)}</span>
          </div>
        </div>
        <div className="delta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {multiple.toFixed(1)}x your contributions
        </div>
      </div>

      <div className="chart" style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          className="chart-svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >
          {[0.25, 0.5, 0.75, 1].map((g, i) => (
            <line key={i} x1={padL} x2={W - padR} y1={padT + innerH * (1 - g)} y2={padT + innerH * (1 - g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {yearsArr.map((row, i) => {
            const totalH = (row.balance / maxBal) * innerH;
            const contribH = (row.contributed / maxBal) * innerH;
            const interestH = totalH - contribH;
            const x = padL + i * (barW + gap);
            const yBase = padT + innerH;
            const isActive = hover === i;
            return (
              <g key={i} opacity={hover === null || isActive ? 1 : 0.55}>
                <rect x={x} y={yBase - contribH} width={barW} height={contribH} rx={Math.min(2, barW / 4)} fill="rgba(245,247,243,0.55)" />
                <rect x={x} y={yBase - totalH} width={barW} height={Math.max(0.5, interestH)} rx={Math.min(2, barW / 4)} fill="var(--ft-accent)" />
                {isActive && <rect x={x - 1} y={padT} width={barW + 2} height={innerH} fill="rgba(217,119,6,0.06)" rx={2} />}
              </g>
            );
          })}

          {ticks.map((t) => {
            if (t === 0) return null;
            const i = t - 1;
            const x = padL + i * (barW + gap) + barW / 2;
            return (
              <text key={t} x={x} y={H - 8} fontSize={10} textAnchor="middle" fill="rgba(245,247,243,0.45)" fontFamily="var(--ff-mono)">
                Y{t}
              </text>
            );
          })}
        </svg>

        {hover !== null && yearsArr[hover] && (
          <div
            className="tip show"
            style={{
              left: `${((padL + hover * (barW + gap) + barW / 2) / W) * 100}%`,
              top: `${((padT + (innerH - (yearsArr[hover].balance / maxBal) * innerH)) / H) * 100}%`,
            }}
          >
            <div className="row" style={{ fontWeight: 500, marginBottom: 4 }}>Year {yearsArr[hover].year}</div>
            <div className="row">
              <span style={{ color: 'var(--ink-3)' }}>Balance</span>
              <b className="tnum">${fmtMoney(yearsArr[hover].balance)}</b>
            </div>
            <div className="row">
              <span style={{ color: 'var(--ink-3)' }}>Interest</span>
              <b className="tnum" style={{ color: 'var(--ft-accent)' }}>${fmtMoney(yearsArr[hover].interest)}</b>
            </div>
          </div>
        )}

        <div className="chart-legend">
          <span>
            <span className="swatch" style={{ background: 'rgba(245,247,243,0.55)' }} />
            Contributions <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(totalContrib, { compact: true })}</span>
          </span>
          <span>
            <span className="swatch" style={{ background: 'var(--ft-accent)' }} />
            Interest earned <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(totalInterest, { compact: true })}</span>
          </span>
        </div>
      </div>

      <div className="calc-inputs">
        <div className="field" style={{ gridColumn: 'span 2' }}>
          <div className="field-row">
            <span>Starting balance</span>
            <span className="v">${fmtMoney(principal)}</span>
          </div>
          <div className="amount-input">
            <span>$</span>
            <input type="number" value={principal} min={0} max={1000000} step={500} onChange={(e) => setPrincipal(+e.target.value || 0)} />
          </div>
          <input type="range" min={0} max={100000} step={500} value={principal} onChange={(e) => setPrincipal(+e.target.value)} style={{ '--p': pct(principal, 0, 100000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row">
            <span>Monthly contribution</span>
            <span className="v">${fmtMoney(monthly)}</span>
          </div>
          <input type="range" min={0} max={3000} step={25} value={monthly} onChange={(e) => setMonthly(+e.target.value)} style={{ '--p': pct(monthly, 0, 3000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row">
            <span>Annual return</span>
            <span className="v">{rate.toFixed(1)}%</span>
          </div>
          <input type="range" min={0} max={15} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} style={{ '--p': pct(rate, 0, 15) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row">
            <span>Time horizon</span>
            <span className="v">{years} years</span>
          </div>
          <input type="range" min={1} max={50} step={1} value={years} onChange={(e) => setYears(+e.target.value)} style={{ '--p': pct(years, 1, 50) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row">
            <span>Compound frequency</span>
            <span className="v">{freq === 'monthly' ? '12x/yr' : '1x/yr'}</span>
          </div>
          <div className="freq-row">
            <button type="button" aria-pressed={freq === 'monthly'} onClick={() => setFreq('monthly')}>Monthly</button>
            <button type="button" aria-pressed={freq === 'yearly'} onClick={() => setFreq('yearly')}>Yearly</button>
          </div>
        </div>
      </div>

      <div className="calc-foot">
        <span>Assumes constant return — actual markets vary.</span>
        <a href="/calculators/compound-interest" style={{ color: 'var(--ink-on-dark)', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          Full breakdown
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
