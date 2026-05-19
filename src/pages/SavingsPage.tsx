import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SavingsCalculatorMini } from '@/components/calculators/SavingsCalculatorMini';
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
    q: "How do I find the best high-yield savings account rate?",
    a: "Online banks consistently offer higher APYs than traditional brick-and-mortar banks because they carry lower overhead costs. Compare current rates at sites like Bankrate or NerdWallet, look for FDIC-insured accounts with no minimum balance requirements, and confirm there are no monthly maintenance fees that would eat into your interest.",
  },
  {
    q: "What is APY and how is it different from APR?",
    a: "APY (Annual Percentage Yield) reflects the actual return on your savings after accounting for compounding within the year. APR (Annual Percentage Rate) is the stated rate without compounding. A savings account with a 4.5% APR compounded monthly has a slightly higher effective APY. Always compare savings accounts by APY for an apples-to-apples comparison.",
  },
  {
    q: "How large should my emergency fund be?",
    a: "Most financial planners recommend 3–6 months of essential living expenses — rent, food, utilities, insurance — in a liquid, FDIC-insured account. Freelancers, single-income households, and people in volatile industries should target 6–12 months. Start with a $1,000 starter fund if you have none, then build toward the full target systematically.",
  },
  {
    q: "Should I pay off debt or save at the same time?",
    a: "The math favors paying off high-interest debt (credit cards at 20%+) before saving beyond a small emergency buffer, because no savings account can match that guaranteed return. For low-interest debt (student loans at 4–6%), it often makes sense to do both simultaneously — maintain your emergency fund and invest for the long term while making minimums on the low-rate debt.",
  },
  {
    q: "How does compound interest help my savings grow?",
    a: "Compound interest means you earn interest on your interest. If you have $10,000 at 4.5% APY, you earn $450 in year one. In year two you earn 4.5% on $10,450 — adding $470. Each year the base grows, accelerating your returns. The effect is small at first and large later, which is why starting sooner — even with small amounts — matters so much.",
  },
  {
    q: "What is the savings rate formula used here?",
    a: "The calculator solves for the periodic payment (PMT) needed to reach a future value (FV), given your current balance, interest rate, and time horizon. It uses the standard annuity formula rearranged to isolate PMT. Interest compounding frequency — monthly by default — is factored in, so the required deposit will be slightly lower than a simple division would suggest.",
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
    name: "Investment Growth",
    desc: "Project how a lump sum or contributions grow with returns.",
    mark: "IV",
    href: "/calculators/investment",
    cat: "Investing",
    time: "1 min",
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
  { name: "Retirement Planner", desc: "Project your nest egg at 65", mark: "RT", href: "/calculators/retirement" },
  { name: "Investment Growth", desc: "Model portfolio performance", mark: "IV", href: "/calculators/investment" },
  { name: "Loan Calculator", desc: "Payment schedules & interest", mark: "LN", href: "/calculators/loan" },
];

export default function SavingsPage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>Savings Goal Calculator - Monthly Deposit Planner | Fin Tools Lab</title>
        <meta
          name="description"
          content="Reverse-engineer the monthly deposit you need to hit any savings target. Factor in your current balance and expected interest rate with our free savings goal calculator."
        />
        <meta name="keywords" content="savings calculator, savings goal, monthly savings, emergency fund calculator, how much to save, savings plan" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/savings" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/savings" />
        <meta property="og:title" content="Savings Goal Calculator - Monthly Deposit Planner" />
        <meta property="og:description" content="Reverse-engineer the monthly deposit you need to hit any savings target with our free calculator." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/savings" />
        <meta property="twitter:title" content="Savings Goal Calculator - Monthly Deposit Planner" />
        <meta property="twitter:description" content="Reverse-engineer the monthly deposit you need to hit any savings target with our free calculator." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Savings Goal Calculator",
            "description": "Free savings calculator for goal planning and monthly deposit calculation",
            "url": "https://fintoolslab.com/calculators/savings",
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
              { "@type": "ListItem", "position": 3, "name": "Savings goal", "item": "https://fintoolslab.com/calculators/savings" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Saving · 30-second setup"
        title={<>Savings goal <em>calculator</em></>}
        lede="Reverse-engineer the monthly deposit you need to hit any savings target. Factor in your current balance and expected interest rate."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Savings goal" },
        ]}
        workedExample={{
          amount: "425/mo",
          label: "To save $50K in 8 years at 4.5% APY",
          features: [
            "$0 current savings",
            "$50,000 savings target",
            "4.5% APY savings account",
            "8-year time horizon",
          ],
        }}
      />

      <CalcShortAnswer heading="What is a savings goal calculator?">
        <strong>A savings goal calculator</strong> inverts the future-value formula: instead of asking "what will I have," it asks "what monthly habit do I need" to hit a target by a specific date. It's the planning tool that actually changes behavior — because it gives you a number to commit to.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <SavingsCalculatorMini />
        </div>
      </section>

      <AdSlot size="leaderboard" />

      <section style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div className="cp-split">
            <div>{schedule && <CalcBreakdown
              schedule={schedule}
              columns={[
                { key: 'contributed', label: 'Deposits' },
                { key: 'interest', label: 'Interest', accent: true },
                { key: 'balance', label: 'Balance' },
              ]}
              shareKey="interest"
              shareLabel="Interest share"
              title={<>The <em>full breakdown</em>.</>}
              csvFilename="savings-goal-breakdown"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>The required-deposit <em>formula</em> that works backwards from your goal.</>}
        paragraphs={[
          "Standard savings calculators show you how much you'll have given a deposit. This calculator inverts the problem — you tell it your target and timeline, and it tells you the exact monthly deposit required, accounting for interest earned along the way.",
          "Because interest compounds on your growing balance each month, the required deposit is slightly lower than simply dividing the gap by the number of months. The bigger the interest rate or the longer the timeline, the more pronounced this effect.",
        ]}
        formulaLabel="Required monthly deposit"
        formulaDisplay={<>PMT = FV × r / [(1+r)<sup>n</sup> − 1]</>}
        legend={[
          { symbol: "PMT", label: "Monthly deposit", desc: "the amount you need to save each period" },
          { symbol: "FV", label: "Future value", desc: "your savings target (goal amount minus current balance)" },
          { symbol: "r", label: "Monthly rate", desc: "annual APY divided by 12" },
          { symbol: "n", label: "Total periods", desc: "years to goal multiplied by 12" },
        ]}
      />

      <CalcTips items={[
        { title: 'Park it in a HYSA.', text: 'At 4-5% APY (top high-yield savings in 2026), a $20K balance earns ~$80/mo just sitting there. See our rates table for current top accounts.' },
        { title: 'Automate the transfer.', text: 'Set the monthly amount to auto-debit on payday. Friction is the enemy of consistency.' },
        { title: 'Two accounts for two goals.', text: 'Mixing an emergency fund with a vacation pot leads to spending the wrong dollars. Separate accounts, separate names.' },
        { title: 'Recalc every 6 months.', text: 'Income changed? Rate dropped? Goal date moved? Re-run the calculator quarterly to keep your monthly number honest.' },
        { title: 'Round up to a nice number.', text: 'If the math says $742/mo, save $800. The buffer absorbs slippage and builds finishing momentum.' },
        { title: 'Add a 10% buffer for cars and weddings.', text: "Goal amounts always understate. Build a 5-15% buffer into the target before calculating — easier to overshoot than to come up short." },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
