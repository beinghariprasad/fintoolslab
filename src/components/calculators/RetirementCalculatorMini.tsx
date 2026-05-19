import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

function fmtMoney(n: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 1 : 2) + 'M';
  if (compact && Math.abs(n) >= 10000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

interface Row { year: number; age: number; balance: number; contributed: number; growth: number }

export function RetirementCalculatorMini() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [savings, setSavings] = useState(50000);
  const [monthly, setMonthly] = useState(800);
  const [returnRate, setReturnRate] = useState(7);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const yearsToRetire = Math.max(1, retireAge - currentAge);

  const schedule: Row[] = useMemo(() => {
    const r = returnRate / 100 / 12;
    let balance = savings;
    let contributed = savings;
    const rows: Row[] = [];

    for (let y = 1; y <= yearsToRetire; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + r) + monthly;
        contributed += monthly;
      }
      rows.push({ year: y, age: currentAge + y, balance, contributed, growth: balance - contributed });
    }
    return rows;
  }, [savings, monthly, returnRate, yearsToRetire, currentAge]);

  useEffect(() => {
    const broadcastSchedule = [{ year: 0, age: currentAge, balance: savings, contributed: savings, growth: 0 }, ...schedule];
    const detail = { schedule: broadcastSchedule };
    (window as any).__finCalcSchedule = broadcastSchedule;
    const emit = () => window.dispatchEvent(new CustomEvent('calc:schedule', { detail }));
    emit();
    setTimeout(emit, 0);
  }, [schedule, savings, currentAge]);

  const final = schedule[schedule.length - 1] || { balance: savings, contributed: savings, growth: 0 };
  const monthlyIncome = final.balance * 0.04 / 12; // 4% rule

  const W = 560, H = 220, padL = 8, padR = 8, padT = 8, padB = 28;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const barCount = schedule.length;
  const gap = Math.max(2, (innerW / Math.max(barCount, 1)) * 0.18);
  const barW = barCount > 0 ? (innerW - gap * (barCount - 1)) / barCount : 0;
  const maxBal = Math.max(...schedule.map(r => r.balance), 1);

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W - padL;
    setHover(Math.max(0, Math.min(barCount - 1, Math.floor(x / (barW + gap)))));
  }, [barCount, barW, gap]);

  const tickStep = yearsToRetire > 30 ? 10 : yearsToRetire > 15 ? 5 : yearsToRetire > 8 ? 2 : 1;
  const ticks: number[] = [];
  for (let y = tickStep; y <= yearsToRetire; y += tickStep) ticks.push(y);
  if (ticks.length > 0 && ticks[ticks.length - 1] !== yearsToRetire) ticks.push(yearsToRetire);

  const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="calc">
      <div className="calc-head">
        <div className="calc-title"><span className="dot" /><span><b>Retirement</b> · nest egg planner</span></div>
      </div>

      <div className="calc-result">
        <div>
          <div className="label">Nest egg at age {retireAge}</div>
          <div className="value"><span className="currency">$</span><span className="tnum">{fmtMoney(final.balance)}</span></div>
        </div>
        <div className="delta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ${fmtMoney(monthlyIncome)}/mo via the 4% rule
        </div>
      </div>

      <div className="chart" style={{ position: 'relative' }}>
        <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
          {[0.25, 0.5, 0.75, 1].map((g, i) => (
            <line key={i} x1={padL} x2={W - padR} y1={padT + innerH * (1 - g)} y2={padT + innerH * (1 - g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {schedule.map((row, i) => {
            const totalH = (row.balance / maxBal) * innerH;
            const contribH = (row.contributed / maxBal) * innerH;
            const growthH = totalH - contribH;
            const x = padL + i * (barW + gap);
            const yBase = padT + innerH;
            const isActive = hover === i;
            return (
              <g key={i} opacity={hover === null || isActive ? 1 : 0.55}>
                <rect x={x} y={yBase - contribH} width={barW} height={contribH} rx={Math.min(2, barW / 4)} fill="rgba(245,247,243,0.55)" />
                <rect x={x} y={yBase - totalH} width={barW} height={Math.max(0.5, growthH)} rx={Math.min(2, barW / 4)} fill="var(--ft-accent)" />
                {isActive && <rect x={x - 1} y={padT} width={barW + 2} height={innerH} fill="rgba(217,119,6,0.06)" rx={2} />}
              </g>
            );
          })}

          {ticks.map(t => {
            const i = t - 1;
            if (i < 0 || i >= barCount) return null;
            const x = padL + i * (barW + gap) + barW / 2;
            return <text key={t} x={x} y={H - 8} fontSize={10} textAnchor="middle" fill="rgba(245,247,243,0.45)" fontFamily="var(--ff-mono)">Age {currentAge + t}</text>;
          })}
        </svg>

        {hover !== null && schedule[hover] && (
          <div className="tip show" style={{
            left: `${((padL + hover * (barW + gap) + barW / 2) / W) * 100}%`,
            top: `${((padT + (innerH - (schedule[hover].balance / maxBal) * innerH)) / H) * 100}%`,
          }}>
            <div className="row" style={{ fontWeight: 500, marginBottom: 4 }}>Age {schedule[hover].age}</div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Balance</span><b className="tnum">${fmtMoney(schedule[hover].balance)}</b></div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Growth</span><b className="tnum" style={{ color: 'var(--ft-accent)' }}>${fmtMoney(schedule[hover].growth)}</b></div>
          </div>
        )}

        <div className="chart-legend">
          <span><span className="swatch" style={{ background: 'rgba(245,247,243,0.55)' }} />Contributions <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(final.contributed, { compact: true })}</span></span>
          <span><span className="swatch" style={{ background: 'var(--ft-accent)' }} />Growth <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(Math.max(0, final.growth), { compact: true })}</span></span>
        </div>
      </div>

      <div className="calc-inputs">
        <div className="field">
          <div className="field-row"><span>Current age</span><span className="v">{currentAge}</span></div>
          <input type="range" min={18} max={60} step={1} value={currentAge} onChange={e => setCurrentAge(+e.target.value)} style={{ '--p': pct(currentAge, 18, 60) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Retirement age</span><span className="v">{retireAge}</span></div>
          <input type="range" min={Math.max(currentAge + 1, 50)} max={80} step={1} value={retireAge} onChange={e => setRetireAge(+e.target.value)} style={{ '--p': pct(retireAge, Math.max(currentAge + 1, 50), 80) + '%' } as React.CSSProperties} />
        </div>

        <div className="field" style={{ gridColumn: 'span 2' }}>
          <div className="field-row"><span>Current savings</span><span className="v">${fmtMoney(savings)}</span></div>
          <div className="amount-input"><span>$</span><input type="number" value={savings} min={0} max={1000000} step={1000} onChange={e => setSavings(+e.target.value || 0)} /></div>
          <input type="range" min={0} max={500000} step={1000} value={savings} onChange={e => setSavings(+e.target.value)} style={{ '--p': pct(savings, 0, 500000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Monthly contribution</span><span className="v">${fmtMoney(monthly)}</span></div>
          <input type="range" min={0} max={5000} step={50} value={monthly} onChange={e => setMonthly(+e.target.value)} style={{ '--p': pct(monthly, 0, 5000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Annual return</span><span className="v">{returnRate.toFixed(1)}%</span></div>
          <input type="range" min={0} max={15} step={0.1} value={returnRate} onChange={e => setReturnRate(+e.target.value)} style={{ '--p': pct(returnRate, 0, 15) + '%' } as React.CSSProperties} />
        </div>
      </div>

      <div className="calc-foot">
        <span>Assumes constant return — actual markets vary.</span>
        <a href="/calculators/retirement" style={{ color: 'var(--ink-on-dark)', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          Full breakdown
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </div>
  );
}
