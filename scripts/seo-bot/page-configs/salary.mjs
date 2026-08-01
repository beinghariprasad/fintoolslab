/**
 * salary.mjs — "$X a year is how much an hour" pages.
 * Every number on the page is computed here, deterministically, per amount.
 */
import {
  HOURS_PER_YEAR, WORK_DAYS_PER_YEAR,
  r2, usd, num, pct, pick, neighbors, nearest,
} from './lib.mjs';
import {
  takeHome, STANDARD_DEDUCTION_SINGLE, BLS_MEDIAN_ANNUAL, BLS_MEDIAN_WEEKLY,
  BLS_MEDIAN_SOURCE_LABEL, CONTENT_YEAR, GENERATED_DATE,
} from './tax-2026.mjs';
import { SALARY_AMOUNTS, isSalaryCore, salarySlug, HOURLY_WAGES, hourlySlug } from './sets.mjs';

const WEEK_VARIANTS = [35, 37.5, 40, 45];

function medianSentence(a, seed) {
  const diffPct = ((a - BLS_MEDIAN_ANNUAL) / BLS_MEDIAN_ANNUAL) * 100;
  const rounded = Math.abs(Math.round(diffPct));
  if (Math.abs(diffPct) < 5) {
    return pick([
      `That lands almost exactly on the U.S. median: the Bureau of Labor Statistics puts median weekly earnings for full-time workers at ${usd(BLS_MEDIAN_WEEKLY)} (${BLS_MEDIAN_SOURCE_LABEL}), which annualizes to about ${usd(BLS_MEDIAN_ANNUAL)}.`,
      `By national standards it is a middle-of-the-pack wage — BLS data shows the median full-time worker earned ${usd(BLS_MEDIAN_WEEKLY)} a week in ${BLS_MEDIAN_SOURCE_LABEL.replace('BLS, ', '')}, or roughly ${usd(BLS_MEDIAN_ANNUAL)} a year, within a few percent of this salary.`,
    ], seed);
  }
  if (diffPct > 0) {
    return pick([
      `That puts it about ${rounded}% above the U.S. median. The Bureau of Labor Statistics reports median weekly earnings of ${usd(BLS_MEDIAN_WEEKLY)} for full-time workers (${BLS_MEDIAN_SOURCE_LABEL}) — roughly ${usd(BLS_MEDIAN_ANNUAL)} a year.`,
      `Measured against the typical American paycheck, it is around ${rounded}% higher than the median: BLS pegs median full-time earnings at ${usd(BLS_MEDIAN_WEEKLY)} a week, or about ${usd(BLS_MEDIAN_ANNUAL)} annualized (${BLS_MEDIAN_SOURCE_LABEL}).`,
      `For context, the median full-time U.S. worker earns ${usd(BLS_MEDIAN_WEEKLY)} a week per the BLS (${BLS_MEDIAN_SOURCE_LABEL}) — about ${usd(BLS_MEDIAN_ANNUAL)} a year — so this salary runs roughly ${rounded}% ahead of the middle of the distribution.`,
    ], seed);
  }
  return pick([
    `That sits about ${rounded}% below the U.S. median. The Bureau of Labor Statistics reports median weekly earnings of ${usd(BLS_MEDIAN_WEEKLY)} for full-time workers (${BLS_MEDIAN_SOURCE_LABEL}), which annualizes to roughly ${usd(BLS_MEDIAN_ANNUAL)}.`,
    `Compared with the typical American paycheck it trails the median by around ${rounded}%: BLS puts median full-time earnings at ${usd(BLS_MEDIAN_WEEKLY)} a week — about ${usd(BLS_MEDIAN_ANNUAL)} a year (${BLS_MEDIAN_SOURCE_LABEL}).`,
    `For scale, the median full-time U.S. worker earns ${usd(BLS_MEDIAN_WEEKLY)} weekly per the BLS (${BLS_MEDIAN_SOURCE_LABEL}), roughly ${usd(BLS_MEDIAN_ANNUAL)} a year, so this salary is about ${rounded}% under the midpoint.`,
  ], seed);
}

