import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

function fmtMoney(n: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 1 : 2) + 'M';
  if (compact && Math.abs(n) >= 10000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

interface Row { year: number; principalPaid: number; interestPaid: number; balance: number }

export function LoanCalculatorMini() {
  const [principal, setPrincipal] = useState(25000);
  const [rate, setRate] = useState(7.5);
  const [termYears, setTermYears] = useState(5);
  const [extra, setExtra] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { monthlyPayment, totalInterest, schedule, payoffYears } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = termYears * 12;
    const mp = principal > 0 && r > 0
      ? principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : principal / Math.max(n, 1);

    let balance = principal;
    const rows: Row[] = [];
    let yearPrin = 0, yearInt = 0;
    let months = 0;

    for (let m = 1; m <= n && balance > 0; m++) {
      const intPmt = balance * r;
      const totalPmt = Math.min(mp + extra, balance + intPmt);
      const prinPmt = totalPmt - intPmt;
      balance = Math.max(0, balance - prinPmt);
      yearPrin += prinPmt;
      yearInt += intPmt;
      months = m;

      if (m % 12 === 0 || balance <= 0) {
        rows.push({ year: Math.ceil(m / 12), principalPaid: yearPrin, interestPaid: yearInt, balance });
        yearPrin = 0;
        yearInt = 0;
      }
    }

    const ti = rows.reduce((s, r) => s + r.interestPaid, 0);
    return { monthlyPayment: mp, totalInterest: ti, schedule: rows, payoffYears: months };
  }, [principal, rate, termYears, extra]);

  useEffect(() => {
    const broadcastSchedule = [{ year: 0, principalPaid: 0, interestPaid: 0, balance: principal }, ...schedule];
    const detail = { schedule: broadcastSchedule };
    (window as any).__finCalcSchedule = broadcastSchedule;
    const emit = () => window.dispatchEvent(new CustomEvent('calc:schedule', { detail }));
    emit();
    setTimeout(emit, 0);
  }, [schedule, principal]);

  const W = 560, H = 220, padL = 8, padR = 8, padT = 8, padB = 28;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const barCount = schedule.length;
  const gap = Math.max(2, (innerW / Math.max(barCount, 1)) * 0.18);
  const barW = barCount > 0 ? (innerW - gap * (barCount - 1)) / barCount : 0;
  const maxVal = Math.max(...schedule.map(r => r.principalPaid + r.interestPaid), 1);

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W - padL;
    setHover(Math.max(0, Math.min(barCount - 1, Math.floor(x / (barW + gap)))));
  }, [barCount, barW, gap]);

  const ticks: number[] = [];
  const totalYrs = schedule.length;
  const tickStep = totalYrs > 15 ? 5 : totalYrs > 8 ? 2 : 1;
  for (let y = tickStep; y <= totalYrs; y += tickStep) ticks.push(y);
  if (ticks.length > 0 && ticks[ticks.length - 1] !== totalYrs) ticks.push(totalYrs);

  const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="calc">
      <div className="calc-head">
        <div className="calc-title"><span className="dot" /><span><b>Loan</b> · amortization model</span></div>
      </div>

      <div className="calc-result">
        <div>
          <div className="label">Monthly payment</div>
          <div className="value"><span className="currency">$</span><span className="tnum">{fmtMoney(monthlyPayment)}</span></div>
        </div>
        <div className="delta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ${fmtMoney(totalInterest, { compact: true })} total interest · {Math.floor(payoffYears / 12)}y {payoffYears % 12}m payoff
        </div>
      </div>

      <div className="chart" style={{ position: 'relative' }}>
        <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
          {[0.25, 0.5, 0.75, 1].map((g, i) => (
            <line key={i} x1={padL} x2={W - padR} y1={padT + innerH * (1 - g)} y2={padT + innerH * (1 - g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {schedule.map((row, i) => {
            const totalH = ((row.principalPaid + row.interestPaid) / maxVal) * innerH;
            const prinH = (row.principalPaid / maxVal) * innerH;
            const intH = totalH - prinH;
            const x = padL + i * (barW + gap);
            const yBase = padT + innerH;
            const isActive = hover === i;
            return (
              <g key={i} opacity={hover === null || isActive ? 1 : 0.55}>
                <rect x={x} y={yBase - prinH} width={barW} height={prinH} rx={Math.min(2, barW / 4)} fill="rgba(245,247,243,0.55)" />
                <rect x={x} y={yBase - totalH} width={barW} height={Math.max(0.5, intH)} rx={Math.min(2, barW / 4)} fill="var(--ft-accent)" />
                {isActive && <rect x={x - 1} y={padT} width={barW + 2} height={innerH} fill="rgba(217,119,6,0.06)" rx={2} />}
              </g>
            );
          })}

          {ticks.map(t => {
            const i = t - 1;
            if (i < 0 || i >= barCount) return null;
            const x = padL + i * (barW + gap) + barW / 2;
            return <text key={t} x={x} y={H - 8} fontSize={10} textAnchor="middle" fill="rgba(245,247,243,0.45)" fontFamily="var(--ff-mono)">Y{t}</text>;
          })}
        </svg>

        {hover !== null && schedule[hover] && (
          <div className="tip show" style={{
            left: `${((padL + hover * (barW + gap) + barW / 2) / W) * 100}%`,
            top: `${((padT + (innerH - ((schedule[hover].principalPaid + schedule[hover].interestPaid) / maxVal) * innerH)) / H) * 100}%`,
          }}>
            <div className="row" style={{ fontWeight: 500, marginBottom: 4 }}>Year {schedule[hover].year}</div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Principal</span><b className="tnum">${fmtMoney(schedule[hover].principalPaid)}</b></div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Interest</span><b className="tnum" style={{ color: 'var(--ft-accent)' }}>${fmtMoney(schedule[hover].interestPaid)}</b></div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Balance</span><b className="tnum">${fmtMoney(schedule[hover].balance)}</b></div>
          </div>
        )}

        <div className="chart-legend">
          <span><span className="swatch" style={{ background: 'rgba(245,247,243,0.55)' }} />Principal <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(principal, { compact: true })}</span></span>
          <span><span className="swatch" style={{ background: 'var(--ft-accent)' }} />Interest <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(totalInterest, { compact: true })}</span></span>
        </div>
      </div>

      <div className="calc-inputs">
        <div className="field" style={{ gridColumn: 'span 2' }}>
          <div className="field-row"><span>Loan amount</span><span className="v">${fmtMoney(principal)}</span></div>
          <div className="amount-input"><span>$</span><input type="number" value={principal} min={1000} max={200000} step={500} onChange={e => setPrincipal(+e.target.value || 0)} /></div>
          <input type="range" min={1000} max={200000} step={500} value={principal} onChange={e => setPrincipal(+e.target.value)} style={{ '--p': pct(principal, 1000, 200000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Interest rate</span><span className="v">{rate.toFixed(1)}%</span></div>
          <input type="range" min={1} max={25} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} style={{ '--p': pct(rate, 1, 25) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Loan term</span><span className="v">{termYears} years</span></div>
          <input type="range" min={1} max={30} step={1} value={termYears} onChange={e => setTermYears(+e.target.value)} style={{ '--p': pct(termYears, 1, 30) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Extra monthly payment</span><span className="v">${fmtMoney(extra)}</span></div>
          <input type="range" min={0} max={1000} step={25} value={extra} onChange={e => setExtra(+e.target.value)} style={{ '--p': pct(extra, 0, 1000) + '%' } as React.CSSProperties} />
        </div>
      </div>

      <div className="calc-foot">
        <span>Fixed-rate amortization — excludes fees.</span>
        <a href="/calculators/loan" style={{ color: 'var(--ink-on-dark)', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          Full breakdown
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </div>
  );
}
