import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { InvestmentCalculatorMini } from '@/components/calculators/InvestmentCalculatorMini';
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
    q: "What annual return rate should I use?",
    a: "The US stock market has returned roughly 10% annually before inflation over the long run, and about 7% after inflation. For a diversified portfolio of stocks and bonds, 6–8% is a reasonable planning assumption. Use a conservative rate (5–6%) for stress-testing and a moderate rate (7–8%) for your base case.",
  },
  {
    q: "How does dollar-cost averaging work?",
    a: "Dollar-cost averaging means investing a fixed amount on a regular schedule — say $300 every month — regardless of market conditions. When prices are low you buy more shares; when prices are high you buy fewer. Over time this smooths out your average purchase price and removes the pressure of trying to time the market.",
  },
  {
    q: "Should I invest a lump sum or contribute regularly?",
    a: "Research consistently shows that investing a lump sum immediately outperforms spreading it out over time in about two-thirds of historical periods, because markets rise more often than they fall. However, if investing the lump sum would cause you to sell during a downturn, a regular contribution schedule may suit your risk tolerance better.",
  },
  {
    q: "How do investment fees affect long-term returns?",
    a: "Fees compound just like returns — but in the wrong direction. A 1% annual expense ratio on a $100,000 portfolio can cost more than $30,000 over 20 years compared to a 0.05% index fund. Minimizing fees through low-cost index funds is one of the highest-certainty ways to improve long-term results.",
  },
  {
    q: "What is the difference between taxable and tax-advantaged accounts?",
    a: "Tax-advantaged accounts (401k, IRA, Roth IRA) let your investments grow without annual tax drag. Traditional accounts give you an upfront deduction; Roth accounts give you tax-free withdrawals. Taxable brokerage accounts offer more flexibility but dividends and realized gains are taxed each year. Prioritize tax-advantaged accounts before investing in taxable accounts.",
  },
  {
    q: "How often should I rebalance my portfolio?",
    a: "Most financial planners recommend reviewing your allocation annually or whenever one asset class drifts more than 5–10 percentage points from your target. Rebalancing too frequently generates unnecessary transaction costs and taxes; rebalancing too rarely lets risk creep up without your knowing. Annual rebalancing is a practical default for most investors.",
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
    name: "Retirement Planner",
    desc: "Project your nest egg at retirement with contributions and match.",
    mark: "RT",
    href: "/calculators/retirement",
    cat: "Planning",
    time: "2 min",
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
    name: "Mortgage Calculator",
    desc: "Monthly payment breakdown for any home loan.",
    mark: "MG",
    href: "/calculators/mortgage",
    cat: "Borrowing",
    time: "1 min",
  },
];

const railItems = [
  { name: "Compound Interest", desc: "See how interest compounds over time", mark: "CI", href: "/calculators/compound-interest" },
  { name: "Retirement Planner", desc: "Project your nest egg at 65", mark: "RT", href: "/calculators/retirement" },
  { name: "Savings Goal", desc: "Reverse a target into a habit", mark: "SV", href: "/calculators/savings" },
  { name: "Mortgage Calculator", desc: "Monthly payment breakdown", mark: "MG", href: "/calculators/mortgage" },
];

export default function InvestmentPage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>Investment Calculator - Portfolio Growth & Return Projections | Fin Tools Lab</title>
        <meta
          name="description"
          content="Model how a lump sum or regular contributions grow over time. Compare strategies and see the impact of different return assumptions with our free investment calculator."
        />
        <meta name="keywords" content="investment calculator, portfolio growth, investment returns, compound growth, lump sum calculator, regular contributions" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/investment" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/investment" />
        <meta property="og:title" content="Investment Calculator - Portfolio Growth & Return Projections" />
        <meta property="og:description" content="Model how a lump sum or regular contributions grow over time with our free investment calculator." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/investment" />
        <meta property="twitter:title" content="Investment Calculator - Portfolio Growth & Return Projections" />
        <meta property="twitter:description" content="Model how a lump sum or regular contributions grow over time with our free investment calculator." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Investment Calculator",
            "description": "Free investment calculator with portfolio growth and return projections",
            "url": "https://fintoolslab.com/calculators/investment",
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
              { "@type": "ListItem", "position": 3, "name": "Investment growth", "item": "https://fintoolslab.com/calculators/investment" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Investing · 1-minute setup"
        title={<>Investment growth <em>calculator</em></>}
        lede="Model how a lump sum or regular contributions grow over time. Compare strategies and see the impact of different return assumptions."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Investment growth" },
        ]}
        workedExample={{
          amount: "267,893",
          label: "Growth after 20 years · $25K start, $300/mo, 8% return",
          features: [
            "$25,000 initial lump sum",
            "$300 monthly contributions",
            "8% annual return",
            "20-year time horizon",
          ],
        }}
      />

      <CalcShortAnswer heading="What is an investment growth calculator?">
        <strong>An investment calculator</strong> models how an initial deposit and ongoing monthly contributions could compound over time, given an expected return and fund fees. It's the same math underlying every retirement projection — pared down so you can see exactly which inputs matter most.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <InvestmentCalculatorMini />
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
                { key: 'gains', label: 'Gains', accent: true },
                { key: 'balance', label: 'Portfolio value' },
              ]}
              shareKey="gains"
              shareLabel="Gains share"
              title={<>The <em>full breakdown</em>.</>}
              csvFilename="investment-growth-breakdown"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>The future value <em>formula</em> powering the projection.</>}
        paragraphs={[
          "The calculator combines two effects: compound growth on your existing balance, and the accumulated value of each regular contribution you make. Together they produce the future value shown in the chart.",
          "The key insight is that both components grow exponentially. Money invested earlier has more time to compound, which is why increasing contributions — or starting sooner — has an outsized effect in later years.",
        ]}
        formulaLabel="Future value with contributions"
        formulaDisplay={<>FV = PV(1+r)<sup>t</sup> + PMT × [(1+r)<sup>t</sup> − 1] / r</>}
        legend={[
          { symbol: "FV", label: "Future value", desc: "projected portfolio balance at end of period" },
          { symbol: "PV", label: "Present value", desc: "your initial lump-sum investment today" },
          { symbol: "r", label: "Rate per period", desc: "annual return divided by compounding periods per year" },
          { symbol: "t", label: "Periods", desc: "total number of compounding periods" },
          { symbol: "PMT", label: "Contribution", desc: "amount added each period (monthly, annual, etc.)" },
        ]}
      />

      <CalcTips items={[
        { title: 'Use 6-7% real, not 10% nominal.', text: "The S&P's nominal long-run return is ~10%, but 2-3% of that gets eaten by inflation. Plan in real dollars." },
        { title: 'Stay invested through the chop.', text: 'Missing the 10 best market days of a decade can cut your return by 50%+. The hard part of investing is doing nothing.' },
        { title: 'Fees of 1% = 30% of your money.', text: 'Over 40 years at 7% returns, a 1% fee swap-out (active to passive) typically grows your final balance by 25-30%.' },
        { title: 'Maximize tax-advantaged space first.', text: '401(k) match → HSA → Roth IRA → 401(k) max → taxable. The calculator works for all accounts; the wrapper matters.' },
        { title: 'Rebalance once a year.', text: 'Drifted to 80/20 stocks/bonds from a 70/30 target? Trim back. Forces buy-low/sell-high without market-timing.' },
        { title: 'Set it and forget it.', text: 'Automate the monthly contribution from your paycheck. The friction of manually transferring kills more portfolios than market crashes do.' },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
