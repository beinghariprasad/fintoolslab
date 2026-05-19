import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MortgageCalculatorMini } from '@/components/calculators/MortgageCalculatorMini';
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
    q: "What is the difference between a fixed and adjustable-rate mortgage?",
    a: "A fixed-rate mortgage keeps the same interest rate for the life of the loan, giving you predictable monthly payments. An adjustable-rate mortgage (ARM) starts with a lower rate that can change periodically based on a market index. Fixed rates offer stability; ARMs can save money early but carry rate-change risk after the initial period.",
  },
  {
    q: "Should I choose a 15-year or 30-year mortgage?",
    a: "A 30-year mortgage has lower monthly payments but costs significantly more in total interest. A 15-year mortgage builds equity twice as fast and can save tens of thousands in interest, but the higher payment requires a stronger monthly budget. Run both scenarios in the calculator to see the exact trade-off for your loan amount.",
  },
  {
    q: "What is PMI and how do I avoid it?",
    a: "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home's purchase price. It protects the lender — not you — and typically costs 0.5–1% of the loan amount annually. You can avoid PMI by putting 20% down, or you can request cancellation once you reach 20% equity through payments or appreciation.",
  },
  {
    q: "What closing costs should I budget for?",
    a: "Closing costs typically run 2–5% of the loan amount and include origination fees, appraisal, title insurance, attorney fees, prepaid taxes, and homeowners insurance. On a $350,000 home that's $7,000–$17,500 in addition to your down payment. Ask lenders for a Loan Estimate early so you can compare.",
  },
  {
    q: "When does refinancing make sense?",
    a: "Refinancing makes sense when you can lower your interest rate by at least 0.5–1%, plan to stay in the home long enough to recoup closing costs, or want to switch from an ARM to a fixed rate. Divide your total closing costs by your monthly savings to find your break-even point. If you'll stay past that point, refinancing likely pays off.",
  },
  {
    q: "How much does making extra principal payments save?",
    a: "Even one extra payment per year on a 30-year mortgage can shave 4–5 years off the loan and save thousands in interest. Extra payments go directly to principal, reducing the balance on which interest accrues each month. Use the amortization table in the calculator to model any extra payment scenario.",
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
    name: "Loan Calculator",
    desc: "Monthly payments and amortization for personal and auto loans.",
    mark: "LN",
    href: "/calculators/loan",
    cat: "Borrowing",
    time: "30 sec",
  },
  {
    name: "Rent vs. Buy",
    desc: "Compare the true 10-year cost of renting against buying.",
    mark: "RB",
    href: "/calculators/rent-vs-buy",
    cat: "Real estate",
    time: "2 min",
  },
  {
    name: "Investment Growth",
    desc: "Project how a lump sum or contributions grow with returns.",
    mark: "IV",
    href: "/calculators/investment",
    cat: "Investing",
    time: "1 min",
  },
];

const railItems = [
  { name: "Compound Interest", desc: "See how interest compounds over time", mark: "CI", href: "/calculators/compound-interest" },
  { name: "Loan Calculator", desc: "Personal & auto loan payments", mark: "LN", href: "/calculators/loan" },
  { name: "Rent vs. Buy", desc: "Compare renting against buying", mark: "RB", href: "/calculators/rent-vs-buy" },
  { name: "Investment Growth", desc: "Project portfolio growth", mark: "IV", href: "/calculators/investment" },
];

