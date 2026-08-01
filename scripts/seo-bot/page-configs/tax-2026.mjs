/**
 * tax-2026.mjs — THE single source of truth for every tax/benchmark constant
 * used by the programmatic page generator.
 *
 * ============================ IMPORTANT ============================
 * FEDERAL-ONLY ESTIMATES. These figures cover federal income tax and
 * FICA payroll tax for a SINGLE filer taking the STANDARD DEDUCTION,
 * with no credits, no pre-tax benefits (401k/HSA/insurance), and no
 * state or local income tax. They are educational estimates, not tax
 * advice. Every page that uses them must carry a methodology block
 * saying exactly that.
 * ===================================================================
 *
 * Sources (verified 2026-08-01 via live web search):
 * - 2026 single-filer brackets & standard deduction: IRS newsroom,
 *   "IRS releases tax inflation adjustments for tax year 2026, including
 *   amendments from the One, Big, Beautiful Bill"
 *   (irs.gov/newsroom/...tax-year-2026...) and Tax Foundation
 *   (taxfoundation.org/data/all/federal/2026-tax-brackets/).
 * - Median weekly earnings: BLS "Usual Weekly Earnings of Wage and Salary
 *   Workers", Q2 2026 news release (bls.gov/news.release/wkyeng.nr0.htm):
 *   $1,251/week median for full-time wage and salary workers.
 */

export const TAX_YEAR = 2026;

/** 2026 standard deduction, single filer (USD). */
export const STANDARD_DEDUCTION_SINGLE = 16100;

/**
 * 2026 federal income tax brackets, single filer.
 * `upTo` is the top of the bracket in TAXABLE income (after deductions).
 */
export const BRACKETS_SINGLE = [
  { rate: 0.10, upTo: 12400 },
  { rate: 0.12, upTo: 50400 },
  { rate: 0.22, upTo: 105700 },
  { rate: 0.24, upTo: 201775 },
  { rate: 0.32, upTo: 256225 },
  { rate: 0.35, upTo: 640600 },
  { rate: 0.37, upTo: Infinity },
];

/** Employee-side FICA. SS wage base does not bind for any generated page (all gross < base). */
export const SOCIAL_SECURITY_RATE = 0.062;
export const SOCIAL_SECURITY_WAGE_BASE_2026 = 184500;
export const MEDICARE_RATE = 0.0145;

/** BLS median usual weekly earnings, full-time wage & salary workers, Q2 2026. */
export const BLS_MEDIAN_WEEKLY = 1251;
export const BLS_MEDIAN_ANNUAL = BLS_MEDIAN_WEEKLY * 52; // $65,052
export const BLS_MEDIAN_SOURCE_LABEL = 'BLS, Q2 2026';

/** Fixed content date so output is fully deterministic (never use Date.now()). */
export const GENERATED_DATE = '2026-08-01';
export const CONTENT_YEAR = 2026;

const r2 = (n) => Math.round(n * 100) / 100;

/**
 * Federal income tax for a single filer on gross wages, 2026.
 * Returns dollars rounded to cents plus bracket metadata.
 */
export function federalTax(gross) {
  const taxable = Math.max(0, gross - STANDARD_DEDUCTION_SINGLE);
  let tax = 0;
  let prevTop = 0;
  let marginalRate = BRACKETS_SINGLE[0].rate;
  for (const b of BRACKETS_SINGLE) {
    if (taxable > prevTop) {
      const inBracket = Math.min(taxable, b.upTo) - prevTop;
      tax += inBracket * b.rate;
      marginalRate = b.rate;
    }
    prevTop = b.upTo;
  }
  tax = r2(tax);
  return {
    taxable: r2(taxable),
    tax,
    marginalRate,
    effectiveRate: gross > 0 ? tax / gross : 0,
  };
}

/** Employee FICA (Social Security + Medicare) on gross wages. */
export function fica(gross) {
  const ss = r2(Math.min(gross, SOCIAL_SECURITY_WAGE_BASE_2026) * SOCIAL_SECURITY_RATE);
  const medicare = r2(gross * MEDICARE_RATE);
  return { ss, medicare, total: r2(ss + medicare) };
}

/**
 * Full federal-only take-home picture for a single filer.
 * net = gross − federal income tax − FICA. No state/local tax, no credits.
 */
export function takeHome(gross) {
  const fed = federalTax(gross);
  const f = fica(gross);
  const net = r2(gross - fed.tax - f.total);
  return {
    gross,
    standardDeduction: STANDARD_DEDUCTION_SINGLE,
    taxable: fed.taxable,
    federalTax: fed.tax,
    marginalRate: fed.marginalRate,
    effectiveFederalRate: fed.effectiveRate,
    socialSecurity: f.ss,
    medicare: f.medicare,
    ficaTotal: f.total,
    net,
    netMonthly: r2(net / 12),
    netBiweekly: r2(net / 26),
    netWeekly: r2(net / 52),
    totalWithholdingRate: gross > 0 ? (fed.tax + f.total) / gross : 0,
  };
}
