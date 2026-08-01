import { useState, useMemo, useEffect } from 'react';

function fmtMoney(n: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 1 : 2) + 'M';
  if (compact && Math.abs(n) >= 10000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

type Mode = 'hourly' | 'salary';

export interface PayRow { period: string; base: number; total: number }

export function SalaryToHourlyCalculator() {
  const [mode, setMode] = useState<Mode>('hourly');
  const [hourlyInput, setHourlyInput] = useState(25);
  const [salaryInput, setSalaryInput] = useState(60000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [otHours, setOtHours] = useState(0);
  const [unpaidWeeks, setUnpaidWeeks] = useState(0);

  const {
    hourly, paidWeeks, weeklyBase, weeklyTotal, annualBase, annualTotal, otAnnual, rows,
  } = useMemo(() => {
    const workUnits = hoursPerWeek * weeksPerYear;
    const rate = mode === 'hourly'
      ? hourlyInput
      : workUnits > 0 ? salaryInput / workUnits : 0;

    const paid = Math.max(0, weeksPerYear - unpaidWeeks);
    const wkBase = rate * hoursPerWeek;
    const wkOt = rate * 1.5 * otHours;
    const wkTotal = wkBase + wkOt;
    const annBase = wkBase * paid;
    const annTotal = wkTotal * paid;

    const days = 5; // standard 5-day work week for the "daily" figure
    const payRows: PayRow[] = [
      { period: 'Hourly', base: rate, total: rate },
      { period: 'Daily', base: wkBase / days, total: wkTotal / days },
      { period: 'Weekly', base: wkBase, total: wkTotal },
      { period: 'Biweekly', base: wkBase * 2, total: wkTotal * 2 },
      { period: 'Monthly', base: annBase / 12, total: annTotal / 12 },
      { period: 'Annual', base: annBase, total: annTotal },
    ];

    return {
      hourly: rate,
      paidWeeks: paid,
      weeklyBase: wkBase,
      weeklyTotal: wkTotal,
      annualBase: annBase,
      annualTotal: annTotal,
      otAnnual: wkOt * paid,
      rows: payRows,
    };
  }, [mode, hourlyInput, salaryInput, hoursPerWeek, weeksPerYear, otHours, unpaidWeeks]);

  useEffect(() => {
    const detail = { rows };
    (window as any).__finSalaryRows = rows;
    const emit = () => window.dispatchEvent(new CustomEvent('calc:salary', { detail }));
    emit();
    setTimeout(emit, 0);
  }, [rows]);

  const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

  const heroValue = mode === 'hourly' ? annualTotal : hourly;
  const heroLabel = mode === 'hourly' ? 'Equivalent annual salary' : 'Equivalent hourly wage';

  const tiles = rows.filter(r => (mode === 'hourly' ? r.period !== 'Annual' : r.period !== 'Hourly'));

  return (
    <div className="calc">
      <div className="calc-head">
        <div className="calc-title">
          <span className="dot" />
          <span><b>Pay converter</b> · salary ↔ hourly</span>
        </div>
        <div className="calc-tabs" role="tablist" aria-label="Conversion direction">
          <button type="button" role="tab" aria-selected={mode === 'hourly'} onClick={() => setMode('hourly')}>Hourly → Salary</button>
          <button type="button" role="tab" aria-selected={mode === 'salary'} onClick={() => setMode('salary')}>Salary → Hourly</button>
        </div>
      </div>

      <div className="calc-result">
        <div>
          <div className="label">{heroLabel}</div>
          <div className="value">
            <span className="currency">$</span>
            <span className="tnum">{fmtMoney(heroValue, { decimals: mode === 'salary' ? 2 : 0 })}</span>
          </div>
        </div>
        <div className="delta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {otHours > 0
            ? <>+${fmtMoney(otAnnual, { compact: true })}/yr from overtime</>
            : <>${fmtMoney(annualTotal / 12)}/mo · ${fmtMoney(weeklyTotal)}/wk</>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginTop: 20 }}>
        {tiles.map((t) => (
          <div key={t.period} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line-on-dark)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-on-dark-2)', marginBottom: 6 }}>{t.period}</div>
            <div className="tnum" style={{ fontFamily: 'var(--ff-mono)', fontSize: 17, color: 'var(--ink-on-dark)' }}>
              ${fmtMoney(t.total, { decimals: t.period === 'Hourly' || t.period === 'Daily' ? 2 : 0 })}
            </div>
            {otHours > 0 && t.period !== 'Hourly' && (
              <div className="tnum" style={{ fontSize: 11, color: 'var(--ft-accent)', marginTop: 3 }}>
                +${fmtMoney(t.total - t.base, { decimals: t.period === 'Daily' ? 2 : 0 })} OT
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="calc-inputs">
        {mode === 'hourly' ? (
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <div className="field-row"><span>Hourly wage</span><span className="v">${fmtMoney(hourlyInput, { decimals: 2 })}</span></div>
            <div className="amount-input"><span>$</span><input type="number" value={hourlyInput} min={0} max={500} step={0.25} onChange={e => setHourlyInput(Math.max(0, +e.target.value || 0))} /></div>
            <input type="range" min={7} max={150} step={0.25} value={Math.min(150, Math.max(7, hourlyInput))} onChange={e => setHourlyInput(+e.target.value)} style={{ '--p': pct(Math.min(150, Math.max(7, hourlyInput)), 7, 150) + '%' } as React.CSSProperties} />
          </div>
        ) : (
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <div className="field-row"><span>Annual salary</span><span className="v">${fmtMoney(salaryInput)}</span></div>
            <div className="amount-input"><span>$</span><input type="number" value={salaryInput} min={0} max={2000000} step={1000} onChange={e => setSalaryInput(Math.max(0, +e.target.value || 0))} /></div>
            <input type="range" min={15000} max={400000} step={1000} value={Math.min(400000, Math.max(15000, salaryInput))} onChange={e => setSalaryInput(+e.target.value)} style={{ '--p': pct(Math.min(400000, Math.max(15000, salaryInput)), 15000, 400000) + '%' } as React.CSSProperties} />
          </div>
        )}

        <div className="field">
          <div className="field-row"><span>Hours per week</span><span className="v">{hoursPerWeek}</span></div>
          <input type="range" min={1} max={80} step={1} value={hoursPerWeek} onChange={e => setHoursPerWeek(+e.target.value)} style={{ '--p': pct(hoursPerWeek, 1, 80) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Weeks per year</span><span className="v">{weeksPerYear}</span></div>
          <input type="range" min={1} max={52} step={1} value={weeksPerYear} onChange={e => setWeeksPerYear(+e.target.value)} style={{ '--p': pct(weeksPerYear, 1, 52) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Overtime hours / week (1.5×)</span><span className="v">{otHours}</span></div>
          <input type="range" min={0} max={30} step={1} value={otHours} onChange={e => setOtHours(+e.target.value)} style={{ '--p': pct(otHours, 0, 30) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Unpaid weeks off</span><span className="v">{unpaidWeeks} ({paidWeeks} paid)</span></div>
          <input type="range" min={0} max={12} step={1} value={unpaidWeeks} onChange={e => setUnpaidWeeks(+e.target.value)} style={{ '--p': pct(unpaidWeeks, 0, 12) + '%' } as React.CSSProperties} />
        </div>
      </div>

      <div className="calc-foot">
        <span>Gross pay before taxes. Daily assumes a 5-day week; monthly is annual ÷ 12.</span>
        <a href="/calculators/salary-to-hourly" style={{ color: 'var(--ink-on-dark)', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          Full breakdown
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </div>
  );
}
