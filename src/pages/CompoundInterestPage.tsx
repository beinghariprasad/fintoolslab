import { useState, useEffect } from 'react';
import { CompoundCalculatorMini } from '@/components/calculators/CompoundCalculatorMini';
import { CalcPageHero } from '@/components/calculators/CalcPageHero';
import { CalcExplainer } from '@/components/calculators/CalcExplainer';
import { CalcFAQ } from '@/components/calculators/CalcFAQ';
import { CalcRelatedGrid, RailCard } from '@/components/calculators/CalcRelated';
import { CalcBreakdown } from '@/components/calculators/CalcBreakdown';
import { CalcShortAnswer } from '@/components/calculators/CalcShortAnswer';
import { CalcTips } from '@/components/calculators/CalcTips';
import { AdSlot } from '@/components/ads/AdSlot';
import { Helmet } from 'react-helmet-async';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Compound Interest Calculator",
  "description": "Free compound interest calculator with interactive charts and detailed projections",
  "url": "https://fintoolslab.com/calculators/compound-interest",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "featureList": ["Interactive charts", "Multiple currencies", "Flexible contribution schedules", "Real-time calculations", "Export results"],
  "softwareVersion": "3.0",
  "author": { "@type": "Organization", "name": "Fin Tools Lab" }
};

const faqItems = [
  {
    q: "What return assumption should I actually use?",
    a: "A 7% annual return is the historical average for a globally-diversified equity portfolio after inflation. If you're modeling a 100% stock allocation, 7-8% is reasonable. For a 60/40 mix, 5-6%. For cash and bonds, 2-4%. The point of the calculator isn't to predict — it's to show how sensitive the answer is to this single number.",
  },
  {
    q: "How is compound interest different from simple interest?",
    a: "Simple interest pays you a flat percentage of your original principal every period — your interest doesn't earn its own interest. Compound interest reinvests each period's earnings, so the base your interest is calculated against grows each cycle. Over short timeframes the difference is small; over 20+ years it's enormous.",
  },
  {
    q: "Does compounding frequency really matter?",
    a: "Less than most people think. Going from yearly to monthly compounding on a 7% return adds about 0.23% to your effective annual rate — meaningful over a long horizon, but dwarfed by the underlying return assumption. The bigger lever is almost always time.",
  },
  {
    q: "What about inflation?",
    a: "This calculator returns nominal dollars — the actual sticker number. To translate to today's purchasing power, subtract roughly 2-3% from your return assumption to get a real return.",
  },
  {
    q: "Can I model irregular contributions?",
    a: "Not directly in this calculator — it assumes a constant periodic deposit. For irregular contribution schedules (bonuses, employer match, raises), use the Retirement Planner, which supports timeline-based events.",
  },
  {
    q: "Are the results financial advice?",
    a: "No. Fin Tools Lab is educational. Real returns are not constant, fees compound the same way returns do, and your tax situation matters. Use this to build intuition — talk to a licensed planner before making large decisions.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": { "@type": "Answer", "text": item.a }
  }))
};

const relatedCalcs = [
  { name: "Retirement planner", desc: "Project the nest egg you'll have at 65", mark: "R", href: "/calculators/retirement", cat: "Investing", time: "2 min" },
  { name: "Savings goal", desc: "Reverse-engineer the monthly habit to hit a target", mark: "S", href: "/calculators/savings", cat: "Saving", time: "30 sec" },
  { name: "Investment growth", desc: "Lump sum vs. dollar-cost average — which wins?", mark: "L", href: "/calculators/investment", cat: "Investing", time: "1 min" },
  { name: "Mortgage calculator", desc: "See monthly payments and total interest on a home loan", mark: "M", href: "/calculators/mortgage", cat: "Borrowing", time: "1 min" },
];

const railItems = [
  { name: "Retirement planner", desc: "What you'll have at 65", mark: "R", href: "/calculators/retirement" },
  { name: "Savings goal", desc: "Reverse a target into a habit", mark: "S", href: "/calculators/savings" },
  { name: "Investment growth", desc: "Lump sum vs. DCA", mark: "L", href: "/calculators/investment" },
  { name: "Loan calculator", desc: "Payment schedules & interest", mark: "$", href: "/calculators/loan" },
];

