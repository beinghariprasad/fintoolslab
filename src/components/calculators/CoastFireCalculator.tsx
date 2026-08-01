import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

function fmtMoney(n: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 1 : 2) + 'M';
  if (compact && Math.abs(n) >= 10000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

interface Row {
  year: number;
  age: number;
  balance: number;
  contributed: number;
  growth: number;
  coastTarget: number;
}

export function CoastFireCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [savings, setSavings] = useState(100000);
  const [spending, setSpending] = useState(60000);
  const [monthly, setMonthly] = useState(1000);
  const [nominalReturn, setNominalReturn] = useState(7);
  const [inflation, setInflation] = useState(2.8);
  const [swr, setSwr] = useState(4);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const yearsToRetire = Math.max(1, retireAge - currentAge);

  // All figures in TODAY'S dollars. Growth uses the real (inflation-adjusted) return,
  // so the FIRE number stays constant in today's dollars and the coast target is
  // the FIRE number discounted back at the real rate.
  const { fireNumber, coastToday, realReturn, schedule, coastAge, alreadyCoasting } = useMemo(() => {
    const real = (1 + nominalReturn / 100) / (1 + inflation / 100) - 1;
    const fire = swr > 0 ? spending / (swr / 100) : 0;
    const coast = fire / Math.pow(1 + real, yearsToRetire);

    const mReal = Math.pow(1 + real, 1 / 12) - 1;
    let balance = savings;
    let contributed = savings;
    let firstCoastMonth: number | null = savings >= coast ? 0 : null;
    const rows: Row[] = [];

    for (let y = 1; y <= yearsToRetire; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + mReal) + monthly;
        contributed += monthly;
        if (firstCoastMonth === null) {
          const t = (y - 1) + (m + 1) / 12;
          const target = fire / Math.pow(1 + real, yearsToRetire - t);
          if (balance >= target) firstCoastMonth = (y - 1) * 12 + m + 1;
        }
      }
      rows.push({
        year: y,
        age: currentAge + y,
        balance,
        contributed,
        growth: balance - contributed,
        coastTarget: fire / Math.pow(1 + real, yearsToRetire - y),
      });
    }

    return {
      fireNumber: fire,
      coastToday: coast,
      realReturn: real,
      schedule: rows,
      coastAge: firstCoastMonth !== null ? currentAge + firstCoastMonth / 12 : null,
      alreadyCoasting: savings >= coast,
    };
  }, [currentAge, retireAge, savings, spending, monthly, nominalReturn, inflation, swr, yearsToRetire]);

  useEffect(() => {
    const broadcastSchedule = [
      { year: 0, age: currentAge, balance: savings, contributed: savings, growth: 0, coastTarget: coastToday },
      ...schedule,
    ];
    const detail = { schedule: broadcastSchedule };
    (window as any).__finCalcSchedule = broadcastSchedule;
    const emit = () => window.dispatchEvent(new CustomEvent('calc:schedule', { detail }));
    emit();
    setTimeout(emit, 0);
  }, [schedule, savings, currentAge, coastToday]);

  const W = 560, H = 220, padL = 8, padR = 8, padT = 8, padB = 28;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const barCount = schedule.length;
  const gap = Math.max(2, (innerW / Math.max(barCount, 1)) * 0.18);
  const barW = barCount > 0 ? (innerW - gap * (barCount - 1)) / barCount : 0;
  const maxVal = Math.max(...schedule.map(r => Math.max(r.balance, r.coastTarget)), 1);

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

  const targetPoints = schedule
    .map((r, i) => {
      const x = padL + i * (barW + gap) + barW / 2;
      const y = padT + innerH - (r.coastTarget / maxVal) * innerH;
      return `${x},${y}`;
    })
    .join(' ');

  const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="calc">
      <div className="calc-head">
        <div className="calc-title">
          <span className="dot" />
          <span><b>Coast FIRE</b> · today's dollars</span>
        </div>
      </div>

      <div className="calc-result">
        <div>
          <div className="label">Coast FIRE number (today)</div>
          <div className="value">
            <span className="currency">$</span>
            <span className="tnum">{fmtMoney(coastToday)}</span>
          </div>
        </div>
        <div className="delta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {alreadyCoasting
            ? <>Already coasting — ${fmtMoney(savings - coastToday, { compact: true })} past the line</>
            : coastAge !== null
              ? <>Coast FIRE at age ~{Math.round(coastAge * 10) / 10}</>
              : <>Not reached by {retireAge} at ${fmtMoney(monthly)}/mo</>}
        </div>
      </div>

      <div className="chart" style={{ position: 'relative' }}>
        <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
          {[0.25, 0.5, 0.75, 1].map((g, i) => (
            <line key={i} x1={padL} x2={W - padR} y1={padT + innerH * (1 - g)} y2={padT + innerH * (1 - g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {schedule.map((row, i) => {
            const totalH = (row.balance / maxVal) * innerH;
            const contribH = (Math.min(row.contributed, row.balance) / maxVal) * innerH;
            const growthH = Math.max(0, totalH - contribH);
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

          {barCount > 1 && (
            <polyline points={targetPoints} fill="none" stroke="rgba(245,247,243,0.85)" strokeWidth="1.6" strokeDasharray="5 4" />
          )}

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
            top: `${((padT + (innerH - (schedule[hover].balance / maxVal) * innerH)) / H) * 100}%`,
          }}>
            <div className="row" style={{ fontWeight: 500, marginBottom: 4 }}>Age {schedule[hover].age}</div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Balance</span><b className="tnum">${fmtMoney(schedule[hover].balance)}</b></div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Coast target</span><b className="tnum" style={{ color: 'var(--ft-accent)' }}>${fmtMoney(schedule[hover].coastTarget)}</b></div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Progress</span><b className="tnum">{Math.round((schedule[hover].balance / Math.max(1, schedule[hover].coastTarget)) * 100)}%</b></div>
          </div>
        )}

        <div className="chart-legend">
          <span><span className="swatch" style={{ background: 'rgba(245,247,243,0.55)' }} />Contributions</span>
          <span><span className="swatch" style={{ background: 'var(--ft-accent)' }} />Growth</span>
          <span><span className="swatch" style={{ background: 'transparent', border: '1px dashed rgba(245,247,243,0.85)' }} />Coast target · FIRE ${fmtMoney(fireNumber, { compact: true })}</span>
        </div>
      </div>

      <div className="calc-inputs">
        <div className="field">
          <div className="field-row"><span>Current age</span><span className="v">{currentAge}</span></div>
          <input type="range" min={18} max={60} step={1} value={currentAge} onChange={e => setCurrentAge(+e.target.value)} style={{ '--p': pct(currentAge, 18, 60) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Retirement age</span><span className="v">{retireAge}</span></div>
          <input type="range" min={Math.max(currentAge + 1, 45)} max={75} step={1} value={retireAge} onChange={e => setRetireAge(+e.target.value)} style={{ '--p': pct(retireAge, Math.max(currentAge + 1, 45), 75) + '%' } as React.CSSProperties} />
        </div>

        <div className="field" style={{ gridColumn: 'span 2' }}>
          <div className="field-row"><span>Current invested savings</span><span className="v">${fmtMoney(savings)}</span></div>
          <div className="amount-input"><span>$</span><input type="number" value={savings} min={0} max={5000000} step={5000} onChange={e => setSavings(Math.max(0, +e.target.value || 0))} /></div>
          <input type="range" min={0} max={1000000} step={5000} value={Math.min(1000000, savings)} onChange={e => setSavings(+e.target.value)} style={{ '--p': pct(Math.min(1000000, savings), 0, 1000000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Annual spending in retirement</span><span className="v">${fmtMoney(spending)}</span></div>
          <input type="range" min={20000} max={200000} step={2000} value={spending} onChange={e => setSpending(+e.target.value)} style={{ '--p': pct(spending, 20000, 200000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Monthly contribution</span><span className="v">${fmtMoney(monthly)}</span></div>
          <input type="range" min={0} max={10000} step={100} value={monthly} onChange={e => setMonthly(+e.target.value)} style={{ '--p': pct(monthly, 0, 10000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Expected return (nominal)</span><span className="v">{nominalReturn.toFixed(1)}%</span></div>
          <input type="range" min={0} max={12} step={0.1} value={nominalReturn} onChange={e => setNominalReturn(+e.target.value)} style={{ '--p': pct(nominalReturn, 0, 12) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Inflation</span><span className="v">{inflation.toFixed(1)}% (real {(realReturn * 100).toFixed(1)}%)</span></div>
          <input type="range" min={0} max={6} step={0.1} value={inflation} onChange={e => setInflation(+e.target.value)} style={{ '--p': pct(inflation, 0, 6) + '%' } as React.CSSProperties} />
        </div>

        <div className="field" style={{ gridColumn: 'span 2' }}>
          <div className="field-row"><span>Safe withdrawal rate</span><span className="v">{swr.toFixed(2)}% · FIRE ${fmtMoney(fireNumber, { compact: true })}</span></div>
          <input type="range" min={2} max={6} step={0.25} value={swr} onChange={e => setSwr(+e.target.value)} style={{ '--p': pct(swr, 2, 6) + '%' } as React.CSSProperties} />
        </div>
      </div>

      <div className="calc-foot">
        <span>All figures in today's dollars — growth uses your inflation-adjusted (real) return.</span>
        <a href="/calculators/coast-fire" style={{ color: 'var(--ink-on-dark)', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          Full breakdown
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </div>
  );
}
