import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CoastFireCalculator } from '@/components/calculators/CoastFireCalculator';
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
    q: "What is Coast FIRE?",
    a: "Coast FIRE is the point where your invested savings are large enough that compound growth alone — with zero further contributions — will carry them to your full retirement number by your target retirement age. Once you cross it, you only need to earn enough to cover your living expenses; retirement is already funded. It's the least extreme branch of the FIRE (Financial Independence, Retire Early) movement because you keep working, just without the pressure to save.",
  },
  {
    q: "How is the Coast FIRE number calculated?",
    a: "Two steps. First, your FIRE number: annual retirement spending divided by your safe withdrawal rate — $60,000 ÷ 4% = $1,500,000. Second, discount that back to today: Coast number = FIRE number ÷ (1 + real return)^years until retirement. With 35 years to go and a 4.1% real return (7% nominal minus ~2.8% inflation), $1.5M ÷ 1.041^35 ≈ $369,000. Have that invested at 30 and compounding alone reaches $1.5M in today's purchasing power by 65.",
  },
  {
    q: "Why does this calculator use real (inflation-adjusted) returns?",
    a: "So every number stays in today's dollars. If you discounted at the full nominal 7% while keeping spending fixed at today's $60,000, you'd understate the target — inflation means you'll actually need more than $1.5M in future dollars. Using the real return (roughly nominal minus inflation, precisely (1+nominal)/(1+inflation) − 1) keeps the spending, the FIRE number, and the coast number all consistent in today's purchasing power. It's the single most common error in DIY Coast FIRE math.",
  },
  {
    q: "What safe withdrawal rate should I use?",
    a: "The 4% rule, from the Trinity study, is the standard starting point: a portfolio can typically sustain withdrawals of 4% of its starting value (inflation-adjusted) for 30 years. Longer retirements argue for more caution — many early retirees use 3.25–3.5%, which raises the FIRE number substantially: at $60,000 spending, 4% needs $1.5M but 3.5% needs $1.71M. Drag the SWR slider to see how sensitive your coast number is to this single assumption.",
  },
  {
    q: "What happens after I reach Coast FIRE?",
    a: "You stop needing to save for retirement — not stop working. You could downshift to part-time, take a lower-stress job that just covers expenses, or keep saving anyway to retire earlier than planned. The math only requires that you never touch the invested balance and let it compound untouched until retirement. Many people treat Coast FIRE as a milestone that buys career flexibility rather than a signal to change anything immediately.",
  },
  {
    q: "Is Coast FIRE realistic if the market underperforms?",
    a: "The projection assumes a constant average return, but real markets deliver lumpy, sequence-dependent results. Build margin three ways: use a conservative real return (3.5–4.5% rather than 5%+), keep a modest contribution habit even after coasting, and re-run the numbers annually — if a bear market knocks your balance below the coast line, a few more contributing years restores it. Treat the coast number as a moving checkpoint, not a one-time finish line.",
  },
];

const relatedItems = [
  {
    name: "Retirement Planner",
    desc: "Project your full nest egg with ongoing contributions.",
    mark: "RT",
    href: "/calculators/retirement",
    cat: "Planning",
    time: "2 min",
  },
  {
    name: "Compound Interest",
    desc: "The engine behind coasting — see growth on any balance.",
    mark: "CI",
    href: "/calculators/compound-interest",
    cat: "Investing",
    time: "30 sec",
  },
  {
    name: "Savings Goal",
    desc: "Reverse-engineer the monthly deposit to reach your coast number.",
    mark: "SG",
    href: "/calculators/savings",
    cat: "Saving",
    time: "30 sec",
  },
  {
    name: "Investment Growth",
    desc: "Model lump sums and contributions over any horizon.",
    mark: "IV",
    href: "/calculators/investment",
    cat: "Investing",
    time: "1 min",
  },
];

const railItems = [
  { name: "Retirement Planner", desc: "Project your full nest egg", mark: "RT", href: "/calculators/retirement" },
  { name: "Compound Interest", desc: "See how compounding works", mark: "CI", href: "/calculators/compound-interest" },
  { name: "Savings Goal", desc: "Plan the deposit to hit your number", mark: "SG", href: "/calculators/savings" },
  { name: "Investment Growth", desc: "Model portfolio growth", mark: "IV", href: "/calculators/investment" },
];

