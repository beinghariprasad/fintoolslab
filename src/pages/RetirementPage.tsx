import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { RetirementCalculatorMini } from '@/components/calculators/RetirementCalculatorMini';
import { CalcPageHero } from '@/components/calculators/CalcPageHero';
import { CalcExplainer } from '@/components/calculators/CalcExplainer';
import { CalcFAQ } from '@/components/calculators/CalcFAQ';
import { CalcRelatedGrid, RailCard } from '@/components/calculators/CalcRelated';
import { CalcBreakdown } from '@/components/calculators/CalcBreakdown';
import { CalcShortAnswer } from '@/components/calculators/CalcShortAnswer';
import { CalcTips } from '@/components/calculators/CalcTips';
import { AdSlot } from '@/components/ads/AdSlot';

const faqItems = [
  {
    q: "How much should I have saved at each age?",
    a: "A common rule of thumb from Fidelity: 1× your salary by 30, 3× by 40, 6× by 50, 8× by 60, and 10× by retirement at 67. These are rough benchmarks — your actual target depends on your expected retirement lifestyle, Social Security income, and planned retirement age. Use the planner to model your specific numbers.",
  },
  {
    q: "What is employer 401(k) matching and how do I maximize it?",
    a: "Many employers match a percentage of your 401(k) contributions — for example, 50 cents per dollar up to 6% of salary. If you earn $60,000 and contribute 6% ($3,600), your employer adds $1,800 — a guaranteed 50% instant return. Always contribute at least enough to capture the full match before directing money elsewhere.",
  },
  {
    q: "What is the 4% withdrawal rule?",
    a: "The 4% rule — from the 1994 Trinity Study — suggests you can withdraw 4% of your retirement portfolio in year one, then adjust for inflation annually, with a high probability your savings will last 30 years. With $1,247,300 saved, that's roughly $49,900 per year or $4,160 per month. The rule is a starting point; your mix of stocks, bonds, and other income matters.",
  },
  {
    q: "Traditional 401(k) vs. Roth 401(k) — which is better?",
    a: "Traditional contributions are pre-tax (you save now, pay tax at withdrawal). Roth contributions are after-tax (you pay now, withdraw tax-free). If you expect your tax rate to be higher in retirement than it is today — common early in a career — Roth is usually better. If you're in a high bracket now and expect lower income in retirement, traditional typically wins. Many planners recommend splitting contributions between both.",
  },
  {
    q: "How does inflation affect my retirement projections?",
    a: "At 2.5% annual inflation, purchasing power halves roughly every 28 years. A $5,000 monthly budget today requires about $9,300 in 30 years to buy the same things. The calculator's nominal return should be reduced by your inflation assumption to get the real (inflation-adjusted) growth rate. Social Security benefits are inflation-indexed, providing a partial hedge.",
  },
  {
    q: "When should I start drawing Social Security?",
    a: "You can claim Social Security as early as 62 (at a permanently reduced benefit) or as late as 70 (at a permanently increased benefit). Delaying from 62 to 70 increases your monthly benefit by roughly 77%. If you're in good health and have other assets to bridge the gap, delaying typically maximizes lifetime benefits — especially for the higher earner in a married couple.",
  },
];

const relatedItems = [
  {
    name: "Compound Interest",
    desc: "See how interest compounds on any balance over time.",
    mark: "CI",
    href: "/calculators/compound-interest",
    cat: "Savings",
    time: "30 sec",
  },
  {
    name: "Investment Growth",
    desc: "Project how a lump sum or contributions grow with returns.",
    mark: "IV",
    href: "/calculators/investment",
    cat: "Investing",
    time: "1 min",
  },
  {
    name: "Savings Goal",
    desc: "Reverse-engineer the monthly deposit needed to hit any target.",
    mark: "SV",
    href: "/calculators/savings",
    cat: "Saving",
    time: "30 sec",
  },
  {
    name: "Loan Calculator",
    desc: "Monthly payments and amortization for personal and auto loans.",
    mark: "LN",
    href: "/calculators/loan",
    cat: "Borrowing",
    time: "30 sec",
  },
];

const railItems = [
  { name: "Compound Interest", desc: "See how interest compounds over time", mark: "CI", href: "/calculators/compound-interest" },
  { name: "Investment Growth", desc: "Model portfolio performance", mark: "IV", href: "/calculators/investment" },
  { name: "Savings Goal", desc: "Reverse a target into a habit", mark: "SV", href: "/calculators/savings" },
  { name: "Loan Calculator", desc: "Payment schedules & interest", mark: "LN", href: "/calculators/loan" },
];

