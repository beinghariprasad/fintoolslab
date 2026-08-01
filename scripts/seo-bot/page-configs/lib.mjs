/**
 * lib.mjs — shared math + formatting helpers for the programmatic page generator.
 * All functions are pure and deterministic. Money is rounded to cents at every
 * step that feeds a displayed number; no Date.now(), no randomness.
 */

export const HOURS_PER_YEAR = 2080; // 40 hrs × 52 weeks
export const WORK_DAYS_PER_YEAR = 260;

/** Round to cents. */
export const r2 = (n) => Math.round(n * 100) / 100;
/** Round to whole dollars. */
export const r0 = (n) => Math.round(n);

/** "$1,234" / "$1,234.56" */
export function usd(n, dec = 0) {
  return (
    '$' +
    n.toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    })
  );
}

/** "1,234" */
export function num(n, dec = 0) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}

/** "6.5%" */
export function pct(n, dec = 1) {
  return `${n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}%`;
}

/**
 * Monthly loan payment (amortizing, fixed rate). annualPct e.g. 6.5.
 * Returns dollars rounded to cents.
 */
export function pmt(principal, annualPct, months) {
  const r = annualPct / 100 / 12;
  if (r === 0) return r2(principal / months);
  return r2((principal * r) / (1 - Math.pow(1 + r, -months)));
}

/** Total interest over the full term given the rounded payment. */
export function totalInterest(principal, annualPct, months) {
  return r2(pmt(principal, annualPct, months) * months - principal);
}

/**
 * Remaining balance after k payments (closed form on the unrounded payment,
 * rounded to cents at the end).
 */
export function balanceAfter(principal, annualPct, months, k) {
  const r = annualPct / 100 / 12;
  if (r === 0) return r2(principal * (1 - k / months));
  const m = (principal * r) / (1 - Math.pow(1 + r, -months));
  const g = Math.pow(1 + r, k);
  return r2(principal * g - (m * (g - 1)) / r);
}

/**
 * Month-by-month amortization rows for the first `count` months.
 * Interest is computed on the running balance and rounded to cents each month,
 * exactly like a servicer statement.
 */
export function amortizationRows(principal, annualPct, months, count) {
  const r = annualPct / 100 / 12;
  const payment = pmt(principal, annualPct, months);
  let bal = principal;
  const rows = [];
  for (let m = 1; m <= count; m++) {
    const interest = r2(bal * r);
    const principalPaid = r2(payment - interest);
    bal = r2(bal - principalPaid);
    rows.push({ month: m, payment, interest, principal: principalPaid, balance: bal });
  }
  return rows;
}

/** Future value of a lump sum with annual compounding. rate e.g. 7 (%). */
export function fvLump(principal, ratePct, years) {
  return r2(principal * Math.pow(1 + ratePct / 100, years));
}

/** Future value with monthly compounding: lump + end-of-month contributions. */
export function fvMonthly(principal, ratePct, years, monthlyContribution) {
  const i = ratePct / 100 / 12;
  const n = years * 12;
  const g = Math.pow(1 + i, n);
  const lump = principal * g;
  const contrib = i === 0 ? monthlyContribution * n : monthlyContribution * ((g - 1) / i);
  return r2(lump + contrib);
}

/** Rule of 72 doubling time in years. */
export function ruleOf72(ratePct) {
  return r2(72 / ratePct);
}

/** Deterministic variant picker — same value always gets the same variant. */
export function pick(variants, seed) {
  return variants[Math.abs(Math.trunc(seed)) % variants.length];
}

/**
 * Up to `count` neighbors below and above `value` from a sorted list,
 * excluding `value` itself. Returns ascending order.
 */
export function neighbors(sortedList, value, count = 3) {
  const idx = sortedList.indexOf(value);
  const lo = sortedList.slice(Math.max(0, idx - count), idx);
  const hi = sortedList.slice(idx + 1, idx + 1 + count);
  return [...lo, ...hi];
}

/** Nearest value in a sorted numeric list. */
export function nearest(sortedList, target) {
  let best = sortedList[0];
  for (const v of sortedList) {
    if (Math.abs(v - target) < Math.abs(best - target)) best = v;
  }
  return best;
}
