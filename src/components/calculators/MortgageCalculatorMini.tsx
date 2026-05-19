import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

function fmtMoney(n: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 1 : 2) + 'M';
  if (compact && Math.abs(n) >= 10000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

interface Row { year: number; principal: number; interest: number; balance: number }

export function MortgageCalculatorMini() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const loanAmount = homePrice * (1 - downPct / 100);

  const { monthlyPayment, totalInterest, schedule } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = termYears * 12;
    const mp = loanAmount > 0 && r > 0
      ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : loanAmount / Math.max(n, 1);
    const ti = mp * n - loanAmount;

    let balance = loanAmount;
    const rows: Row[] = [];
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= n; m++) {
      const intPmt = balance * r;
      const prinPmt = mp - intPmt;
      balance = Math.max(0, balance - prinPmt);
      yearPrincipal += prinPmt;
      yearInterest += intPmt;

      if (m % 12 === 0) {
        rows.push({ year: m / 12, principal: yearPrincipal, interest: yearInterest, balance });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }
    return { monthlyPayment: mp, totalInterest: ti, schedule: rows };
  }, [loanAmount, rate, termYears]);

  useEffect(() => {
    const broadcastSchedule = [{ year: 0, principal: 0, interest: 0, balance: loanAmount }, ...schedule];
    const detail = { schedule: broadcastSchedule };
    (window as any).__finCalcSchedule = broadcastSchedule;
    const emit = () => window.dispatchEvent(new CustomEvent('calc:schedule', { detail }));
    emit();
    setTimeout(emit, 0);
  }, [schedule, loanAmount]);

  const W = 560, H = 220, padL = 8, padR = 8, padT = 8, padB = 28;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const barCount = schedule.length;
  const gap = Math.max(2, (innerW / Math.max(barCount, 1)) * 0.18);
  const barW = barCount > 0 ? (innerW - gap * (barCount - 1)) / barCount : 0;
  const maxVal = Math.max(...schedule.map(r => r.principal + r.interest), 1);

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W - padL;
    const idx = Math.max(0, Math.min(barCount - 1, Math.floor(x / (barW + gap))));
    setHover(idx);
  }, [barCount, barW, gap]);

  const tickStep = termYears > 30 ? 10 : termYears > 15 ? 5 : termYears > 8 ? 2 : 1;
  const ticks: number[] = [];
  for (let y = tickStep; y <= termYears; y += tickStep) ticks.push(y);
  if (ticks[ticks.length - 1] !== termYears) ticks.push(termYears);

  const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="calc">
      <div className="calc-head">
        <div className="calc-title">
          <span className="dot" />
          <span><b>Mortgage</b> · payment breakdown</span>
        </div>
      </div>

      <div className="calc-result">
        <div>
          <div className="label">Monthly payment</div>
          <div className="value">
            <span className="currency">$</span>
            <span className="tnum">{fmtMoney(monthlyPayment)}</span>
          </div>
        </div>
        <div className="delta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ${fmtMoney(totalInterest, { compact: true })} total interest over {termYears} yr
        </div>
      </div>

      <div className="chart" style={{ position: 'relative' }}>
        <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
          {[0.25, 0.5, 0.75, 1].map((g, i) => (
            <line key={i} x1={padL} x2={W - padR} y1={padT + innerH * (1 - g)} y2={padT + innerH * (1 - g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {schedule.map((row, i) => {
            const totalH = ((row.principal + row.interest) / maxVal) * innerH;
            const prinH = (row.principal / maxVal) * innerH;
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
            const x = padL + i * (barW + gap) + barW / 2;
            return <text key={t} x={x} y={H - 8} fontSize={10} textAnchor="middle" fill="rgba(245,247,243,0.45)" fontFamily="var(--ff-mono)">Y{t}</text>;
          })}
        </svg>

        {hover !== null && schedule[hover] && (
          <div className="tip show" style={{
            left: `${((padL + hover * (barW + gap) + barW / 2) / W) * 100}%`,
            top: `${((padT + (innerH - ((schedule[hover].principal + schedule[hover].interest) / maxVal) * innerH)) / H) * 100}%`,
          }}>
            <div className="row" style={{ fontWeight: 500, marginBottom: 4 }}>Year {schedule[hover].year}</div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Principal paid</span><b className="tnum">${fmtMoney(schedule[hover].principal)}</b></div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Interest paid</span><b className="tnum" style={{ color: 'var(--ft-accent)' }}>${fmtMoney(schedule[hover].interest)}</b></div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Balance</span><b className="tnum">${fmtMoney(schedule[hover].balance)}</b></div>
          </div>
        )}

        <div className="chart-legend">
          <span><span className="swatch" style={{ background: 'rgba(245,247,243,0.55)' }} />Principal <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(loanAmount, { compact: true })}</span></span>
          <span><span className="swatch" style={{ background: 'var(--ft-accent)' }} />Interest <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(totalInterest, { compact: true })}</span></span>
        </div>
      </div>

      <div className="calc-inputs">
        <div className="field" style={{ gridColumn: 'span 2' }}>
          <div className="field-row"><span>Home price</span><span className="v">${fmtMoney(homePrice)}</span></div>
          <div className="amount-input"><span>$</span><input type="number" value={homePrice} min={50000} max={2000000} step={5000} onChange={e => setHomePrice(+e.target.value || 0)} /></div>
          <input type="range" min={50000} max={2000000} step={5000} value={homePrice} onChange={e => setHomePrice(+e.target.value)} style={{ '--p': pct(homePrice, 50000, 2000000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Down payment</span><span className="v">{downPct}%</span></div>
          <input type="range" min={0} max={50} step={1} value={downPct} onChange={e => setDownPct(+e.target.value)} style={{ '--p': pct(downPct, 0, 50) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Interest rate</span><span className="v">{rate.toFixed(1)}%</span></div>
          <input type="range" min={1} max={12} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} style={{ '--p': pct(rate, 1, 12) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Loan term</span><span className="v">{termYears} years</span></div>
          <div className="freq-row">
            <button type="button" aria-pressed={termYears === 15} onClick={() => setTermYears(15)}>15 yr</button>
            <button type="button" aria-pressed={termYears === 20} onClick={() => setTermYears(20)}>20 yr</button>
            <button type="button" aria-pressed={termYears === 30} onClick={() => setTermYears(30)}>30 yr</button>
          </div>
        </div>
      </div>

      <div className="calc-foot">
        <span>Principal & interest only — excludes taxes and insurance.</span>
        <a href="/calculators/mortgage" style={{ color: 'var(--ink-on-dark)', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          Full breakdown
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </div>
  );
}
