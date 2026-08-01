/**
 * hourly.mjs — "$X an hour is how much a year" pages.
 */
import {
  HOURS_PER_YEAR, r2, usd, num, pct, pick, neighbors, nearest,
} from './lib.mjs';
import {
  takeHome, STANDARD_DEDUCTION_SINGLE, BLS_MEDIAN_ANNUAL, BLS_MEDIAN_WEEKLY,
  BLS_MEDIAN_SOURCE_LABEL, CONTENT_YEAR, GENERATED_DATE,
} from './tax-2026.mjs';
import { HOURLY_WAGES, isHourlyCore, hourlySlug, SALARY_AMOUNTS, salarySlug } from './sets.mjs';

const OT_WEEKS = [45, 50, 55];

function otWeekly(w, hours) {
  return r2(40 * w + (hours - 40) * 1.5 * w);
}

function buildOne(w) {
  const seed = w;
  const annual = r2(w * HOURS_PER_YEAR);
  const monthly = r2(annual / 12);
  const biweekly = r2(w * 80);
  const weekly = r2(w * 40);
  const daily = r2(w * 8);
  const partTime30 = r2(w * 30 * 52);
  const th = takeHome(annual);
  const marginalPct = Math.round(th.marginalRate * 100);
  const effPct = pct(th.effectiveFederalRate * 100, 1);
  const medianHourly = r2(BLS_MEDIAN_WEEKLY / 40);

  const counterpartSalary = nearest(SALARY_AMOUNTS, annual);
  const showCounterpart = Math.abs(counterpartSalary - annual) <= 2500;

  const nearbyWages = neighbors(HOURLY_WAGES, w, 3);
  const nearbyRows = [...nearbyWages, w]
    .sort((x, y) => x - y)
    .map((v) => {
      const self = v === w;
      const vAnnual = r2(v * HOURS_PER_YEAR);
      return [
        self
          ? { text: `${usd(v)}/hour (this page)`, accent: true }
          : { text: `${usd(v)}/hour`, href: `/salary/${hourlySlug(v)}` },
        { text: usd(vAnnual) },
        { text: usd(r2(vAnnual / 12), 2) },
        { text: usd(takeHome(vAnnual).netMonthly, 2) },
      ];
    });

  const diffPct = ((annual - BLS_MEDIAN_ANNUAL) / BLS_MEDIAN_ANNUAL) * 100;
  const relMedian = Math.abs(diffPct) < 5
    ? `right around the U.S. median full-time wage`
    : diffPct > 0
      ? `about ${Math.abs(Math.round(diffPct))}% above the U.S. median full-time wage`
      : `about ${Math.abs(Math.round(diffPct))}% below the U.S. median full-time wage`;

  const p1 = pick([
    `At ${usd(w)} an hour, a full-time year — 40 hours a week for 52 weeks, with no unpaid time off — grosses <strong>${usd(annual)}</strong>. That's ${usd(weekly, 2)} a week, ${usd(biweekly, 2)} per biweekly paycheck, and about ${usd(monthly, 2)} a month before taxes.`,
    `Multiply ${usd(w)} by the 2,080 hours in a standard working year and you get <strong>${usd(annual)}</strong> of gross annual pay. Per pay period that reads as ${usd(daily, 2)} a day, ${usd(weekly, 2)} a week, or ${usd(biweekly, 2)} every two weeks.`,
    `A ${usd(w)}/hour wage annualizes to <strong>${usd(annual)}</strong> at full time (${usd(w)} × 2,080 hours). Hourly workers rarely see exactly that: unpaid days off pull it down, while overtime — paid at time-and-a-half — pushes it up fast.`,
  ], seed);

  const p2 = pick([
    `That annual figure lands ${relMedian}: BLS median weekly earnings are ${usd(BLS_MEDIAN_WEEKLY)} (${BLS_MEDIAN_SOURCE_LABEL}), which is roughly ${usd(medianHourly, 2)} an hour at 40 hours. Unlike most salaried roles, hourly jobs are usually overtime-eligible — see the table below for what that's worth.`,
    `Measured against the middle of the U.S. labor market, ${usd(w)}/hour is ${relMedian} — the BLS median works out to about ${usd(medianHourly, 2)}/hour (${usd(BLS_MEDIAN_WEEKLY)}/week, ${BLS_MEDIAN_SOURCE_LABEL}). The big lever for hourly earners is overtime: every OT hour pays ${usd(r2(w * 1.5), 2)} at time-and-a-half.`,
    `For context, the median full-time U.S. worker earns about ${usd(medianHourly, 2)}/hour (${usd(BLS_MEDIAN_WEEKLY)}/week per ${BLS_MEDIAN_SOURCE_LABEL}), putting ${usd(w)}/hour ${relMedian}. And because hourly roles are typically non-exempt, each overtime hour adds ${usd(r2(w * 1.5), 2)} — 50% more than the base rate.`,
  ], seed + 1);

  const p3 = pick([
    `On the tax side, ${usd(annual)} of wages minus the ${usd(STANDARD_DEDUCTION_SINGLE)} standard deduction leaves ${usd(th.taxable)} taxable, landing in the ${marginalPct}% bracket for a single filer in ${CONTENT_YEAR}. Actual federal income tax is ${usd(th.federalTax)} — an effective ${effPct} — plus ${usd(th.ficaTotal)} of FICA, for an estimated take-home of ${usd(th.net)} a year (${usd(th.netMonthly, 2)}/month).`,
    `After the ${CONTENT_YEAR} standard deduction of ${usd(STANDARD_DEDUCTION_SINGLE)}, a single filer earning ${usd(annual)} owes about ${usd(th.federalTax)} in federal income tax (effective rate ${effPct}, marginal bracket ${marginalPct}%) and ${usd(th.ficaTotal)} in Social Security and Medicare. That leaves roughly ${usd(th.net)} — about ${usd(th.netBiweekly, 2)} per biweekly check — before any state income tax.`,
    `Federally, this wage puts a single filer in the ${marginalPct}% marginal bracket for ${CONTENT_YEAR}: ${usd(annual)} gross less the ${usd(STANDARD_DEDUCTION_SINGLE)} standard deduction is ${usd(th.taxable)} taxable, generating ${usd(th.federalTax)} of income tax (${effPct} effective). Add ${usd(th.ficaTotal)} of FICA and estimated take-home is ${usd(th.net)}/year, or ${usd(th.netMonthly, 2)}/month.`,
  ], seed + 2);

  const sections = [
    {
      type: 'table',
      eyebrow: 'Pay schedule',
      title: `What ${usd(w)}/hour adds up to <em>per period</em>.`,
      columns: [
        { label: 'Pay period' },
        { label: 'Gross pay', align: 'r' },
        { label: 'How it is figured', align: 'r' },
      ],
      rows: [
        ['Daily (8 hours)', usd(daily, 2), `${usd(w)} × 8`],
        ['Weekly (40 hours)', usd(weekly, 2), `${usd(w)} × 40`],
        ['Biweekly (80 hours)', usd(biweekly, 2), `${usd(w)} × 80`],
        ['Monthly', usd(monthly, 2), `${usd(annual)} ÷ 12`],
        ['Annual (2,080 hours)', { text: usd(annual), accent: true, strong: true }, `${usd(w)} × 2,080`],
        ['Part-time (30 hrs/week)', usd(partTime30), `${usd(w)} × 30 × 52`],
      ],
      note: 'Gross (pre-tax) figures assuming paid hours every week of the year. Unpaid time off reduces them proportionally.',
    },
    {
      type: 'prose',
      eyebrow: 'The yearly picture',
      title: `${usd(w)} an hour in ${CONTENT_YEAR}, in <em>plain numbers</em>.`,
      paragraphs: [p1, p2],
    },
    {
      type: 'table',
      eyebrow: 'Overtime',
      title: `Overtime at ${usd(r2(w * 1.5), 2)}/hour changes the math <em>quickly</em>.`,
      columns: [
        { label: 'Weekly hours' },
        { label: 'Weekly pay', align: 'r' },
        { label: 'Annual pay', align: 'r' },
        { label: 'vs. 40-hour year', align: 'r' },
      ],
      rows: [
        ['40 (no overtime)', usd(weekly, 2), { text: usd(annual), accent: true }, '—'],
        ...OT_WEEKS.map((h) => {
          const wk = otWeekly(w, h);
          const yr = r2(wk * 52);
          return [
            `${h} (${h - 40} OT hours)`,
            usd(wk, 2),
            usd(yr),
            { text: `+${usd(r2(yr - annual))}` },
          ];
        }),
      ],
      note: `Overtime rows assume time-and-a-half (1.5 × ${usd(w)} = ${usd(r2(w * 1.5), 2)}) on hours past 40, every week of the year — the FLSA baseline for non-exempt workers.`,
    },
    {
      type: 'table',
      eyebrow: 'Federal-only estimate',
      title: `From ${usd(annual)} gross to <em>take-home</em>.`,
      columns: [
        { label: 'Line item' },
        { label: 'Amount', align: 'r' },
      ],
      rows: [
        ['Gross annual pay (2,080 hours)', usd(annual, 2)],
        [`Standard deduction (single, ${CONTENT_YEAR})`, `−${usd(STANDARD_DEDUCTION_SINGLE, 2)}`],
        ['Federally taxable income', usd(th.taxable, 2)],
        [`Federal income tax (effective ${effPct})`, `−${usd(th.federalTax, 2)}`],
        ['Social Security (6.2%)', `−${usd(th.socialSecurity, 2)}`],
        ['Medicare (1.45%)', `−${usd(th.medicare, 2)}`],
        ['Estimated annual take-home', { text: usd(th.net, 2), accent: true, strong: true }],
        ['≈ Monthly take-home', usd(th.netMonthly, 2)],
        ['≈ Per hour after federal tax', usd(r2(th.net / HOURS_PER_YEAR), 2)],
      ],
      note: 'Single filer, standard deduction, no state/local income tax, credits, or pre-tax benefits. Actual checks vary.',
    },
    {
      type: 'prose',
      eyebrow: 'Taxes',
      title: `What a single filer actually <em>keeps</em>.`,
      paragraphs: [p3],
    },
    {
      type: 'table',
      eyebrow: 'Compare',
      title: 'How nearby wages <em>stack up</em>.',
      columns: [
        { label: 'Hourly wage' },
        { label: 'Annual (2,080 hrs)', align: 'r' },
        { label: 'Monthly', align: 'r' },
        { label: 'Est. monthly take-home', align: 'r' },
      ],
      rows: nearbyRows,
      note: 'Take-home column uses the same federal-only, single-filer estimate as the table above.',
    },
  ];

  const faq = [
    {
      q: `How much is ${usd(w)} an hour per year?`,
      a: `${usd(w)} an hour is ${usd(annual)} a year at full time — 40 hours a week for 52 weeks (2,080 hours). At 30 hours a week it comes to ${usd(partTime30)}, and with 10 hours of weekly overtime it reaches about ${usd(r2(otWeekly(w, 50) * 52))}.`,
    },
    {
      q: `How much is ${usd(w)} an hour biweekly?`,
      a: `A standard 80-hour biweekly period at ${usd(w)}/hour grosses ${usd(biweekly, 2)}. After estimated federal income tax and FICA for a single filer, roughly ${usd(th.netBiweekly, 2)} remains per check, before state taxes.`,
    },
    {
      q: `How much is ${usd(w)} an hour after taxes?`,
      a: `On ${usd(annual)} of annual wages, a single filer taking the ${CONTENT_YEAR} standard deduction pays about ${usd(th.federalTax)} of federal income tax plus ${usd(th.ficaTotal)} of FICA, keeping roughly ${usd(th.net)} a year — about ${usd(r2(th.net / HOURS_PER_YEAR), 2)} per hour worked. State and local taxes reduce this further where they apply.`,
    },
    {
      q: `How much is ${usd(w)} an hour with overtime?`,
      a: `Overtime pays time-and-a-half: ${usd(r2(w * 1.5), 2)} per hour past 40 in a week. A steady 50-hour week earns ${usd(otWeekly(w, 50), 2)} weekly — ${usd(r2(otWeekly(w, 50) * 52))} a year, ${usd(r2(otWeekly(w, 50) * 52 - annual))} more than the straight 40-hour year.`,
    },
    {
      q: `Is ${usd(w)} an hour a good wage in ${CONTENT_YEAR}?`,
      a: `${usd(w)}/hour annualizes to ${usd(annual)}, which is ${relMedian} — the BLS median for full-time workers is ${usd(BLS_MEDIAN_WEEKLY)}/week (about ${usd(medianHourly, 2)}/hour, ${BLS_MEDIAN_SOURCE_LABEL}). Local cost of living, benefits, and schedule stability matter as much as the rate itself.`,
    },
  ];

  const related = [];
  if (showCounterpart) {
    related.push({
      name: `${usd(counterpartSalary)}/year → hourly`,
      desc: `The reverse view: what a ${usd(counterpartSalary)} salary pays per hour and per paycheck.`,
      mark: 'SL',
      href: `/salary/${salarySlug(counterpartSalary)}`,
      cat: 'Salary',
      time: '1 min read',
    });
  }
  related.push(
    { name: 'Savings Calculator', desc: 'Set a goal and see the monthly saving it takes.', mark: 'SV', href: '/calculators/savings', cat: 'Savings', time: '30 sec' },
    { name: 'Compound Interest', desc: 'How invested savings compound over the years.', mark: 'CI', href: '/calculators/compound-interest', cat: 'Savings', time: '30 sec' },
    { name: 'Loan Calculator', desc: 'Payments on car or personal loans at this income.', mark: 'LN', href: '/calculators/loan', cat: 'Borrowing', time: '30 sec' },
  );

  return {
    slug: hourlySlug(w),
    path: `/salary/${hourlySlug(w)}`,
    category: 'hourly',
    core: isHourlyCore(w),
    sortKey: w,
    title: `$${num(w)} an Hour Is How Much a Year? (${CONTENT_YEAR})`,
    metaDescription: `${usd(w)}/hour is ${usd(annual)} a year at 40 hrs/week — ${usd(monthly)} monthly, ${usd(biweekly, 2)} biweekly. See overtime pay tables and a ${CONTENT_YEAR} federal take-home estimate.`,
    payload: {
      hero: {
        chip: `Hourly wage · ${CONTENT_YEAR} figures`,
        titleBefore: `${usd(w)} an hour is `,
        titleEm: `${usd(annual)} a year`,
        titleAfter: '.',
        lede: `Full time at 40 hours a week, 52 weeks a year (2,080 hours). Below: every pay-period equivalent, overtime tables at time-and-a-half, and a ${CONTENT_YEAR} federal-only take-home estimate.`,
        meta: [
          { label: 'Basis', value: '2,080 hours/year' },
          { label: 'Updated', value: `August ${CONTENT_YEAR}` },
        ],
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'Calculators', href: '/calculators' },
          { label: `${usd(w)} an hour` },
        ],
        example: {
          prefix: '$',
          amount: num(annual),
          label: `Per year · ${usd(w)} × 2,080 working hours`,
          features: [
            `${usd(weekly, 2)} per 40-hour week`,
            `${usd(biweekly, 2)} per biweekly check`,
            `${usd(monthly, 2)} per month`,
            `≈ ${usd(th.netMonthly, 2)}/mo after est. federal tax`,
          ],
        },
      },
      shortAnswer: {
        heading: `How much is ${usd(w)} an hour per year?`,
        html: `<strong>${usd(w)} an hour is ${usd(annual)} a year</strong> at 40 hours a week for 52 weeks (2,080 hours). That's ${usd(weekly, 2)} a week, ${usd(biweekly, 2)} biweekly, and ${usd(monthly, 2)} a month gross. After estimated federal income tax and FICA, a single filer keeps about ${usd(th.net)} — and steady overtime at ${usd(r2(w * 1.5), 2)}/hour raises the total fast.`,
      },
      sections,
      faq,
      cta: {
        label: 'Do more with the wage',
        title: 'See what this paycheck can build',
        text: `Saving even one hour's pay per day — about ${usd(r2(w * 260 / 12))} a month — compounds into real money. Run your own numbers in the calculators.`,
        links: [
          { label: 'Savings Calculator', href: '/calculators/savings' },
          { label: 'Compound Interest Calculator', href: '/calculators/compound-interest' },
        ],
      },
      related,
      methodology: [
        `Annualization is straight arithmetic: ${usd(w)} × 2,080 hours (40 hours × 52 weeks) = ${usd(annual)}, with daily/weekly/biweekly/monthly rows derived the same way. No unpaid leave is assumed.`,
        `Overtime rows use the FLSA non-exempt baseline of 1.5× base pay (${usd(r2(w * 1.5), 2)}/hour) on hours over 40 per week, sustained all 52 weeks.`,
        `The take-home estimate uses ${CONTENT_YEAR} federal brackets for a single filer with the ${usd(STANDARD_DEDUCTION_SINGLE)} standard deduction plus employee FICA (7.65%). It excludes state/local tax, credits, and pre-tax benefits.`,
        `Median-wage comparison: BLS median usual weekly earnings, full-time workers, ${usd(BLS_MEDIAN_WEEKLY)}/week (${BLS_MEDIAN_SOURCE_LABEL}).`,
        'Educational estimates only — not tax, legal, or financial advice.',
      ],
      dateModified: GENERATED_DATE,
    },
  };
}

export function buildHourlyPages() {
  return HOURLY_WAGES.map(buildOne);
}