function buildOne(a) {
  const seed = a / 1000;
  const hourly = r2(a / HOURS_PER_YEAR);
  const daily = r2(a / WORK_DAYS_PER_YEAR);
  const weekly = r2(a / 52);
  const biweekly = r2(a / 26);
  const semiMonthly = r2(a / 24);
  const monthly = r2(a / 12);
  const th = takeHome(a);
  const marginalPct = Math.round(th.marginalRate * 100);
  const effPct = pct(th.effectiveFederalRate * 100, 1);
  const totalWhPct = pct(th.totalWithholdingRate * 100, 1);

  // Counterpart hourly page (nearest wage that has a page)
  const counterpartWage = nearest(HOURLY_WAGES, hourly);
  const showCounterpart = Math.abs(counterpartWage - hourly) <= 1.5;

  const nearbyAmounts = neighbors(SALARY_AMOUNTS, a, 3);
  const nearbyRows = [...nearbyAmounts, a]
    .sort((x, y) => x - y)
    .map((v) => {
      const self = v === a;
      return [
        self
          ? { text: `${usd(v)} a year (this page)`, accent: true }
          : { text: `${usd(v)} a year`, href: `/salary/${salarySlug(v)}` },
        { text: usd(r2(v / HOURS_PER_YEAR), 2) },
        { text: usd(r2(v / 52), 2) },
        { text: usd(takeHome(v).netMonthly, 2) },
      ];
    });

  const p1 = pick([
    `A salary of ${usd(a)} works out to <strong>${usd(hourly, 2)} an hour</strong> on the standard full-time schedule — 40 hours a week for all 52 weeks, or 2,080 paid hours a year. Employers quote pay by the year, but bills arrive by the month, so the number that matters for planning is usually ${usd(monthly, 2)} of gross pay per month.`,
    `Spread ${usd(a)} across the 2,080 working hours in a standard year and you get <strong>${usd(hourly, 2)} per hour</strong>. The same salary reads as ${usd(weekly, 2)} a week, ${usd(biweekly, 2)} every two weeks, or ${usd(monthly, 2)} a month — all before a dollar of tax comes out.`,
    `At 40 hours a week, ${usd(a)} a year is <strong>${usd(hourly, 2)} an hour</strong>. That is the offer-letter number, not the bank-deposit number: gross pay lands at ${usd(biweekly, 2)} per biweekly check, and what actually arrives depends on taxes and benefits withheld.`,
  ], seed);

  const p2 = medianSentence(a, seed) + ' ' + pick([
    `A useful rule of thumb at this level: every extra $1 of hourly pay is worth about ${usd(HOURS_PER_YEAR)} a year at full time, so small raises compound faster than they feel.`,
    `Keep in mind that cost of living moves the goalposts — the same ${usd(a)} stretches very differently in a high-rent metro than in a lower-cost region, even though the hourly math is identical.`,
    `Household context matters too: as a single income supporting a family, ${usd(a)} works harder than the same figure in a two-earner household, even though the per-hour arithmetic never changes.`,
  ], seed + 1);

  const p3 = pick([
    `Start with the ${usd(STANDARD_DEDUCTION_SINGLE)} standard deduction for a single filer in ${CONTENT_YEAR}: it shields the first slice of income, leaving ${usd(th.taxable)} federally taxable. That tops out in the ${marginalPct}% bracket — but the bracket overstates the bite. Total federal income tax comes to ${usd(th.federalTax)}, an effective rate of just ${effPct}, plus ${usd(th.ficaTotal)} in Social Security and Medicare.`,
    `For a single filer in ${CONTENT_YEAR}, the ${usd(STANDARD_DEDUCTION_SINGLE)} standard deduction trims ${usd(a)} of wages down to ${usd(th.taxable)} of taxable income. The last dollar is taxed at ${marginalPct}%, yet the average rate is far gentler: ${usd(th.federalTax)} of federal income tax works out to ${effPct} effective, with another ${usd(th.ficaTotal)} going to FICA payroll taxes.`,
    `Only ${usd(th.taxable)} of this salary is actually taxable federally once the ${CONTENT_YEAR} standard deduction of ${usd(STANDARD_DEDUCTION_SINGLE)} is applied. Federal income tax totals ${usd(th.federalTax)} — a ${effPct} effective rate even though the marginal bracket is ${marginalPct}% — and employee FICA adds ${usd(th.ficaTotal)}.`,
  ], seed);

  const needs = r2(th.netMonthly * 0.5);
  const wants = r2(th.netMonthly * 0.3);
  const save = r2(th.netMonthly * 0.2);
  const p4 = pick([
    `That leaves an estimated ${usd(th.net)} a year of federal take-home — about ${usd(th.netMonthly, 2)} a month, or a total withholding rate of ${totalWhPct} before state tax. Run it through a 50/30/20 budget and the monthly split is roughly ${usd(needs)} for needs, ${usd(wants)} for wants, and ${usd(save)} for saving or debt paydown.`,
    `After those federal deductions, take-home is roughly ${usd(th.net)} a year — ${usd(th.netBiweekly, 2)} per biweekly paycheck. On a 50/30/20 plan that budget supports about ${usd(needs)}/month of essentials, ${usd(wants)}/month of discretionary spending, and ${usd(save)}/month toward savings, before any state income tax.`,
    `Net of federal income tax and FICA, expect about ${usd(th.net)} a year, or ${usd(th.netMonthly, 2)} monthly (${totalWhPct} total federal withholding). Applied to the classic 50/30/20 framework, that funds roughly ${usd(needs)} of needs, ${usd(wants)} of wants, and ${usd(save)} of monthly saving — state taxes, where they apply, come out of this too.`,
  ], seed + 2);

  const sections = [
    {
      type: 'table',
      eyebrow: 'Pay schedule',
      title: `What ${usd(a)} looks like <em>per paycheck</em>.`,
      columns: [
        { label: 'Pay period' },
        { label: 'Gross pay', align: 'r' },
        { label: 'How it is figured', align: 'r' },
      ],
      rows: [
        ['Hourly', { text: usd(hourly, 2), accent: true }, `${usd(a)} ÷ 2,080 hours`],
        ['Daily (8-hour day)', usd(daily, 2), `${usd(a)} ÷ 260 workdays`],
        ['Weekly', usd(weekly, 2), `${usd(a)} ÷ 52 weeks`],
        ['Biweekly', usd(biweekly, 2), `${usd(a)} ÷ 26 pay periods`],
        ['Semi-monthly', usd(semiMonthly, 2), `${usd(a)} ÷ 24 pay periods`],
        ['Monthly', usd(monthly, 2), `${usd(a)} ÷ 12 months`],
        ['Annual', { text: usd(a), strong: true }, 'gross salary'],
      ],
      note: 'All figures are gross (pre-tax). See the take-home table below for the federal-only estimate after taxes.',
    },
    {
      type: 'prose',
      eyebrow: 'Context',
      title: `Where ${usd(a)} stands in ${CONTENT_YEAR}.`,
      paragraphs: [p1, p2],
    },
    {
      type: 'table',
      eyebrow: 'Workweek math',
      title: `The hourly rate depends on <em>your hours</em>.`,
      columns: [
        { label: 'Hours per week' },
        { label: 'Hours per year', align: 'r' },
        { label: 'Hourly rate', align: 'r' },
      ],
      rows: WEEK_VARIANTS.map((w) => {
        const hrs = w * 52;
        const isStd = w === 40;
        return [
          `${num(w, w % 1 ? 1 : 0)} hours${isStd ? ' (standard)' : ''}`,
          num(hrs, w % 1 ? 0 : 0),
          { text: usd(r2(a / hrs), 2), accent: isStd },
        ];
      }),
      note: `Salaried roles rarely pay overtime — at 45 hours a week the same ${usd(a)} effectively pays ${usd(r2(a / (45 * 52)), 2)} per hour worked.`,
    },
    {
      type: 'table',
      eyebrow: 'Federal-only estimate',
      title: `From ${usd(a)} gross to <em>take-home</em>.`,
      columns: [
        { label: 'Line item' },
        { label: 'Amount', align: 'r' },
      ],
      rows: [
        ['Gross annual salary', usd(a, 2)],
        [`Standard deduction (single, ${CONTENT_YEAR})`, `−${usd(STANDARD_DEDUCTION_SINGLE, 2)}`],
        ['Federally taxable income', usd(th.taxable, 2)],
        [`Federal income tax (effective ${effPct})`, `−${usd(th.federalTax, 2)}`],
        ['Social Security (6.2%)', `−${usd(th.socialSecurity, 2)}`],
        ['Medicare (1.45%)', `−${usd(th.medicare, 2)}`],
        ['Estimated annual take-home', { text: usd(th.net, 2), accent: true, strong: true }],
        ['≈ Monthly take-home', usd(th.netMonthly, 2)],
        ['≈ Biweekly take-home', usd(th.netBiweekly, 2)],
      ],
      note: 'Single filer, standard deduction, no state/local income tax, no credits or pre-tax benefits. Your actual paycheck will differ.',
    },
    {
      type: 'prose',
      eyebrow: 'Taxes',
      title: `Why the ${marginalPct}% bracket doesn't mean <em>${marginalPct}% tax</em>.`,
      paragraphs: [p3, p4],
    },
    {
      type: 'table',
      eyebrow: 'Compare',
      title: 'How nearby salaries <em>stack up</em>.',
      columns: [
        { label: 'Annual salary' },
        { label: 'Hourly (40 hrs)', align: 'r' },
        { label: 'Weekly', align: 'r' },
        { label: 'Est. monthly take-home', align: 'r' },
      ],
      rows: nearbyRows,
      note: 'Take-home column is the same federal-only, single-filer estimate used above.',
    },
  ];

  const faq = [
    {
      q: `How much is ${usd(a)} a year per hour?`,
      a: `${usd(a)} a year is ${usd(hourly, 2)} an hour at 40 hours a week (2,080 hours a year). At 37.5 hours a week it rises to ${usd(r2(a / 1950), 2)} an hour, and if you actually work 45-hour weeks it averages ${usd(r2(a / 2340), 2)} per hour worked.`,
    },
    {
      q: `How much is ${usd(a)} a year biweekly?`,
      a: `Gross biweekly pay on ${usd(a)} is ${usd(biweekly, 2)} (${usd(a)} ÷ 26 pay periods). After estimated federal income tax and FICA for a single filer, roughly ${usd(th.netBiweekly, 2)} per check remains — before state taxes and benefits.`,
    },
    {
      q: `How much is ${usd(a)} a year after taxes?`,
      a: `Using ${CONTENT_YEAR} federal brackets and the ${usd(STANDARD_DEDUCTION_SINGLE)} standard deduction, a single filer earning ${usd(a)} pays about ${usd(th.federalTax)} in federal income tax and ${usd(th.ficaTotal)} in FICA, keeping roughly ${usd(th.net)} a year (${usd(th.netMonthly, 2)} a month). This is a federal-only estimate — state and local taxes reduce it further.`,
    },
    {
      q: `Is ${usd(a)} a good salary in ${CONTENT_YEAR}?`,
      a: (() => {
        const diffPct = ((a - BLS_MEDIAN_ANNUAL) / BLS_MEDIAN_ANNUAL) * 100;
        const rel = Math.abs(diffPct) < 5
          ? `is right around the U.S. median full-time salary of about ${usd(BLS_MEDIAN_ANNUAL)}`
          : diffPct > 0
            ? `is about ${Math.abs(Math.round(diffPct))}% above the U.S. median full-time salary of roughly ${usd(BLS_MEDIAN_ANNUAL)}`
            : `is about ${Math.abs(Math.round(diffPct))}% below the U.S. median full-time salary of roughly ${usd(BLS_MEDIAN_ANNUAL)}`;
        return `${usd(a)} ${rel} (${BLS_MEDIAN_SOURCE_LABEL}: ${usd(BLS_MEDIAN_WEEKLY)}/week). Whether it is "good" depends heavily on your metro's cost of living, household size, and debt load — the same salary goes much further in a low-cost region than in an expensive coastal city.`;
      })(),
    },
    {
      q: `What tax bracket is ${usd(a)} in for ${CONTENT_YEAR}?`,
      a: `After the ${usd(STANDARD_DEDUCTION_SINGLE)} standard deduction, ${usd(a)} leaves ${usd(th.taxable)} of taxable income, which puts a single filer in the ${marginalPct}% marginal bracket for ${CONTENT_YEAR}. Only income above each threshold is taxed at the higher rate, so the effective federal rate is just ${effPct}.`,
    },
  ];

  const related = [];
  if (showCounterpart) {
    related.push({
      name: `${usd(counterpartWage)}/hour → yearly`,
      desc: `Flip the math: what ${usd(counterpartWage)} an hour earns per year, with overtime tables.`,
      mark: 'HR',
      href: `/salary/${hourlySlug(counterpartWage)}`,
      cat: 'Salary',
      time: '1 min read',
    });
  }
  related.push(
    { name: 'Savings Calculator', desc: 'See what saving a slice of this paycheck grows into.', mark: 'SV', href: '/calculators/savings', cat: 'Savings', time: '30 sec' },
    { name: 'Compound Interest', desc: 'How invested savings compound over the years.', mark: 'CI', href: '/calculators/compound-interest', cat: 'Savings', time: '30 sec' },
    { name: 'Retirement Calculator', desc: `Project what this income can fund by retirement.`, mark: 'RT', href: '/calculators/retirement', cat: 'Retirement', time: '1 min' },
  );

  return {
    slug: salarySlug(a),
    path: `/salary/${salarySlug(a)}`,
    category: 'salary',
    core: isSalaryCore(a),
    sortKey: a,
    title: `$${num(a)} a Year Is How Much an Hour? (${CONTENT_YEAR})`,
    metaDescription: `${usd(a)} a year is ${usd(hourly, 2)}/hour at 40 hrs/week — ${usd(weekly, 2)} weekly, ${usd(monthly)} monthly. Full ${CONTENT_YEAR} breakdown with a federal take-home estimate.`,
    payload: {
      hero: {
        chip: `Salary breakdown · ${CONTENT_YEAR} figures`,
        titleBefore: `${usd(a)} a year is `,
        titleEm: `${usd(hourly, 2)} an hour`,
        titleAfter: '.',
        lede: `Based on a 40-hour week worked 52 weeks a year (2,080 hours). Below: every pay-period equivalent, the rate at other workweeks, a ${CONTENT_YEAR} federal take-home estimate, and how ${usd(a)} compares with the U.S. median.`,
        meta: [
          { label: 'Basis', value: '2,080 hours/year' },
          { label: 'Updated', value: `August ${CONTENT_YEAR}` },
        ],
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'Calculators', href: '/calculators' },
          { label: `${usd(a)} a year` },
        ],
        example: {
          prefix: '$',
          amount: num(hourly, 2),
          label: `Per hour · ${usd(a)} ÷ 2,080 working hours`,
          features: [
            `${usd(weekly, 2)} per week`,
            `${usd(biweekly, 2)} per biweekly check`,
            `${usd(monthly, 2)} per month`,
            `≈ ${usd(th.netMonthly, 2)}/mo after est. federal tax`,
          ],
        },
      },
      shortAnswer: {
        heading: `How much is ${usd(a)} a year per hour?`,
        html: `<strong>${usd(a)} a year is ${usd(hourly, 2)} an hour</strong> at 40 hours a week, 52 weeks a year (2,080 hours). That's ${usd(daily, 2)} a day, ${usd(weekly, 2)} a week, ${usd(biweekly, 2)} biweekly, and ${usd(monthly, 2)} a month — all gross. After estimated federal income tax and FICA, a single filer keeps about ${usd(th.net)} a year, roughly ${usd(th.netMonthly)} a month.`,
      },
      sections,
      faq,
      cta: {
        label: 'Put the paycheck to work',
        title: 'Turn this salary into a savings plan',
        text: `Even ${usd(save)} a month — the 20% slice of the take-home estimate above — compounds into serious money over a decade. Model it with real numbers.`,
        links: [
          { label: 'Savings Calculator', href: '/calculators/savings' },
          { label: 'Compound Interest Calculator', href: '/calculators/compound-interest' },
        ],
      },
      related,
      methodology: [
        `Conversions are straight arithmetic on gross salary: ${usd(a)} ÷ 2,080 hours (40 × 52) for hourly, ÷ 260 workdays for daily, ÷ 52, 26, 24 and 12 for the pay-period figures. No taxes are applied to those rows.`,
        `The take-home estimate uses ${CONTENT_YEAR} federal brackets for a single filer with the ${usd(STANDARD_DEDUCTION_SINGLE)} standard deduction, plus employee FICA (6.2% Social Security + 1.45% Medicare). It excludes state/local income tax, credits, and pre-tax benefits such as 401(k) or health premiums — so real paychecks will differ.`,
        `The median comparison uses BLS median usual weekly earnings for full-time wage and salary workers: ${usd(BLS_MEDIAN_WEEKLY)}/week (${BLS_MEDIAN_SOURCE_LABEL}).`,
        'Educational estimates only — not tax, legal, or financial advice.',
      ],
      dateModified: GENERATED_DATE,
    },
  };
}

export function buildSalaryPages() {
  return SALARY_AMOUNTS.map(buildOne);
}