export default function RetirementPage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>Retirement Calculator - 401k & Retirement Planning | Fin Tools Lab</title>
        <meta
          name="description"
          content="Project what your nest egg will be at retirement age. See how contributions, employer match and market returns compound over decades with our free retirement planner."
        />
        <meta name="keywords" content="retirement calculator, 401k calculator, retirement planning, retirement savings, employer match, nest egg calculator" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/retirement" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/retirement" />
        <meta property="og:title" content="Retirement Calculator - 401k & Retirement Planning" />
        <meta property="og:description" content="Project your nest egg at retirement age with our free retirement planner." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/retirement" />
        <meta property="twitter:title" content="Retirement Calculator - 401k & Retirement Planning" />
        <meta property="twitter:description" content="Project your nest egg at retirement age with our free retirement planner." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Retirement Planner",
            "description": "Free retirement calculator with 401k, employer match, and comprehensive retirement planning",
            "url": "https://fintoolslab.com/calculators/retirement",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "softwareVersion": "1.0",
            "author": { "@type": "Organization", "name": "Fin Tools Lab" },
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map((item) => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": { "@type": "Answer", "text": item.a },
            })),
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fintoolslab.com" },
              { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://fintoolslab.com/calculators" },
              { "@type": "ListItem", "position": 3, "name": "Retirement", "item": "https://fintoolslab.com/calculators/retirement" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Planning · 2-minute setup"
        title={<>Retirement <em>planner</em></>}
        lede="Project what your nest egg will be at retirement age. See how contributions, employer match and market returns compound over decades."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Retirement" },
        ]}
        workedExample={{
          amount: "1,247,300",
          label: "At age 65 · $50K saved, $800/mo, 7% return, 30 years",
          features: [
            "$50,000 current savings",
            "$800 monthly contributions",
            "7% annual return",
            "30 years to retirement",
          ],
        }}
      />

      <CalcShortAnswer heading="What is a retirement calculator?">
        <strong>A retirement calculator</strong> projects what your savings will grow to by a target retirement age, and translates that nest egg into a safe monthly income using the well-known 4% withdrawal rule (or any rate you set). It's the simplest answer to: "Am I saving enough?"
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <RetirementCalculatorMini />
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
                { key: 'growth', label: 'Growth', accent: true },
                { key: 'balance', label: 'Nest egg' },
              ]}
              yearFormat={(row) => `Age ${row.age}`}
              shareKey="growth"
              shareLabel="Growth share"
              title={<>The <em>full breakdown</em>.</>}
              csvFilename="retirement-breakdown"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>The compounding <em>formula</em> that builds your nest egg.</>}
        paragraphs={[
          "Retirement balances grow through the same future-value mechanics as any investment: your existing savings compound each year, and each new contribution compounds for however many years remain before retirement.",
          "The power of long time horizons is stark. At 7% annual return, money doubles roughly every 10 years. A dollar saved at 35 is worth about twice as much at 65 as a dollar saved at 45. Starting — or increasing — contributions early has an outsized effect that the calculator makes visible.",
        ]}
        formulaLabel="Future value with ongoing contributions"
        formulaDisplay={<>FV = PV(1+r)<sup>t</sup> + PMT × [(1+r)<sup>t</sup> − 1] / r</>}
        legend={[
          { symbol: "FV", label: "Future value", desc: "projected retirement balance at your target age" },
          { symbol: "PV", label: "Present value", desc: "your current retirement savings balance" },
          { symbol: "r", label: "Rate per period", desc: "expected annual return divided by periods per year" },
          { symbol: "t", label: "Periods", desc: "total compounding periods until retirement" },
          { symbol: "PMT", label: "Contribution", desc: "amount you add each period, including employer match" },
        ]}
      />

      <CalcTips items={[
        { title: 'Save 15% of gross income.', text: 'Including employer match, 15% saved consistently from age 25 to 65 reliably hits retirement targets in most return scenarios.' },
        { title: 'Front-load when you can.', text: 'A dollar saved at 25 is worth roughly 10 dollars saved at 50, given long horizons and compound growth.' },
        { title: "Withdrawal rate is not income.", text: "A 4% withdrawal rate doesn't mean you can spend 4%. Taxes and inflation adjustments come out of that — net spending is usually closer to 3%." },
        { title: 'Account for healthcare.', text: 'Pre-Medicare retirement (before 65) requires private health insurance — budget $1.5-2.5K/mo per person for a couple in the US.' },
        { title: 'Sequence risk is real.', text: 'A bear market in your first 5 retirement years is far more dangerous than one later. Consider a higher cash buffer in early retirement.' },
        { title: 'Run the math at age 90.', text: "Plan for the full life expectancy. Running out of money at 85 isn't a 'risk' — it's a non-recoverable catastrophe. Bias toward conservative." },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