export default function CompoundInterestPage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>Compound Interest Calculator - Free Investment Growth Calculator | Fin Tools Lab</title>
        <meta name="description" content="Calculate compound interest with our free calculator. See how your investments grow over time with interactive charts, multiple currencies, and detailed projections. Perfect for retirement and investment planning." />
        <meta name="keywords" content="compound interest calculator, investment calculator, compound interest, retirement planning, savings calculator, investment growth" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/compound-interest" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/compound-interest" />
        <meta property="og:title" content="Compound Interest Calculator - Free Investment Growth Calculator" />
        <meta property="og:description" content="Calculate compound interest with our free calculator. See how your investments grow over time with interactive charts and detailed projections." />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/compound-interest" />
        <meta property="twitter:title" content="Compound Interest Calculator - Free Investment Growth Calculator" />
        <meta property="twitter:description" content="Calculate compound interest with our free calculator. See how your investments grow over time with interactive charts and detailed projections." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fintoolslab.com" },
              { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://fintoolslab.com/calculators" },
              { "@type": "ListItem", "position": 3, "name": "Compound Interest", "item": "https://fintoolslab.com/calculators/compound-interest" }
            ]
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Investing · 30-second setup"
        title={<>Compound interest <em>calculator</em></>}
        lede="Move four sliders. Watch a thirty-year story unfold. This is the same model professional planners use to project a portfolio — pared down, kept honest, and made obvious."
        meta={[
          { label: 'Updated', value: 'May 2026' },
          { label: 'Engine', value: 'v3.0' },
          { label: 'Methodology', value: 'FV with periodic deposits' },
        ]}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Calculators', href: '/calculators' },
          { label: 'Compound interest' },
        ]}
        workedExample={{
          amount: '821,572',
          label: 'Balance at year 30 · $10K start, $500/mo, 7% return',
          features: ['Compound monthly or yearly', 'Hover to inspect any year', 'Export the year-by-year table'],
        }}
      />

      <CalcShortAnswer heading="What is a compound interest calculator?">
        <strong>A compound interest calculator</strong> shows how a starting balance plus ongoing contributions grow when each period's earnings get reinvested. The math is identical to what professional planners use; this version exposes the four inputs that move the answer most — principal, contribution, return rate, and time horizon — so you can build intuition fast.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <CompoundCalculatorMini />
        </div>
      </section>

      <AdSlot size="leaderboard" />

      <section style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div className="cp-split">
            <div>{schedule && <CalcBreakdown
              schedule={schedule}
              columns={[
                { key: 'contributed', label: 'Contributed' },
                { key: 'interest', label: 'Interest', accent: true },
                { key: 'balance', label: 'Balance' },
              ]}
              shareKey="interest"
              shareLabel="Interest share"
              csvFilename="compound-interest-breakdown"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>One equation. <em>Thirty years</em> of consequence.</>}
        paragraphs={[
          "Compound interest is the engine behind why time, not contribution size, is the biggest lever most people have. Each period your balance earns a return — and then that return earns its own return next period, recursively.",
          "Stretch this over decades and the curve gets unintuitive fast: a 25-year-old saving $300/mo ends up with a larger balance than a 35-year-old saving $600/mo, even after the 35-year-old contributes twice as much in absolute dollars.",
          "The calculator above runs the standard future-value formula for a series — with monthly or yearly compounding — so the numbers match what a financial planner's spreadsheet would produce.",
        ]}
        formulaLabel="Future value with periodic deposits"
        formulaDisplay={
          <>
            <span>FV</span>
            <span style={{ color: 'var(--ink-on-dark-2)' }}>=</span>
            <span className="accent">P</span>
            <span style={{ color: 'var(--ink-on-dark-2)' }}>(1 +</span>
            <span className="accent">r/n</span>
            <span style={{ color: 'var(--ink-on-dark-2)' }}>)</span>
            <sup style={{ fontSize: '0.4em', color: 'var(--ink-on-dark-2)' }}>nt</sup>
            <span style={{ color: 'var(--ink-on-dark-2)' }}>+</span>
            <span className="accent">PMT</span>
            <span style={{ color: 'var(--ink-on-dark-2)' }}>·</span>
            <span style={{ color: 'var(--ink-on-dark-2)', fontStyle: 'normal', fontSize: '0.6em' }}>
              [((1 + r/n)<sup>nt</sup> − 1) / (r/n)]
            </span>
          </>
        }
        legend={[
          { symbol: 'P', label: 'Principal', desc: 'the starting balance' },
          { symbol: 'PMT', label: 'Periodic deposit', desc: 'your monthly or yearly contribution' },
          { symbol: 'r', label: 'Annual rate', desc: 'your expected return, as a decimal' },
          { symbol: 'n', label: 'Compounding frequency', desc: '12 for monthly, 1 for yearly' },
          { symbol: 't', label: 'Time horizon', desc: 'number of years' },
        ]}
      />

      <CalcTips items={[
        { title: 'Start now, not next year.', text: "One year of compounding at age 25 can outweigh five years of compounding at age 45. Time is the most valuable input." },
        { title: 'Index funds beat stock picking.', text: "For most long-horizon investors, a broad index fund earns the market return at minimal fee drag — the simplest path to the calculator's projection." },
        { title: 'Automate the contribution.', text: "Friction kills compounding. Set the monthly deposit to auto-draft on payday so you don't have to think about it." },
        { title: "Don't time the market.", text: 'Missing the 10 best days of a decade can halve your return. Time IN the market beats timing the market for nearly every long horizon.' },
        { title: 'Stress-test at 5%, not 10%.', text: 'Conservative return assumptions force higher savings rates. A plan that works at 5% returns is a plan that always works.' },
        { title: 'Recheck annually.', text: 'Salary changes, market conditions shift, life happens. Re-run the calculator each January and adjust your monthly contribution to stay on track.' },
      ]} />

      <CalcFAQ items={faqItems} guideLink="/blog/compound-interest-guide" />

      <CalcRelatedGrid items={relatedCalcs} />
    </>
  );
}
