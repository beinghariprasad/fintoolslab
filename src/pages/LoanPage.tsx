import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { LoanCalculatorMini } from '@/components/calculators/LoanCalculatorMini';
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
    q: "What is the difference between a personal loan and an auto loan?",
    a: "Auto loans are secured by the vehicle, which lets lenders offer lower interest rates (typically 5–10%). Personal loans are unsecured — no collateral — so rates run higher (8–20%+). If the vehicle is repossessed, the loan is covered; with a personal loan the lender has no such fallback, hence the premium. Use the type that matches your purpose and qualifications.",
  },
  {
    q: "How do extra payments shorten my loan?",
    a: "Any payment above the required minimum goes straight to reducing principal. A lower principal means less interest accrues in subsequent months, so a larger share of each future payment retires principal — and the cycle accelerates. Even an extra $50 per month on a 5-year loan can cut the payoff time by several months and save hundreds in interest.",
  },
  {
    q: "Should I choose a longer or shorter loan term?",
    a: "Longer terms mean lower monthly payments but you pay significantly more interest over the life of the loan. Shorter terms have higher payments but cost less overall. A practical approach: choose the shortest term whose payment comfortably fits your budget, then make extra payments when cash flow allows.",
  },
  {
    q: "How does my credit score affect the interest rate I'm offered?",
    a: "Lenders use credit scores to price risk. Borrowers with scores above 750 typically qualify for the lowest advertised rates; those in the 620–680 range may pay 3–6% more. Improving your score before applying — by paying down balances and resolving errors — can save thousands over a multi-year loan term. Check your score before shopping.",
  },
  {
    q: "Are there prepayment penalties I should watch for?",
    a: "Some lenders charge a fee if you pay off a loan early, because they lose the expected interest income. These penalties are most common on personal loans and some auto loans. Before signing, check the terms for any prepayment or early-termination fee. Loans from credit unions and online lenders often have none.",
  },
  {
    q: "What is APR and how is it different from the interest rate?",
    a: "The interest rate is the cost of borrowing the principal, expressed annually. APR (Annual Percentage Rate) includes the interest rate plus any mandatory fees — origination, processing — expressed as a single annualized figure. APR is the better number for comparing offers from different lenders because it captures the true cost of the loan.",
  },
];

const relatedItems = [
  {
    name: "Mortgage Calculator",
    desc: "Monthly payment breakdown including principal, interest, and taxes.",
    mark: "MG",
    href: "/calculators/mortgage",
    cat: "Borrowing",
    time: "1 min",
  },
  {
    name: "Compound Interest",
    desc: "See how interest compounds on any balance over time.",
    mark: "CI",
    href: "/calculators/compound-interest",
    cat: "Savings",
    time: "30 sec",
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
    name: "Investment Growth",
    desc: "Project how a lump sum or contributions grow with returns.",
    mark: "IV",
    href: "/calculators/investment",
    cat: "Investing",
    time: "1 min",
  },
];

const railItems = [
  { name: "Mortgage Calculator", desc: "Home loan payment breakdown", mark: "MG", href: "/calculators/mortgage" },
  { name: "Compound Interest", desc: "See how interest compounds", mark: "CI", href: "/calculators/compound-interest" },
  { name: "Savings Goal", desc: "Reverse a target into a habit", mark: "SV", href: "/calculators/savings" },
  { name: "Retirement Planner", desc: "Project your nest egg", mark: "RT", href: "/calculators/retirement" },
];