export default function CoastFirePage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>Coast FIRE Calculator - When Can Compounding Fund Your Retirement? | Fin Tools Lab</title>
        <meta
          name="description"
          content="Calculate your Coast FIRE number in today's dollars. See whether your current savings can grow to your retirement number with zero further contributions, and the age you'll cross the line."
        />
        <meta name="keywords" content="coast fire calculator, coast fi calculator, coast fire number, financial independence calculator, fire number, safe withdrawal rate, 4% rule" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/coast-fire" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/coast-fire" />
        <meta property="og:title" content="Coast FIRE Calculator - When Can Compounding Fund Your Retirement?" />
        <meta property="og:description" content="Find the savings level where compound growth alone funds your retirement — all in today's dollars, with a year-by-year projection." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/coast-fire" />
        <meta property="twitter:title" content="Coast FIRE Calculator - When Can Compounding Fund Your Retirement?" />
        <meta property="twitter:description" content="Find the savings level where compound growth alone funds your retirement — all in today's dollars, with a year-by-year projection." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Coast FIRE Calculator",
            "description": "Free Coast FIRE calculator with inflation-adjusted math, coast age projection, and year-by-year breakdown",
            "url": "https://fintoolslab.com/calculators/coast-fire",
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
              { "@type": "ListItem", "position": 3, "name": "Coast FIRE", "item": "https://fintoolslab.com/calculators/coast-fire" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Planning · 1-minute setup"
        title={<>Coast FIRE <em>calculator</em></>}
        lede="Find the invested balance that lets compound growth fund your retirement with zero further contributions — and the age you'll cross that line at your current savings rate. Everything is expressed in today's dollars."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Coast FIRE" },
        ]}
        workedExample={{
          amount: "369,333",
          label: "Coast number at 30 · $60K spending, retire at 65",
          features: [
            "$1.5M FIRE number ($60K ÷ 4% rule)",
            "7% nominal return, 2.8% inflation",
            "≈ 4.1% real growth for 35 years",
            "Zero contributions needed after coasting",
          ],
        }}
      />

      <CalcShortAnswer heading="What is a Coast FIRE calculator?">
        <strong>A Coast FIRE calculator</strong> finds the invested balance that will grow to your full retirement number by itself — no more contributions — by your target retirement age. It divides your annual spending by a safe withdrawal rate to get your FIRE number, then discounts it back to today at your inflation-adjusted return. If your portfolio is above that line, retirement is already funded; you just have to leave it alone.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <CoastFireCalculator />
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
                { key: 'balance', label: 'Balance' },
                { key: 'coastTarget', label: 'Coast target', accent: true },
              ]}
              yearFormat={(r) => `Age ${r.age}`}
              shareKey="balance"
              shareBase="coastTarget"
              shareLabel="Coast progress"
              title={<>Your path to the <em>coast line</em>.</>}
              csvFilename="coast-fire-projection"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>Discounting your FIRE number <em>back to today</em>.</>}
        paragraphs={[
          "Coast FIRE math is two familiar formulas chained together. Your FIRE number is annual retirement spending divided by a safe withdrawal rate — the classic 4% rule turns $60,000 of spending into a $1,500,000 target. Your coast number is that target discounted back to today at your expected growth rate: whatever balance, compounded for the years you have left, lands exactly on the target.",
          "This calculator keeps every figure in today's dollars, which means the growth rate must be the real return — (1 + nominal) ÷ (1 + inflation) − 1, about 4.1% when markets return 7% and inflation runs 2.8%. Mixing today's spending with a nominal 7% discount is the classic mistake: it produces a coast number roughly 60% too low over a 35-year horizon, because it ignores that $1.5M in 2061 buys far less than $1.5M today.",
          "The discounting is why time is the dominant variable. At a 4.1% real return, a 25-year-old needs only about $302,000 to coast to a $1.5M retirement at 65, a 35-year-old needs about $451,000, and a 50-year-old needs about $822,000. Every decade you delay roughly halves the work compounding can do for you.",
        ]}
        formulaLabel="Coast FIRE number in today's dollars"
        formulaDisplay={<>Coast = (S ÷ SWR) / (1 + r)<sup>n</sup></>}
        legend={[
          { symbol: "S", label: "Annual spending", desc: "what retirement costs per year, in today's dollars" },
          { symbol: "SWR", label: "Safe withdrawal rate", desc: "typically 3.25–4% — S ÷ SWR is your FIRE number" },
          { symbol: "r", label: "Real return", desc: "nominal return adjusted for inflation, (1+nom)/(1+inf) − 1" },
          { symbol: "n", label: "Years to retirement", desc: "target retirement age minus your current age" },
        ]}
      />

      <CalcTips items={[
        { title: 'Use real returns, always.', text: 'A 7% nominal return with 2.8% inflation is a 4.1% real return. Discounting at 7% while keeping spending in today\'s dollars understates your coast number by ~60% over 35 years.' },
        { title: 'Stress-test the SWR.', text: 'Moving from 4% to 3.5% raises a $60K-spending FIRE number from $1.5M to $1.71M — and your coast number with it. Long early retirements deserve the conservative end.' },
        { title: 'Only invested money counts.', text: 'Home equity you live in and cash earning below inflation don\'t compound toward your target. Count brokerage, 401(k), IRA, and HSA balances.' },
        { title: 'Coasting is a checkpoint, not a cliff.', text: 'Crossing the line means retirement is funded if markets deliver your assumed return. Re-run the numbers yearly; a bear market can pull you back under the line.' },
        { title: 'Contributions still buy freedom.', text: 'After coasting, every extra dollar saved moves your retirement age earlier instead of funding the baseline. That\'s often worth more than the spending it displaces.' },
        { title: 'Spending is the biggest lever.', text: 'Cutting planned retirement spending by $10K/year cuts your FIRE number by $250K at a 4% SWR — and your coast number by the same proportion. No return assumption is that powerful.' },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
