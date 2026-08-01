/**
 * growth.mjs — "How much will $X grow in 20 years" pages.
 * FV grids at 4/5/7/8/10% × 5/10/20/30 years (lump sum and with monthly
 * contributions), rule-of-72 doubling times.
 */
import {
  r2, usd, num, pct, pick, neighbors, fvLump, fvMonthly, ruleOf72,
} from './lib.mjs';
import { CONTENT_YEAR, GENERATED_DATE } from './tax-2026.mjs';
import { GROWTH_AMOUNTS, growthSlug } from './sets.mjs';

const RATES = [4, 5, 7, 8, 10];
const YEARS = [5, 10, 20, 30];
const CONTRIBS = [0, 100, 250, 500];
const REP_RATE = 7; // headline rate
const REP_YEARS = 20;

function buildOne(p, index) {
  const seed = index + p / 1000;
  const headline = fvLump(p, REP_RATE, REP_YEARS);
  const headline10 = fvLump(p, 10, REP_YEARS);
  const headline4 = fvLump(p, 4, REP_YEARS);
  const gain = r2(headline - p);
  const with100 = fvMonthly(p, REP_RATE, REP_YEARS, 100);
  const with500 = fvMonthly(p, REP_RATE, REP_YEARS, 500);
  const double7 = ruleOf72(REP_RATE);
  const multiple = num(r2(headline / p), 2);

  const nearby = neighbors(GROWTH_AMOUNTS, p, 3);
  const nearbyRows = [...nearby, p]
    .sort((x, y) => x - y)
    .map((v) => {
      const self = v === p;
      return [
        self
          ? { text: `${usd(v)} starting (this page)`, accent: true }
          : { text: `${usd(v)} starting`, href: `/savings/${growthSlug(v)}` },
        { text: usd(fvLump(v, 5, 20)) },
        { text: usd(fvLump(v, 7, 20)) },
        { text: usd(fvLump(v, 10, 20)) },
      ];
    });

  const p1 = pick([
    `Left alone at a 7% average annual return, ${usd(p)} grows to <strong>${usd(headline)}</strong> in 20 years — a gain of ${usd(gain)} without adding a cent. The multiple (${multiple}×) is the same whatever the starting amount; what changes is how much each percentage point is worth in dollars.`,
    `Compound ${usd(p)} at 7% a year for two decades and it becomes <strong>${usd(headline)}</strong> — ${multiple}× the original stake, with ${usd(gain)} of that being growth. The engine is compounding: each year's return earns its own return the next year.`,
    `At a 7% annual return, ${usd(p)} turns into <strong>${usd(headline)}</strong> over 20 years. None of that requires new deposits — it's ${usd(gain)} of pure compounding, and the curve steepens with every year you leave it invested.`,
  ], seed);

  const p2 = pick([
    `The return assumption dominates everything. The same ${usd(p)} over the same 20 years ends at ${usd(headline4)} at 4% (roughly a high-yield-savings trajectory) but ${usd(headline10)} at 10% (close to the S&P 500's long-run nominal average). That spread — ${usd(r2(headline10 - headline4))} — is why "where you park it" matters more than timing.`,
    `Small differences in return compound into huge differences in outcome: at 4%, ${usd(p)} reaches ${usd(headline4)} in 20 years; at 10% it reaches ${usd(headline10)}. Three extra points from 4% to 7% is worth ${usd(r2(headline - headline4))}; the full jump to 10% is worth ${usd(r2(headline10 - headline4))}.`,
  ], seed);

  const p3 = pick([
    `Adding even modest monthly contributions transforms the curve. Put ${usd(100)} a month alongside the ${usd(p)} and the 20-year total at 7% jumps from ${usd(headline)} to about ${usd(with100)}; at ${usd(500)} a month it reaches ${usd(with500)}. Contributions do the heavy lifting early, compounding takes over later.`,
    `The lump sum is only half the story. ${usd(100)}/month added to ${usd(p)} grows the 20-year outcome at 7% to roughly ${usd(with100)}, and ${usd(500)}/month pushes it to ${usd(with500)}. In the early years the deposits dominate; by the back half, growth on the balance out-earns the deposits themselves.`,
  ], seed + 1);

  const sections = [
    {
      type: 'table',
      eyebrow: 'Lump sum',
      title: `${usd(p)} left to compound, <em>no additions</em>.`,
      columns: [
        { label: 'Annual return' },
        ...YEARS.map((y) => ({ label: `${y} years`, align: 'r' })),
      ],
      rows: RATES.map((r) => [
        `${pct(r, 0)}${r === REP_RATE ? ' (headline)' : ''}`,
        ...YEARS.map((y) => {
          const v = fvLump(p, r, y);
          return r === REP_RATE && y === REP_YEARS
            ? { text: usd(v), accent: true, strong: true }
            : usd(v);
        }),
      ]),
      note: 'Annual compounding on the starting amount only, before taxes, fees, and inflation. Returns are illustrative assumptions, not predictions.',
    },
    {
      type: 'prose',
      eyebrow: 'The compounding math',
      title: `What ${usd(p)} becomes when you <em>leave it alone</em>.`,
      paragraphs: [p1, p2],
    },
    {
      type: 'table',
      eyebrow: 'With monthly contributions · 7% return',
      title: `Add a monthly deposit and the curve <em>bends up</em>.`,
      columns: [
        { label: 'Monthly addition' },
        ...YEARS.map((y) => ({ label: `${y} years`, align: 'r' })),
      ],
      rows: CONTRIBS.map((c) => [
        c === 0 ? `${usd(p)} alone` : `+ ${usd(c)}/month`,
        ...YEARS.map((y) => {
          const v = fvMonthly(p, REP_RATE, y, c);
          return c === 0 ? { text: usd(v) } : y === REP_YEARS ? { text: usd(v), accent: true } : usd(v);
        }),
      ]),
      note: `7% annual return compounded monthly, contributions at each month's end. The ${usd(p)}-alone row differs slightly from the annual-compounding table above because of the monthly compounding convention.`,
    },
    {
      type: 'prose',
      eyebrow: 'Contributions',
      title: `Deposits first, compounding <em>later</em>.`,
      paragraphs: [p3],
    },
    {
      type: 'table',
      eyebrow: 'Rule of 72',
      title: `How fast ${usd(p)} <em>doubles</em>.`,
      columns: [
        { label: 'Annual return' },
        { label: 'Years to double (72 ÷ rate)', align: 'r' },
        { label: 'Rule-of-72 estimate, 30 yrs', align: 'r' },
        { label: 'Exact value, 30 yrs', align: 'r' },
      ],
      rows: RATES.map((r) => {
        const d = ruleOf72(r);
        const approx = r2(p * Math.pow(2, 30 / d));
        return [
          pct(r, 0),
          `${num(d, 1)} years`,
          usd(approx),
          { text: usd(fvLump(p, r, 30)), accent: r === REP_RATE },
        ];
      }),
      note: `At 7%, money doubles roughly every ${num(double7, 1)} years — so a 20-year horizon fits almost two full doublings of ${usd(p)}.`,
    },
    {
      type: 'table',
      eyebrow: 'Compare',
      title: 'Other starting amounts, <em>20-year view</em>.',
      columns: [
        { label: 'Starting amount' },
        { label: 'At 5% · 20 yrs', align: 'r' },
        { label: 'At 7% · 20 yrs', align: 'r' },
        { label: 'At 10% · 20 yrs', align: 'r' },
      ],
      rows: nearbyRows,
      note: 'Annual compounding, lump sum only — click through for the full breakdown of any amount.',
    },
  ];

  const faq = [
    {
      q: `How much will ${usd(p)} grow in 20 years at 7%?`,
      a: `${usd(p)} compounding at 7% annually becomes about ${usd(headline)} in 20 years — ${multiple}× the starting amount, or ${usd(gain)} of growth with no additional deposits. With monthly compounding the figure is slightly higher: about ${usd(fvMonthly(p, 7, 20, 0))}.`,
    },
    {
      q: `How much will ${usd(p)} be worth in 20 years at 10%?`,
      a: `At a 10% average annual return — near the S&P 500's long-run nominal average — ${usd(p)} grows to about ${usd(headline10)} in 20 years. At a more conservative 5% it reaches ${usd(fvLump(p, 5, 20))}, and at 4% (a savings-account-like rate) about ${usd(headline4)}.`,
    },
    {
      q: `How long does it take ${usd(p)} to double?`,
      a: `By the rule of 72, dividing 72 by the return gives the doubling time: about ${num(ruleOf72(7), 1)} years at 7%, ${num(ruleOf72(10), 1)} years at 10%, and ${num(ruleOf72(4), 1)} years at 4%. Over 30 years at 7%, ${usd(p)} doubles almost three times, reaching about ${usd(fvLump(p, 7, 30))}.`,
    },
    {
      q: `What if I add ${usd(100)} a month to ${usd(p)}?`,
      a: `Adding ${usd(100)} a month at a 7% return takes the 20-year total from about ${usd(fvMonthly(p, 7, 20, 0))} to roughly ${usd(with100)}. At ${usd(250)}/month it reaches ${usd(fvMonthly(p, 7, 20, 250))}, and at ${usd(500)}/month about ${usd(with500)}.`,
    },
    {
      q: `Are these growth numbers guaranteed?`,
      a: `No. Market returns vary year to year — 7% and 10% are long-run averages, not promises, and real results are lumpy, can be negative for stretches, and are reduced by taxes, fees, and inflation. Treat every figure here as an illustration of compounding math, not a forecast.`,
    },
  ];

  return {
    slug: growthSlug(p),
    path: `/savings/${growthSlug(p)}`,
    category: 'growth',
    core: true,
    sortKey: p,
    title: `How Much Will $${num(p)} Grow in 20 Years? (${CONTENT_YEAR})`,
    metaDescription: `${usd(p)} grows to ${usd(headline)} in 20 years at 7% — and ${usd(headline10)} at 10%. See growth tables for 4–10% returns, 5–30 year horizons, and monthly contributions.`,
    payload: {
      hero: {
        chip: 'Compound growth · projection tables',
        titleBefore: `${usd(p)} today is `,
        titleEm: `${usd(headline)} in 20 years`,
        titleAfter: ' at 7%.',
        lede: `Full growth tables for a ${usd(p)} starting balance: returns from 4% to 10%, horizons from 5 to 30 years, with and without monthly contributions — plus rule-of-72 doubling times.`,
        meta: [
          { label: 'Headline', value: '7% return, 20 years' },
          { label: 'Updated', value: `August ${CONTENT_YEAR}` },
        ],
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'Compound Interest', href: '/calculators/compound-interest' },
          { label: `${usd(p)} in 20 years` },
        ],
        example: {
          prefix: '$',
          amount: num(headline),
          label: `${usd(p)} at 7% for 20 years, no additions`,
          features: [
            `${usd(gain)} of pure compounding`,
            `${usd(headline10)} if returns average 10%`,
            `${usd(with100)} with ${usd(100)}/mo added`,
            `Doubles roughly every ${num(double7, 1)} years at 7%`,
          ],
        },
      },
      shortAnswer: {
        heading: `How much will ${usd(p)} grow in 20 years?`,
        html: `<strong>${usd(p)} grows to about ${usd(headline)} in 20 years at a 7% average annual return</strong> — ${multiple}× the starting amount. At 5% it reaches ${usd(fvLump(p, 5, 20))}; at 10%, ${usd(headline10)}. Add ${usd(100)} a month and the 7% outcome climbs to roughly ${usd(with100)}. Returns are illustrative averages, not guarantees.`,
      },
      sections,
      faq,
      cta: {
        label: 'Your own scenario',
        title: 'Chart any amount, rate, and timeline',
        text: 'The interactive compound interest calculator draws the full year-by-year curve for any starting balance, contribution schedule, and compounding frequency.',
        links: [
          { label: 'Compound Interest Calculator', href: '/calculators/compound-interest' },
          { label: 'Investment Calculator', href: '/calculators/investment' },
        ],
      },
      related: [
        { name: 'Compound Interest', desc: 'Interactive version of these tables with charts.', mark: 'CI', href: '/calculators/compound-interest', cat: 'Savings', time: '30 sec' },
        { name: 'Investment Growth', desc: 'Project a portfolio with regular contributions.', mark: 'IV', href: '/calculators/investment', cat: 'Investing', time: '1 min' },
        { name: 'Savings Calculator', desc: 'Work backward from a savings goal to a monthly amount.', mark: 'SV', href: '/calculators/savings', cat: 'Savings', time: '30 sec' },
        { name: 'Retirement Calculator', desc: 'Stretch the same compounding out to retirement age.', mark: 'RT', href: '/calculators/retirement', cat: 'Retirement', time: '1 min' },
      ],
      methodology: [
        'Lump-sum tables use annual compounding: FV = P × (1 + r)ᵗ. The contribution table uses monthly compounding (r ÷ 12) with deposits at the end of each month, which is why its zero-contribution row runs slightly ahead of the annual table.',
        'Return rates (4–10%) are illustrative long-run averages: 4–5% resembles high-yield savings/bonds, 7% a conservative stock-portfolio assumption, 10% the S&P 500’s long-run nominal average. Actual returns vary and can be negative.',
        'All figures are nominal — before taxes, investment fees, and inflation, each of which reduces real-world outcomes.',
        'Educational illustrations of compound-interest math — not investment advice or a forecast.',
      ],
      dateModified: GENERATED_DATE,
    },
  };
}

export function buildGrowthPages() {
  return GROWTH_AMOUNTS.map(buildOne);
}