export default function MortgagePage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>Mortgage Calculator - Free Home Loan Payment Calculator | Fin Tools Lab</title>
        <meta
          name="description"
          content="Calculate mortgage payments, total interest, and amortization schedules. Free mortgage calculator with PMI, property tax, and insurance calculations."
        />
        <meta name="keywords" content="mortgage calculator, home loan calculator, mortgage payment, interest rate, down payment, PMI calculator" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/mortgage" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/mortgage" />
        <meta property="og:title" content="Mortgage Calculator - Free Home Loan Payment Calculator" />
        <meta property="og:description" content="Calculate mortgage payments, total interest, and amortization schedules with our free mortgage calculator." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/mortgage" />
        <meta property="twitter:title" content="Mortgage Calculator - Free Home Loan Payment Calculator" />
        <meta property="twitter:description" content="Calculate mortgage payments, total interest, and amortization schedules with our free mortgage calculator." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mortgage Calculator",
            "description": "Free mortgage calculator with PMI, property tax, and insurance calculations",
            "url": "https://fintoolslab.com/calculators/mortgage",
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
              { "@type": "ListItem", "position": 3, "name": "Mortgage", "item": "https://fintoolslab.com/calculators/mortgage" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Borrowing · 1-minute setup"
        title={<>Mortgage <em>calculator</em></>}
        lede="Enter your home price, down payment, interest rate and loan term to see your monthly payment breakdown including principal, interest, taxes and insurance."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Mortgage" },
        ]}
        workedExample={{
          amount: "1,687",
          label: "Monthly payment · $350K home, 20% down, 6.5% rate, 30-yr",
          features: [
            "$280,000 loan after 20% down",
            "6.5% annual interest rate",
            "360 monthly payments",
            "Principal + interest only",
          ],
        }}
      />

      <CalcShortAnswer heading="What is a mortgage calculator?">
        <strong>A mortgage calculator</strong> tells you what a home will actually cost you each month — principal and interest, plus property tax and insurance — and shows how the split between interest and principal shifts over the life of the loan. Move the sliders to model different prices, down payments, and rates side by side.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <MortgageCalculatorMini />
        </div>
      </section>

      <AdSlot size="leaderboard" />

      <section style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div className="cp-split">
            <div>{schedule && <CalcBreakdown
              schedule={schedule}
              columns={[
                { key: 'principal', label: 'Principal paid' },
                { key: 'interest', label: 'Interest paid', accent: true },
                { key: 'balance', label: 'Remaining' },
              ]}
              shareKey="interest"
              shareBase={['principal', 'interest']}
              shareLabel="Interest share"
              title={<>The <em>full breakdown</em>.</>}
              csvFilename="mortgage-breakdown"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>The payment <em>formula</em> behind every mortgage.</>}
        paragraphs={[
          "Every fixed-rate mortgage payment is calculated with the same formula. It spreads your principal evenly across the loan term while front-loading interest — so early payments are mostly interest and later payments are mostly principal.",
          "Property taxes, homeowners insurance, and PMI are added on top of this base payment. They don't shrink over time like the interest component does.",
        ]}
        formulaLabel="Monthly principal & interest"
        formulaDisplay={<>M = P[r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> − 1]</>}
        legend={[
          { symbol: "M", label: "Monthly payment", desc: "principal + interest portion of your monthly bill" },
          { symbol: "P", label: "Loan principal", desc: "home price minus your down payment" },
          { symbol: "r", label: "Monthly rate", desc: "annual interest rate divided by 12" },
          { symbol: "n", label: "Total payments", desc: "loan term in years multiplied by 12" },
        ]}
      />

      <CalcTips items={[
        { title: 'Aim for under 28% of gross income.', text: "If PITI plus HOA exceeds 28% of your pretax monthly income, you're likely house-poor. Lenders will go higher; that doesn't mean you should." },
        { title: 'Run the numbers at +1%.', text: "Rate volatility is the single biggest variable. Always model your payment at a rate 0.5-1% above today's, so a slow lock doesn't break the budget." },
        { title: "Don't sleep on tax + insurance.", text: 'Property tax and homeowners insurance often add $400-800/mo to a payment. The headline P&I figure understates real cost.' },
        { title: 'Extra $200/mo = years off.', text: '$200/month extra on a 30-yr loan at 6.5% knocks roughly 6 years off and saves $80K+ in interest. Try it in the calculator.' },
        { title: "20% down isn't always optimal.", text: 'Putting more down avoids PMI but reduces liquidity. Run the scenario at 10% with PMI and invest the difference — sometimes that wins.' },
        { title: "Refi math is sensitivity, not certainty.", text: "Refinancing usually pays off if you'll save more in interest than the closing costs over your expected stay. Use the calc to check your specific break-even." },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