export default function LoanPage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>Loan Calculator - Personal & Auto Loan Payment Calculator | Fin Tools Lab</title>
        <meta
          name="description"
          content="Calculate monthly payments, total interest and amortization for personal loans, auto loans and more. Free loan calculator with extra payment analysis."
        />
        <meta name="keywords" content="loan calculator, personal loan calculator, auto loan calculator, loan payment, amortization schedule, extra payments" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/loan" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/loan" />
        <meta property="og:title" content="Loan Calculator - Personal & Auto Loan Payment Calculator" />
        <meta property="og:description" content="Calculate monthly payments, total interest and amortization for any loan with our free loan calculator." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/loan" />
        <meta property="twitter:title" content="Loan Calculator - Personal & Auto Loan Payment Calculator" />
        <meta property="twitter:description" content="Calculate monthly payments, total interest and amortization for any loan with our free loan calculator." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Loan Calculator",
            "description": "Free loan calculator for personal, auto, and other loan types",
            "url": "https://fintoolslab.com/calculators/loan",
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
              { "@type": "ListItem", "position": 3, "name": "Loan", "item": "https://fintoolslab.com/calculators/loan" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Borrowing · 30-second setup"
        title={<>Loan payment <em>calculator</em></>}
        lede="Calculate monthly payments, total interest and amortization for personal loans, auto loans and more."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Loan" },
        ]}
        workedExample={{
          amount: "483",
          label: "Monthly payment · $25K loan, 5.5% rate, 5 years",
          features: [
            "$25,000 loan principal",
            "5.5% annual interest rate",
            "60 monthly payments",
            "$3,980 total interest",
          ],
        }}
      />

      <CalcShortAnswer heading="What is a loan calculator?">
        <strong>A loan calculator</strong> works out the fixed monthly payment for any installment loan — auto, personal, student — using the standard amortization formula. It also reveals what most people miss: how much interest you'll pay in total, and how dramatically an extra $25-50/month can shrink that number.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <LoanCalculatorMini />
        </div>
      </section>

      <AdSlot size="leaderboard" />

      <section style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div className="cp-split">
            <div>{schedule && <CalcBreakdown
              schedule={schedule}
              columns={[
                { key: 'principalPaid', label: 'Principal paid' },
                { key: 'interestPaid', label: 'Interest paid', accent: true },
                { key: 'balance', label: 'Remaining' },
              ]}
              shareKey="interestPaid"
              shareBase={['principalPaid', 'interestPaid']}
              shareLabel="Interest share"
              title={<>The <em>full breakdown</em>.</>}
              csvFilename="loan-amortization-breakdown"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>The installment <em>formula</em> behind every loan payment.</>}
        paragraphs={[
          "All fixed-payment installment loans — personal, auto, student — use the same annuity formula. It calculates the payment that, when repeated for every period, exactly repays both principal and interest by the final due date.",
          "In the early months almost all of your payment is interest. As the principal falls, less interest accrues each period and more of your payment chips away at the balance. The amortization table in the calculator shows this shift month by month.",
        ]}
        formulaLabel="Fixed monthly payment"
        formulaDisplay={<>PMT = PV × r / [1 − (1+r)<sup>−n</sup>]</>}
        legend={[
          { symbol: "PMT", label: "Monthly payment", desc: "the fixed amount due each period" },
          { symbol: "PV", label: "Present value", desc: "the original loan amount (principal)" },
          { symbol: "r", label: "Monthly rate", desc: "annual interest rate divided by 12" },
          { symbol: "n", label: "Total payments", desc: "loan term in years multiplied by 12" },
        ]}
      />

      <CalcTips items={[
        { title: 'Compare total interest, not monthly payment.', text: "A 7-year loan looks cheaper monthly but costs thousands more in interest. Always compute lifetime cost." },
        { title: '$50 extra/month is real money.', text: "On a 5-year, $25K loan at 8.5%, $50/mo extra saves ~$400 in interest and shortens payoff by 5 months." },
        { title: 'Rate matters more than you think.', text: "A 1% rate difference on a $30K loan over 5 years is ~$800 in interest. Shop with three lenders minimum." },
        { title: "Avoid 'add-on' interest.", text: "Some subprime auto loans use add-on interest, which doesn't decrease as principal does. Always confirm 'simple interest' or 'amortizing'." },
        { title: 'Refinance when rates drop 1%+.', text: "If a refi can drop your rate by a full point or more and you'll keep the loan a while, the math usually works. Run both scenarios here." },
        { title: 'Watch the prepayment penalty.', text: 'Some loans charge a fee for early payoff. Read the disclosure before assuming extra payments are free.' },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
