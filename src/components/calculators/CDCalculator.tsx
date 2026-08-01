import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

function fmtMoney(n: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 1 : 2) + 'M';
  if (compact && Math.abs(n) >= 10000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const TERMS = [3, 6, 9, 12, 18, 24, 36, 48, 60];

// Banks quote APY (annual percentage yield), which already includes compounding.
// Value after t years = P × (1 + APY)^t regardless of daily/monthly crediting.
function cdValue(principal: number, apyPct: number, months: number) {
  return principal * Math.pow(1 + apyPct / 100, months / 12);
}

function monthlyRate(apyPct: number) {
  return Math.pow(1 + apyPct / 100, 1 / 12) - 1;
}

function aprToApy(aprPct: number, periodsPerYear: number) {
  return (Math.pow(1 + aprPct / 100 / periodsPerYear, periodsPerYear) - 1) * 100;
}

interface MonthRow { p: number; rung: number; months: number; balance: number; contributed: number; interest: number }

const DEFAULT_RUNG_APYS = [4.4, 4.15, 4.0, 3.9, 3.85];

export function CDCalculator() {
  const [mode, setMode] = useState<'single' | 'ladder'>('single');

  // Single CD state
  const [deposit, setDeposit] = useState(10000);
  const [apy, setApy] = useState(4.5);
  const [termMonths, setTermMonths] = useState(12);
  const [penaltyMonths, setPenaltyMonths] = useState(6);
  const [aprIn, setAprIn] = useState(4.4);
  const [aprComp, setAprComp] = useState<'daily' | 'monthly'>('daily');

  // Ladder state
  const [ladderTotal, setLadderTotal] = useState(25000);
  const [rungCount, setRungCount] = useState<4 | 5>(5);
  const [rungApys, setRungApys] = useState<number[]>(DEFAULT_RUNG_APYS);

  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const maturityValue = cdValue(deposit, apy, termMonths);
  const interestEarned = maturityValue - deposit;
  const convertedApy = aprToApy(aprIn, aprComp === 'daily' ? 365 : 12);
  const earlyPenalty = penaltyMonths * deposit * monthlyRate(apy);

  // Month-by-month growth for the single CD
  const singleSchedule: MonthRow[] = useMemo(() => {
    const rows: MonthRow[] = [];
    for (let m = 1; m <= termMonths; m++) {
      const bal = cdValue(deposit, apy, m);
      rows.push({ p: m, rung: 0, months: termMonths, balance: bal, contributed: deposit, interest: bal - deposit });
    }
    return rows;
  }, [deposit, apy, termMonths]);

  // Ladder: equal split across rungs, rung i matures after i years
  const ladder = useMemo(() => {
    const perRung = ladderTotal / rungCount;
    const rows: MonthRow[] = [];
    let total = 0;
    for (let i = 0; i < rungCount; i++) {
      const rApy = rungApys[i] ?? 4;
      const months = (i + 1) * 12;
      const value = cdValue(perRung, rApy, months);
      total += value;
      rows.push({ p: i + 1, rung: i + 1, months, balance: value, contributed: perRung, interest: value - perRung });
    }
    const blendedApy = rungApys.slice(0, rungCount).reduce((s, a) => s + a, 0) / rungCount;
    return { rows, total, totalInterest: total - ladderTotal, blendedApy, perRung };
  }, [ladderTotal, rungCount, rungApys]);

  // Broadcast schedule for the page-level breakdown table
  useEffect(() => {
    const rows = mode === 'single' ? singleSchedule : ladder.rows;
    const seed: MonthRow = mode === 'single'
      ? { p: 0, rung: 0, months: termMonths, balance: deposit, contributed: deposit, interest: 0 }
      : { p: 0, rung: 0, months: 0, balance: ladderTotal, contributed: ladderTotal, interest: 0 };
    const broadcastSchedule = [seed, ...rows];
    const detail = { schedule: broadcastSchedule };
    (window as any).__finCalcSchedule = broadcastSchedule;
    const emit = () => window.dispatchEvent(new CustomEvent('calc:schedule', { detail }));
    emit();
    setTimeout(emit, 0);
  }, [mode, singleSchedule, ladder.rows, deposit, ladderTotal, termMonths]);

  // Chart geometry (single mode: monthly bars)
  const W = 560, H = 220, padL = 8, padR = 8, padT = 8, padB = 28;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const chartRows = mode === 'single' ? singleSchedule : ladder.rows;
  const barCount = chartRows.length;
  const gap = Math.max(2, (innerW / Math.max(barCount, 1)) * 0.18);
  const barW = barCount > 0 ? (innerW - gap * (barCount - 1)) / barCount : 0;
  const chartMax = Math.max(...chartRows.map(r => r.balance), 1);

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W - padL;
    setHover(Math.max(0, Math.min(barCount - 1, Math.floor(x / (barW + gap)))));
  }, [barCount, barW, gap]);

  const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;
  const setRungApy = (i: number, v: number) => {
    setRungApys(prev => prev.map((a, idx) => (idx === i ? v : a)));
  };

  const tickStep = barCount > 36 ? 12 : barCount > 12 ? 6 : barCount > 5 ? 3 : 1;
  const ticks: number[] = [];
  for (let t = tickStep; t <= barCount; t += tickStep) ticks.push(t);
  if (ticks.length === 0 || ticks[ticks.length - 1] !== barCount) ticks.push(barCount);

  return (
    <div className="calc">
      <div className="calc-head">
        <div className="calc-title"><span className="dot" /><span><b>CD</b> · {mode === 'single' ? 'certificate of deposit' : 'ladder builder'}</span></div>
        <div className="calc-tabs" role="tablist" aria-label="Calculator mode">
          <button type="button" aria-selected={mode === 'single'} onClick={() => setMode('single')}>Single CD</button>
          <button type="button" aria-selected={mode === 'ladder'} onClick={() => setMode('ladder')}>Ladder</button>
        </div>
      </div>

      {mode === 'single' ? (
        <>
          <div className="calc-result">
            <div>
              <div className="label">Value at maturity · {termMonths} mo</div>
              <div className="value"><span className="currency">$</span><span className="tnum">{fmtMoney(maturityValue)}</span></div>
            </div>
            <div className="delta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ${fmtMoney(interestEarned, { decimals: interestEarned < 1000 ? 2 : 0 })} interest at {apy.toFixed(2)}% APY
            </div>
          </div>

          <div className="chart" style={{ position: 'relative' }}>
            <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
              {[0.25, 0.5, 0.75, 1].map((g, i) => (
                <line key={i} x1={padL} x2={W - padR} y1={padT + innerH * (1 - g)} y2={padT + innerH * (1 - g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              {chartRows.map((row, i) => {
                const totalH = (row.balance / chartMax) * innerH;
                const prinH = (row.contributed / chartMax) * innerH;
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
                return <text key={t} x={x} y={H - 8} fontSize={10} textAnchor="middle" fill="rgba(245,247,243,0.45)" fontFamily="var(--ff-mono)">M{t}</text>;
              })}
            </svg>

            {hover !== null && chartRows[hover] && (
              <div className="tip show" style={{
                left: `${((padL + hover * (barW + gap) + barW / 2) / W) * 100}%`,
                top: `${((padT + (innerH - (chartRows[hover].balance / chartMax) * innerH)) / H) * 100}%`,
              }}>
                <div className="row" style={{ fontWeight: 500, marginBottom: 4 }}>Month {chartRows[hover].p}</div>
                <div className="row"><span style={{ color: 'var(--ink-3)' }}>Value</span><b className="tnum">${fmtMoney(chartRows[hover].balance, { decimals: 2 })}</b></div>
                <div className="row"><span style={{ color: 'var(--ink-3)' }}>Interest</span><b className="tnum" style={{ color: 'var(--ft-accent)' }}>${fmtMoney(chartRows[hover].interest, { decimals: 2 })}</b></div>
              </div>
            )}

            <div className="chart-legend">
              <span><span className="swatch" style={{ background: 'rgba(245,247,243,0.55)' }} />Deposit <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(deposit, { compact: true })}</span></span>
              <span><span className="swatch" style={{ background: 'var(--ft-accent)' }} />Interest <span className="tnum" style={{ marginLeft: 6, color: 'var(--ink-on-dark)' }}>${fmtMoney(Math.max(0, interestEarned), { compact: true })}</span></span>
            </div>
          </div>

          <div className="calc-inputs">
            <div className="field" style={{ gridColumn: 'span 2' }}>
              <div className="field-row"><span>Deposit</span><span className="v">${fmtMoney(deposit)}</span></div>
              <div className="amount-input"><span>$</span><input type="number" value={deposit} min={100} max={1000000} step={100} onChange={e => setDeposit(Math.max(0, +e.target.value || 0))} /></div>
              <input type="range" min={500} max={250000} step={500} value={Math.min(deposit, 250000)} onChange={e => setDeposit(+e.target.value)} style={{ '--p': pct(Math.min(deposit, 250000), 500, 250000) + '%' } as React.CSSProperties} />
            </div>

            <div className="field">
              <div className="field-row"><span>APY</span><span className="v">{apy.toFixed(2)}%</span></div>
              <input type="range" min={0} max={8} step={0.05} value={apy} onChange={e => setApy(+e.target.value)} style={{ '--p': pct(apy, 0, 8) + '%' } as React.CSSProperties} />
            </div>

            <div className="field">
              <div className="field-row"><span>Penalty if broken early</span><span className="v">{penaltyMonths} mo interest</span></div>
              <input type="range" min={1} max={18} step={1} value={penaltyMonths} onChange={e => setPenaltyMonths(+e.target.value)} style={{ '--p': pct(penaltyMonths, 1, 18) + '%' } as React.CSSProperties} />
            </div>

            <div className="field" style={{ gridColumn: 'span 2' }}>
              <div className="field-row"><span>Term</span><span className="v">{termMonths} months</span></div>
              <div className="freq-row" style={{ flexWrap: 'wrap' }}>
                {TERMS.map(t => (
                  <button key={t} type="button" aria-pressed={termMonths === t} onClick={() => setTermMonths(t)}>{t} mo</button>
                ))}
              </div>
            </div>

            <div className="field" style={{ gridColumn: 'span 2' }}>
              <div className="field-row">
                <span>Bank quoted APR instead? Convert it</span>
                <span className="v">{aprIn.toFixed(2)}% APR ≈ {convertedApy.toFixed(2)}% APY</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="amount-input" style={{ maxWidth: 120 }}>
                  <input type="number" value={aprIn} min={0} max={15} step={0.05} onChange={e => setAprIn(Math.max(0, +e.target.value || 0))} aria-label="APR percent" />
                  <span>%</span>
                </div>
                <div className="freq-row">
                  <button type="button" aria-pressed={aprComp === 'daily'} onClick={() => setAprComp('daily')}>Daily</button>
                  <button type="button" aria-pressed={aprComp === 'monthly'} onClick={() => setAprComp('monthly')}>Monthly</button>
                  <button type="button" aria-pressed={false} onClick={() => setApy(Number(convertedApy.toFixed(2)))}>Use as APY →</button>
                </div>
              </div>
            </div>
          </div>

          <div className="calc-foot">
            <span>
              Breaking this CD early would forfeit ≈ <b className="tnum" style={{ color: 'var(--ink-on-dark)' }}>${fmtMoney(earlyPenalty, { decimals: 2 })}</b> ({penaltyMonths} months of interest).
            </span>
            <span>Math uses APY directly: P × (1 + APY)<sup>t</sup></span>
          </div>
        </>
      ) : (
        <>
          <div className="calc-result">
            <div>
              <div className="label">Ladder value at final maturity</div>
              <div className="value"><span className="currency">$</span><span className="tnum">{fmtMoney(ladder.total)}</span></div>
            </div>
            <div className="delta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {ladder.blendedApy.toFixed(2)}% blended APY · ${fmtMoney(ladder.totalInterest)} total interest
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-on-dark-2)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
              Maturity schedule · ${fmtMoney(ladder.perRung)} per rung
            </div>
            {ladder.rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < ladder.rows.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', fontSize: 13, color: 'var(--ink-on-dark-2)' }}>
                <span style={{ fontFamily: 'var(--ff-mono)', color: 'var(--ft-accent)', minWidth: 56 }}>Rung {r.rung}</span>
                <span style={{ minWidth: 96 }}>{r.months / 12} {r.months === 12 ? 'year' : 'years'} · matures {2026 + r.months / 12}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <div className="amount-input" style={{ maxWidth: 88, padding: '4px 8px' }}>
                    <input type="number" value={rungApys[i] ?? 4} min={0} max={10} step={0.05} onChange={e => setRungApy(i, Math.max(0, +e.target.value || 0))} aria-label={`Rung ${r.rung} APY`} style={{ fontSize: 13 }} />
                    <span>%</span>
                  </div>
                  APY
                </span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--ff-mono)', color: 'var(--ink-on-dark)' }} className="tnum">
                  ${fmtMoney(r.balance)} <span style={{ color: 'var(--ft-accent)' }}>+{fmtMoney(r.interest)}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="calc-inputs">
            <div className="field" style={{ gridColumn: 'span 2' }}>
              <div className="field-row"><span>Total to ladder</span><span className="v">${fmtMoney(ladderTotal)}</span></div>
              <div className="amount-input"><span>$</span><input type="number" value={ladderTotal} min={1000} max={2000000} step={1000} onChange={e => setLadderTotal(Math.max(0, +e.target.value || 0))} /></div>
              <input type="range" min={5000} max={500000} step={5000} value={Math.min(ladderTotal, 500000)} onChange={e => setLadderTotal(+e.target.value)} style={{ '--p': pct(Math.min(ladderTotal, 500000), 5000, 500000) + '%' } as React.CSSProperties} />
            </div>

            <div className="field" style={{ gridColumn: 'span 2' }}>
              <div className="field-row"><span>Rungs</span><span className="v">{rungCount} CDs · 1–{rungCount} yr</span></div>
              <div className="freq-row">
                <button type="button" aria-pressed={rungCount === 4} onClick={() => setRungCount(4)}>4 rungs (1–4 yr)</button>
                <button type="button" aria-pressed={rungCount === 5} onClick={() => setRungCount(5)}>5 rungs (1–5 yr)</button>
              </div>
            </div>
          </div>

          <div className="calc-foot">
            <span>Once rung 1 matures, reinvest it into a new {rungCount}-year CD — one rung then matures every year.</span>
            <span>Blended APY = deposit-weighted average</span>
          </div>
        </>
      )}
    </div>
  );
}
