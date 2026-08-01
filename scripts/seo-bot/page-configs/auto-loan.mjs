/**
 * auto-loan.mjs — "$X car loan payment" pages.
 * Rates 5–9% × 48/60/72-month terms, total interest, depreciation-vs-balance.
 */
import {
  r2, usd, num, pct, pick, neighbors, pmt, totalInterest, balanceAfter,
} from './lib.mjs';
import { CONTENT_YEAR, GENERATED_DATE } from './tax-2026.mjs';
import { AUTO_AMOUNTS, autoSlug } from './sets.mjs';

const RATES = [5, 6, 7, 8, 9];
const TERMS = [48, 60, 72];
const REP_RATE = 7; // representative
const REP_TERM = 60;

function buildOne(a) {
  const seed = a / 5000;
  const rep = pmt(a, REP_RATE, REP_TERM);
  const repInterest = totalInterest(a, REP_RATE, REP_TERM);
  const p48 = pmt(a, REP_RATE, 48);
  const p72 = pmt(a, REP_RATE, 72);
  const i48 = totalInterest(a, REP_RATE, 48);
  const i72 = totalInterest(a, REP_RATE, 72);
  // Depreciation illustration: new car worth `a` financed 100% at 7%/72.
  const bal24 = balanceAfter(a, REP_RATE, 72, 24);
  const bal36 = balanceAfter(a, REP_RATE, 72, 36);
  const val24 = r2(a * 0.8 * 0.85); // −20% year 1, −15% year 2 (typical curve)
  const val36 = r2(a * 0.8 * 0.85 * 0.85);
  const gap24 = r2(bal24 - val24);

  const nearby = neighbors(AUTO_AMOUNTS, a, 3);
  const nearbyRows = [...nearby, a]
    .sort((x, y) => x - y)
    .map((v) => {
      const self = v === a;
      return [
        self
          ? { text: `${usd(v)} loan (this page)`, accent: true }
          : { text: `${usd(v)} loan`, href: `/auto-loan/${autoSlug(v)}` },
        { text: usd(pmt(v, REP_RATE, 48), 2) },
        { text: usd(pmt(v, REP_RATE, 60), 2) },
        { text: usd(pmt(v, REP_RATE, 72), 2) },
      ];
    });

  const p1 = pick([
    `Financing ${usd(a)} at ${pct(REP_RATE, 0)} over 60 months costs <strong>${usd(rep, 2)} a month</strong> and ${usd(repInterest)} in total interest. Stretch the same loan to 72 months and the payment drops to ${usd(p72, 2)} — but interest climbs to ${usd(i72)}. Compress it to 48 months and you pay ${usd(p48, 2)} monthly while cutting interest to ${usd(i48)}.`,
    `A ${usd(a)} car loan at ${pct(REP_RATE, 0)} runs <strong>${usd(rep, 2)} per month on a 60-month term</strong>, with ${usd(repInterest)} of lifetime interest. The term is the big trade-off: 48 months means ${usd(p48, 2)}/month but only ${usd(i48)} of interest, while 72 months lowers the payment to ${usd(p72, 2)} at a cost of ${usd(i72)} in interest.`,
    `At a representative ${pct(REP_RATE, 0)} APR, ${usd(a)} of auto financing costs <strong>${usd(rep, 2)} monthly over 60 months</strong> (${usd(repInterest)} total interest). Choosing 72 months trims the payment to ${usd(p72, 2)} but adds ${usd(r2(i72 - repInterest))} of extra interest; 48 months raises it to ${usd(p48, 2)} and saves ${usd(r2(repInterest - i48))}.`,
  ], seed);

  const p2 = pick([
    `Cars depreciate faster than long loans amortize. A typical new vehicle loses about 20% of its value in year one and roughly 15% a year after that — so a ${usd(a)} car is worth around ${usd(val24)} after two years. On a 72-month loan at ${pct(REP_RATE, 0)} you'd still owe about ${usd(bal24)} at that point${gap24 > 0 ? ` — roughly ${usd(gap24)} of negative equity` : ''}. Shorter terms and bigger down payments keep the balance under the car's value.`,
    `Watch the depreciation curve: two years in, a ${usd(a)} vehicle is typically worth about ${usd(val24)} (−20% year one, −15% year two), and about ${usd(val36)} after three. With a 72-month loan at ${pct(REP_RATE, 0)}, the balance is still ${usd(bal24)} at month 24 and ${usd(bal36)} at month 36${gap24 > 0 ? `, leaving you "underwater" by around ${usd(gap24)} early on` : ''}. That gap is why lenders push GAP insurance on long-term loans.`,
  ], seed);

  const sections = [
    {
      type: 'table',
      eyebrow: 'Monthly payment',
      title: `${usd(a)} car loan payment <em>by rate and term</em>.`,
      columns: [
        { label: 'APR' },
        { label: '48 months', align: 'r' },
        { label: '60 months', align: 'r' },
        { label: '72 months', align: 'r' },
      ],
      rows: RATES.map((r) => [
        `${pct(r, 0)}${r === REP_RATE ? ' (used below)' : ''}`,
        usd(pmt(a, r, 48), 2),
        { text: usd(pmt(a, r, 60), 2), accent: r === REP_RATE },
        usd(pmt(a, r, 72), 2),
      ]),
      note: 'Principal and interest on the amount financed. Taxes, title, registration, and insurance are extra — and a down payment or trade-in reduces the financed amount directly.',
    },
    {
      type: 'prose',
      eyebrow: 'The trade-off',
      title: `Payment vs. interest: the term is the <em>real decision</em>.`,
      paragraphs: [p1],
    },
    {
      type: 'table',
      eyebrow: 'Lifetime cost',
      title: `Total interest on ${usd(a)} <em>over the loan</em>.`,
      columns: [
        { label: 'APR' },
        { label: '48-mo interest', align: 'r' },
        { label: '60-mo interest', align: 'r' },
        { label: '72-mo interest', align: 'r' },
        { label: '72 vs 48 extra cost', align: 'r' },
      ],
      rows: RATES.map((r) => {
        const a48 = totalInterest(a, r, 48);
        const a60 = totalInterest(a, r, 60);
        const a72 = totalInterest(a, r, 72);
        return [
          pct(r, 0),
          usd(a48),
          { text: usd(a60), accent: r === REP_RATE },
          usd(a72),
          `+${usd(r2(a72 - a48))}`,
        ];
      }),
      note: `At ${pct(REP_RATE, 0)}, choosing 72 months over 48 costs ${usd(r2(i72 - i48))} more in interest on this loan — the price of the lower monthly payment.`,
    },
    {
      type: 'prose',
      eyebrow: 'Depreciation',
      title: `The car loses value faster than the loan <em>pays down</em>.`,
      paragraphs: [p2],
    },
    {
      type: 'table',
      eyebrow: 'Compare',
      title: `Nearby loan amounts at ${pct(REP_RATE, 0)} APR.`,
      columns: [
        { label: 'Amount financed' },
        { label: '48-mo payment', align: 'r' },
        { label: '60-mo payment', align: 'r' },
        { label: '72-mo payment', align: 'r' },
      ],
      rows: nearbyRows,
      note: 'Same math, different principal — use these links to jump to the breakdown for a different budget.',
    },
  ];

  const faq = [
    {
      q: `What is the monthly payment on a ${usd(a)} car loan?`,
      a: `At ${pct(REP_RATE, 0)} APR, a ${usd(a)} car loan costs ${usd(rep, 2)} a month over 60 months, ${usd(p48, 2)} over 48 months, or ${usd(p72, 2)} over 72 months. Across the ${pct(RATES[0], 0)}–${pct(RATES[RATES.length - 1], 0)} APR range, the 60-month payment runs ${usd(pmt(a, RATES[0], 60), 2)}–${usd(pmt(a, RATES[RATES.length - 1], 60), 2)}.`,
    },
    {
      q: `How much interest will I pay on a ${usd(a)} auto loan?`,
      a: `At ${pct(REP_RATE, 0)} APR, total interest is ${usd(i48)} over 48 months, ${usd(repInterest)} over 60, and ${usd(i72)} over 72. The longer the term, the lower the payment but the higher the total cost — 72 months costs ${usd(r2(i72 - i48))} more than 48 at the same rate.`,
    },
    {
      q: `Is a 72-month loan a bad idea for ${usd(a)}?`,
      a: `Not automatically, but it has two costs: ${usd(r2(i72 - i48))} more interest than a 48-month term at ${pct(REP_RATE, 0)}, and a longer stretch of negative equity — around month 24 you'd owe about ${usd(bal24)} while a typical ${usd(a)} car is worth roughly ${usd(val24)}. If you need 72 months to afford the payment, consider a cheaper car or a larger down payment.`,
    },
    {
      q: `What credit score do I need for a good rate on ${usd(a)}?`,
      a: `The ${pct(RATES[0], 0)}–${pct(RATES[RATES.length - 1], 0)} range shown spans roughly prime to near-prime pricing in ${CONTENT_YEAR}; top-tier borrowers on new cars can beat it, while subprime rates run well above it. On this loan, each 1% of APR changes the 60-month payment by about ${usd(r2(pmt(a, 8, 60) - pmt(a, 7, 60)), 2)}/month — so improving your score before buying has a measurable payoff.`,
    },
    {
      q: `Should I put money down on a ${usd(a)} car?`,
      a: `Yes, if you can — every ${usd(1000)} of down payment cuts the 60-month payment at ${pct(REP_RATE, 0)} by about ${usd(pmt(1000, REP_RATE, 60), 2)}/month and reduces the risk of owing more than the car is worth. A 10–20% down payment typically keeps the balance below the depreciation curve from day one.`,
    },
  ];

  return {
    slug: autoSlug(a),
    path: `/auto-loan/${autoSlug(a)}`,
    category: 'auto-loan',
    core: true,
    sortKey: a,
    title: `$${num(a)} Car Loan Payment: 48, 60 & 72 Months (${CONTENT_YEAR})`,
    metaDescription: `A ${usd(a)} car loan costs ${usd(rep, 2)}/mo at ${pct(REP_RATE, 0)} APR over 60 months. Compare 48/60/72-month payments at 5–9%, total interest, and depreciation risk.`,
    payload: {
      hero: {
        chip: `Auto loan · ${CONTENT_YEAR} rate table`,
        titleBefore: `The ${usd(a)} car loan `,
        titleEm: 'payment',
        titleAfter: ', term by term.',
        lede: `Monthly payments on ${usd(a)} of auto financing across ${pct(RATES[0], 0)}–${pct(RATES[RATES.length - 1], 0)} APRs and 48/60/72-month terms, plus total interest and what depreciation does to your equity along the way.`,
        meta: [
          { label: 'APRs shown', value: `${pct(RATES[0], 0)}–${pct(RATES[RATES.length - 1], 0)}` },
          { label: 'Updated', value: `August ${CONTENT_YEAR}` },
        ],
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'Loan Calculator', href: '/calculators/loan' },
          { label: `${usd(a)} car loan` },
        ],
        example: {
          prefix: '$',
          amount: num(rep, 2),
          label: `Monthly payment · ${usd(a)} at ${pct(REP_RATE, 0)} APR, 60 months`,
          features: [
            `${usd(p48, 2)}/mo on 48 months`,
            `${usd(p72, 2)}/mo on 72 months`,
            `${usd(repInterest)} total interest (60 mo)`,
            'Before taxes, fees & insurance',
          ],
        },
      },
      shortAnswer: {
        heading: `What does a ${usd(a)} car loan cost per month?`,
        html: `<strong>A ${usd(a)} car loan costs about ${usd(rep, 2)} a month</strong> at ${pct(REP_RATE, 0)} APR over 60 months, with ${usd(repInterest)} of total interest. On 48 months the payment is ${usd(p48, 2)} (${usd(i48)} interest); on 72 months it's ${usd(p72, 2)} (${usd(i72)} interest). Your APR and down payment move these numbers — the tables below cover ${pct(RATES[0], 0)}–${pct(RATES[RATES.length - 1], 0)}.`,
      },
      sections,
      faq,
      cta: {
        label: 'Your exact numbers',
        title: 'Model your own rate, term, and extra payments',
        text: 'The interactive loan calculator handles any APR and term, shows the full amortization schedule, and lets you test extra payments against the balance.',
        links: [
          { label: 'Loan Calculator', href: '/calculators/loan' },
          { label: 'Savings Calculator', href: '/calculators/savings' },
        ],
      },
      related: [
        { name: 'Loan Calculator', desc: 'Any loan amount, rate, and term with amortization.', mark: 'LN', href: '/calculators/loan', cat: 'Borrowing', time: '30 sec' },
        { name: 'Savings Calculator', desc: 'Save up a bigger down payment on a schedule.', mark: 'SV', href: '/calculators/savings', cat: 'Savings', time: '30 sec' },
        { name: 'Compound Interest', desc: 'What invested money grows to while you drive.', mark: 'CI', href: '/calculators/compound-interest', cat: 'Savings', time: '30 sec' },
        { name: 'Mortgage Calculator', desc: 'The other big amortizing loan in most budgets.', mark: 'MG', href: '/calculators/mortgage', cat: 'Borrowing', time: '1 min' },
      ],
      methodology: [
        `Payments use the standard amortization formula with monthly compounding on ${usd(a)} financed. APRs shown (${pct(RATES[0], 0)}–${pct(RATES[RATES.length - 1], 0)}) are illustrative steps spanning typical ${CONTENT_YEAR} prime/near-prime pricing, not offers.`,
        'Depreciation figures use a typical curve — about 20% loss in year one and 15% per year thereafter — applied to the financed amount as a proxy for vehicle price with zero down. Individual models vary widely.',
        'Figures exclude sales tax, title/registration fees, dealer add-ons, and insurance. Educational estimates — not lending or financial advice.',
      ],
      dateModified: GENERATED_DATE,
    },
  };
}

export function buildAutoPages() {
  return AUTO_AMOUNTS.map(buildOne);
}
