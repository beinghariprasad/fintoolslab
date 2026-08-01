/**
 * mortgage.mjs — "$X mortgage payment" pages.
 * Rates 5.0–7.5% × 15/30-year terms, first-year amortization at a
 * representative 6.5%/30yr, income-needed (28% rule), PMI context.
 */
import {
  r2, usd, num, pct, pick, neighbors, pmt, totalInterest, amortizationRows,
} from './lib.mjs';
import { CONTENT_YEAR, GENERATED_DATE } from './tax-2026.mjs';
import { MORTGAGE_AMOUNTS, mortgageSlug } from './sets.mjs';

const RATES = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5];
const REP_RATE = 6.5; // representative rate for headline + amortization
const TERMS = [
  { years: 15, months: 180 },
  { years: 30, months: 360 },
];

function incomeNeeded(monthlyPI) {
  // 28% front-end rule on P&I only
  return r2((monthlyPI / 0.28) * 12);
}

function buildOne(m) {
  const seed = m / 50000;
  const rep30 = pmt(m, REP_RATE, 360);
  const rep15 = pmt(m, REP_RATE, 180);
  const rep30Interest = totalInterest(m, REP_RATE, 360);
  const rep15Interest = totalInterest(m, REP_RATE, 180);
  const income = incomeNeeded(rep30);
  const amort = amortizationRows(m, REP_RATE, 360, 12);
  const yr1Interest = r2(amort.reduce((s, r) => s + r.interest, 0));
  const yr1Principal = r2(amort.reduce((s, r) => s + r.principal, 0));
  const p30lo = pmt(m, RATES[0], 360);
  const p30hi = pmt(m, RATES[RATES.length - 1], 360);
  const sensitivity = r2(pmt(m, 7.0, 360) - pmt(m, 6.0, 360));
  const pmiLo = r2((m * 0.005) / 12);
  const pmiHi = r2((m * 0.01) / 12);
  const price20 = r2(m / 0.8);

  const nearby = neighbors(MORTGAGE_AMOUNTS, m, 3);
  const nearbyRows = [...nearby, m]
    .sort((x, y) => x - y)
    .map((v) => {
      const self = v === m;
      const v30 = pmt(v, REP_RATE, 360);
      return [
        self
          ? { text: `${usd(v)} loan (this page)`, accent: true }
          : { text: `${usd(v)} loan`, href: `/mortgage/${mortgageSlug(v)}` },
        { text: usd(v30, 2) },
        { text: usd(pmt(v, REP_RATE, 180), 2) },
        { text: usd(incomeNeeded(v30)) },
      ];
    });

  const p1 = pick([
    `A ${usd(m)} mortgage at ${pct(REP_RATE)} over 30 years costs <strong>${usd(rep30, 2)} a month</strong> in principal and interest. The same loan on a 15-year term jumps to ${usd(rep15, 2)} monthly — but slashes lifetime interest from ${usd(rep30Interest)} to ${usd(rep15Interest)}, a saving of ${usd(r2(rep30Interest - rep15Interest))}.`,
    `Borrow ${usd(m)} at ${pct(REP_RATE)} for 30 years and the principal-and-interest payment is <strong>${usd(rep30, 2)} per month</strong>. Choose 15 years instead and you pay ${usd(rep15, 2)} monthly, yet total interest falls from ${usd(rep30Interest)} to ${usd(rep15Interest)} — the shorter term keeps ${usd(r2(rep30Interest - rep15Interest))} in your pocket.`,
    `At today's representative ${pct(REP_RATE)} rate, ${usd(m)} of mortgage debt runs <strong>${usd(rep30, 2)} a month</strong> on a 30-year term, or ${usd(rep15, 2)} on a 15-year. Over the full term that's ${usd(rep30Interest)} of interest versus ${usd(rep15Interest)} — a ${usd(r2(rep30Interest - rep15Interest))} difference for the faster payoff.`,
  ], seed);

  const p2 = pick([
    `Rates move the payment more than most buyers expect: on ${usd(m)}, going from 6.0% to 7.0% adds ${usd(sensitivity, 2)} a month on a 30-year term — ${usd(r2(sensitivity * 360))} over the life of the loan. Across the ${pct(RATES[0])}–${pct(RATES[RATES.length - 1])} range in the table above, the 30-year payment spans ${usd(p30lo, 2)} to ${usd(p30hi, 2)}.`,
    `A single percentage point matters enormously at this size: 6.0% versus 7.0% on a 30-year ${usd(m)} loan is ${usd(sensitivity, 2)} more every month, or about ${usd(r2(sensitivity * 360))} over 360 payments. That's why the payment table spans ${usd(p30lo, 2)} (at ${pct(RATES[0])}) to ${usd(p30hi, 2)} (at ${pct(RATES[RATES.length - 1])}).`,
  ], seed);

  const p3 = pick([
    `If your down payment is under 20% of the purchase price, expect private mortgage insurance on top: typically 0.5–1% of the loan per year, or roughly ${usd(pmiLo)}–${usd(pmiHi)} a month on ${usd(m)}. With 20% down, a ${usd(m)} loan corresponds to about a ${usd(price20)} home — and no PMI. Property taxes and homeowners insurance also come on top of every figure here.`,
    `Remember that these are principal-and-interest numbers only. Put down less than 20% and PMI adds roughly ${usd(pmiLo)}–${usd(pmiHi)} monthly (0.5–1% of ${usd(m)} per year) until you reach 20% equity. Property tax and insurance frequently add several hundred dollars more — a ${usd(m)} loan with 20% down implies a purchase price near ${usd(price20)}.`,
  ], seed + 1);

  const p4 = pick([
    `How much income does it take? The common 28% front-end rule says housing costs shouldn't exceed 28% of gross income. On the ${usd(rep30, 2)} payment at ${pct(REP_RATE)}/30-year, that implies roughly ${usd(income)} of annual income — and more once taxes, insurance, and any PMI join the payment.`,
    `Lenders often screen affordability with the 28% rule: housing below 28% of gross income. Covering ${usd(rep30, 2)} a month of P&I under that rule takes about ${usd(income)} a year of income. Because taxes and insurance stack on top, real qualifying incomes run higher.`,
  ], seed);

  const sections = [
    {
      type: 'table',
      eyebrow: 'Monthly payment',
      title: `${usd(m)} mortgage payment <em>by rate and term</em>.`,
      columns: [
        { label: 'Interest rate' },
        { label: '15-year P&I', align: 'r' },
        { label: '30-year P&I', align: 'r' },
        { label: 'Difference / mo', align: 'r' },
      ],
      rows: RATES.map((r) => {
        const p15 = pmt(m, r, 180);
        const p30 = pmt(m, r, 360);
        const isRep = r === REP_RATE;
        return [
          `${pct(r)}${isRep ? ' (used below)' : ''}`,
          usd(p15, 2),
          { text: usd(p30, 2), accent: isRep },
          usd(r2(p15 - p30), 2),
        ];
      }),
      note: 'Principal and interest only — add property taxes, homeowners insurance, and PMI (if under 20% down) for the full monthly cost.',
    },
    {
      type: 'prose',
      eyebrow: 'The headline numbers',
      title: `What ${usd(m)} of mortgage debt really costs.`,
      paragraphs: [p1, p2],
    },
    {
      type: 'table',
      eyebrow: 'Lifetime cost',
      title: `Total interest on ${usd(m)} <em>over the full term</em>.`,
      columns: [
        { label: 'Interest rate' },
        { label: '15-yr total interest', align: 'r' },
        { label: '30-yr total interest', align: 'r' },
        { label: '30-yr total repaid', align: 'r' },
      ],
      rows: RATES.map((r) => {
        const i15 = totalInterest(m, r, 180);
        const i30 = totalInterest(m, r, 360);
        return [
          pct(r),
          usd(i15),
          { text: usd(i30), accent: r === REP_RATE },
          usd(r2(m + i30)),
        ];
      }),
      note: `At ${pct(REP_RATE)} on a 30-year term you repay ${usd(r2(m + rep30Interest))} in total — ${num(r2((m + rep30Interest) / m), 2)}× the amount borrowed.`,
    },
    {
      type: 'table',
      eyebrow: `Year one · ${pct(REP_RATE)}, 30-year`,
      title: `First-year amortization: where each payment <em>actually goes</em>.`,
      columns: [
        { label: 'Month' },
        { label: 'Payment', align: 'r' },
        { label: 'Interest', align: 'r' },
        { label: 'Principal', align: 'r' },
        { label: 'Balance', align: 'r' },
      ],
      rows: amort.map((row) => [
        `M${String(row.month).padStart(2, '0')}`,
        usd(row.payment, 2),
        { text: usd(row.interest, 2), accent: true },
        usd(row.principal, 2),
        usd(row.balance, 2),
      ]),
      note: `In year one you pay ${usd(yr1Interest)} of interest but only ${usd(yr1Principal)} of principal — early payments are mostly interest, which is why extra principal payments early on save so much.`,
    },
    {
      type: 'prose',
      eyebrow: 'Beyond P&I',
      title: `PMI, income needed, and the <em>rest of the bill</em>.`,
      paragraphs: [p3, p4],
    },
    {
      type: 'table',
      eyebrow: 'Compare',
      title: `Nearby loan amounts at ${pct(REP_RATE)}.`,
      columns: [
        { label: 'Loan amount' },
        { label: '30-yr P&I', align: 'r' },
        { label: '15-yr P&I', align: 'r' },
        { label: 'Income needed (28% rule)', align: 'r' },
      ],
      rows: nearbyRows,
      note: 'Income column applies the 28% front-end rule to the 30-year P&I payment only; taxes and insurance push the real requirement higher.',
    },
  ];

  const faq = [
    {
      q: `What is the monthly payment on a ${usd(m)} mortgage?`,
      a: `At ${pct(REP_RATE)} on a 30-year fixed, a ${usd(m)} mortgage costs ${usd(rep30, 2)} a month in principal and interest. Across rates from ${pct(RATES[0])} to ${pct(RATES[RATES.length - 1])}, the 30-year payment ranges from ${usd(p30lo, 2)} to ${usd(p30hi, 2)}. Property taxes, insurance, and PMI come on top.`,
    },
    {
      q: `How much income do I need for a ${usd(m)} mortgage?`,
      a: `Using the 28% front-end rule on the ${usd(rep30, 2)} payment (${pct(REP_RATE)}, 30-year), you'd want roughly ${usd(income)} of gross annual income for the principal and interest alone. Since lenders count taxes, insurance, PMI, and your other debts too, a comfortable qualifying income is typically higher.`,
    },
    {
      q: `How much interest will I pay on a ${usd(m)} mortgage?`,
      a: `At ${pct(REP_RATE)}, total interest comes to ${usd(rep30Interest)} over a 30-year term versus ${usd(rep15Interest)} over 15 years — the shorter term saves ${usd(r2(rep30Interest - rep15Interest))}. In the first year alone the 30-year loan accrues ${usd(yr1Interest)} of interest against just ${usd(yr1Principal)} of principal reduction.`,
    },
    {
      q: `Is a 15-year or 30-year term better for a ${usd(m)} loan?`,
      a: `The 30-year payment (${usd(rep30, 2)} at ${pct(REP_RATE)}) is ${usd(r2(rep15 - rep30), 2)} cheaper per month than the 15-year (${usd(rep15, 2)}), but costs ${usd(r2(rep30Interest - rep15Interest))} more in lifetime interest. Choose 15 years if the payment fits comfortably; otherwise take the 30-year and make extra principal payments when you can.`,
    },
    {
      q: `Does the ${usd(m)} payment include taxes and insurance?`,
      a: `No — every figure on this page is principal and interest only. Budget extra for property tax and homeowners insurance (often several hundred dollars monthly, varying by state), plus PMI of roughly ${usd(pmiLo)}–${usd(pmiHi)}/month if your down payment is under 20%. With 20% down, ${usd(m)} of financing corresponds to about a ${usd(price20)} purchase price.`,
    },
  ];

  return {
    slug: mortgageSlug(m),
    path: `/mortgage/${mortgageSlug(m)}`,
    category: 'mortgage',
    core: true,
    sortKey: m,
    title: `$${num(m)} Mortgage Payment by Rate & Term (${CONTENT_YEAR})`,
    metaDescription: `A ${usd(m)} mortgage costs ${usd(rep30, 2)}/mo at ${pct(REP_RATE)} over 30 years (${usd(rep15, 2)} on 15). See payments at 5–7.5%, total interest, and the income needed.`,
    payload: {
      hero: {
        chip: `Mortgage · ${CONTENT_YEAR} rate table`,
        titleBefore: `The ${usd(m)} mortgage `,
        titleEm: 'payment',
        titleAfter: ', at every rate.',
        lede: `Principal-and-interest payments on a ${usd(m)} home loan across ${pct(RATES[0])}–${pct(RATES[RATES.length - 1])} rates and 15/30-year terms, plus total interest, a first-year amortization schedule, and the income the 28% rule implies.`,
        meta: [
          { label: 'Rates shown', value: `${pct(RATES[0])}–${pct(RATES[RATES.length - 1])}` },
          { label: 'Updated', value: `August ${CONTENT_YEAR}` },
        ],
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'Mortgage Calculator', href: '/calculators/mortgage' },
          { label: `${usd(m)} mortgage` },
        ],
        example: {
          prefix: '$',
          amount: num(rep30, 2),
          label: `Monthly P&I · ${usd(m)} at ${pct(REP_RATE)}, 30-year fixed`,
          features: [
            `${usd(rep15, 2)}/mo on a 15-year term`,
            `${usd(rep30Interest)} total interest over 30 yrs`,
            `≈ ${usd(income)} income under the 28% rule`,
            'Taxes, insurance & PMI not included',
          ],
        },
      },
      shortAnswer: {
        heading: `What does a ${usd(m)} mortgage cost per month?`,
        html: `<strong>A ${usd(m)} mortgage costs about ${usd(rep30, 2)} a month</strong> in principal and interest at ${pct(REP_RATE)} on a 30-year fixed term, or ${usd(rep15, 2)} on a 15-year. Depending on your rate (${pct(RATES[0])}–${pct(RATES[RATES.length - 1])}), the 30-year payment runs ${usd(p30lo, 2)}–${usd(p30hi, 2)}. Total 30-year interest at ${pct(REP_RATE)}: ${usd(rep30Interest)}.`,
      },
      sections,
      faq,
      cta: {
        label: 'Your exact numbers',
        title: 'Model your own rate, down payment, and term',
        text: `These tables use fixed rate steps. The interactive mortgage calculator handles any rate, adds PMI, property tax, and insurance, and builds the full ${num(360)}-payment amortization schedule.`,
        links: [
          { label: 'Mortgage Calculator', href: '/calculators/mortgage' },
          { label: 'Rent vs. Buy Calculator', href: '/calculators/rent-vs-buy' },
        ],
      },
      related: [
        { name: 'Mortgage Calculator', desc: 'Full PITI payment with PMI, taxes, and amortization.', mark: 'MG', href: '/calculators/mortgage', cat: 'Borrowing', time: '1 min' },
        { name: 'Rent vs. Buy', desc: 'Compare the true 10-year cost of renting against buying.', mark: 'RB', href: '/calculators/rent-vs-buy', cat: 'Real estate', time: '2 min' },
        { name: 'Loan Calculator', desc: 'Payments and amortization for any fixed-rate loan.', mark: 'LN', href: '/calculators/loan', cat: 'Borrowing', time: '30 sec' },
        { name: 'Compound Interest', desc: 'What the money you save on interest could earn instead.', mark: 'CI', href: '/calculators/compound-interest', cat: 'Savings', time: '30 sec' },
      ],
      methodology: [
        `Payments use the standard amortization formula M = P·r(1+r)ⁿ / ((1+r)ⁿ − 1) with monthly compounding, on a ${usd(m)} principal. Rates shown (${pct(RATES[0])}–${pct(RATES[RATES.length - 1])}) are illustrative steps, not quotes — your rate depends on credit, points, and the market.`,
        `The amortization table applies ${pct(REP_RATE)}/30-year, computing interest on the running balance each month and rounding to cents, the way a servicer statement does.`,
        'All figures are principal and interest only. Property tax, homeowners insurance, HOA dues, and PMI are excluded except where explicitly estimated (PMI shown at 0.5–1% of the loan per year).',
        'Income-needed figures apply the 28% front-end ratio to P&I only. Educational estimates — not lending, tax, or financial advice.',
      ],
      dateModified: GENERATED_DATE,
    },
  };
}

export function buildMortgagePages() {
  return MORTGAGE_AMOUNTS.map(buildOne);
}
