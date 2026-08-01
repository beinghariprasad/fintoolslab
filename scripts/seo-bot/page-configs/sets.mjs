/**
 * sets.mjs — the exact value matrices for every category, plus slug helpers.
 * Kept in one file so builders can cross-link without circular imports.
 */

/** Spec-core salary values (highest-priority, published first). */
const SALARY_CORE = new Set(
  [
    // $30k–$120k step $5k
    ...Array.from({ length: 19 }, (_, i) => 30000 + i * 5000),
    // spec extras
    42000, 47000, 52000, 58000, 62000, 68000, 72000, 78000,
  ],
);

/**
 * Full salary matrix (65 values): every $1k from $30k–$80k (the dense band of
 * real search demand), then coarser steps up to $120k.
 */
export const SALARY_AMOUNTS = [
  ...Array.from({ length: 51 }, (_, i) => 30000 + i * 1000),
  82000, 84000, 85000, 86000, 88000, 90000, 92000, 95000, 98000,
  100000, 105000, 110000, 115000, 120000,
]
  .filter((v, i, a) => a.indexOf(v) === i)
  .sort((x, y) => x - y);

export const isSalaryCore = (a) => SALARY_CORE.has(a);
export const salarySlug = (a) => `${a}-a-year-is-how-much-an-hour`;

/** Spec-core hourly wages. */
const HOURLY_CORE = new Set([
  ...Array.from({ length: 26 }, (_, i) => 15 + i), // $15–$40
  45, 50, 55, 60,
]);

/** Full hourly matrix (34 values): $15–$45 step $1, plus $50/$55/$60. */
export const HOURLY_WAGES = [
  ...Array.from({ length: 31 }, (_, i) => 15 + i),
  50, 55, 60,
]
  .filter((v, i, a) => a.indexOf(v) === i)
  .sort((x, y) => x - y);

export const isHourlyCore = (w) => HOURLY_CORE.has(w);
export const hourlySlug = (w) => `${w}-an-hour-is-how-much-a-year`;

/** Mortgage amounts: $100k–$1M step $50k (19 values). */
export const MORTGAGE_AMOUNTS = Array.from({ length: 19 }, (_, i) => 100000 + i * 50000);
export const mortgageSlug = (a) => `${a}-mortgage-payment`;

/** Auto-loan amounts: $15k–$60k step $5k (10 values). */
export const AUTO_AMOUNTS = Array.from({ length: 10 }, (_, i) => 15000 + i * 5000);
export const autoSlug = (a) => `${a}-car-loan-payment`;

/** Growth starting amounts (8 values). */
export const GROWTH_AMOUNTS = [1000, 5000, 10000, 20000, 25000, 50000, 100000, 250000];
export const growthSlug = (a) => `how-much-will-${a}-grow-in-20-years`;
