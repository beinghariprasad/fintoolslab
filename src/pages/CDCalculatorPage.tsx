import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CDCalculator } from '@/components/calculators/CDCalculator';
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
    q: "Is CD interest taxed?",
    a: "Yes. CD interest is taxed as ordinary income at your federal (and usually state) rate in the year it's credited — even if you don't withdraw it. Your bank sends a 1099-INT for any account earning $10 or more. A $10,000 CD at 4.5% APY generates $450 of taxable interest in year one; in the 22% bracket that's about $99 of federal tax. CDs held inside an IRA defer that tax until withdrawal.",
  },
  {
    q: "What is the difference between APY and APR on a CD?",
    a: "APR is the nominal annual rate before compounding; APY is what you actually earn after compounding. A 4.40% APR compounded daily works out to about 4.50% APY. Banks are required to advertise APY on deposits, so you can compare CDs directly on APY without worrying whether one compounds daily and another monthly — the APY already accounts for it.",
  },
  {
    q: "How does the early-withdrawal penalty work?",
    a: "Most banks charge a penalty equal to a fixed number of months of interest — commonly 3 months on terms under a year, 6 to 12 months on longer CDs. Breaking a $10,000 CD at 4.5% APY with a 6-month penalty forfeits roughly $220. If you haven't yet earned that much interest, some banks deduct the difference from principal. Always check the penalty terms before funding a long CD.",
  },
  {
    q: "What is a CD ladder and why build one?",
    a: "A ladder splits your money across CDs of staggered terms — for example $5,000 each into 1, 2, 3, 4, and 5-year CDs. One rung matures every year, giving you annual access to a fifth of your money without penalties, while the longer rungs lock in higher-term rates. As each rung matures you reinvest it into a new 5-year CD, so eventually every dollar earns the long-term rate but a rung still matures annually.",
  },
  {
    q: "Are CDs FDIC insured?",
    a: "Yes — CDs at FDIC-member banks are insured up to $250,000 per depositor, per bank, per ownership category (NCUA provides equivalent coverage at credit unions). If you're laddering more than $250,000, spread rungs across multiple banks to keep every dollar inside the insurance limit. Brokered CDs are also covered, but confirm the issuing bank before buying.",
  },
  {
    q: "CD vs high-yield savings — which should I choose?",
    a: "A CD locks a fixed rate for its full term; a high-yield savings account pays a variable rate you can access anytime. If the Fed cuts rates, your CD keeps paying its locked rate while HYSA yields fall. If rates rise, the HYSA follows the market up but your CD stays put. A common compromise: keep your emergency fund in an HYSA and ladder money you won't need for 1–5 years into CDs.",
  },
];

const relatedItems = [
  {
    name: "HYSA Calculator",
    desc: "Project high-yield savings growth with monthly deposits.",
    mark: "HY",
    href: "/calculators/hysa",
    cat: "Saving",
    time: "30 sec",
  },
  {
    name: "Savings Goal",
    desc: "Reverse-engineer the monthly deposit needed for a target.",
    mark: "SV",
    href: "/calculators/savings",
    cat: "Saving",
    time: "30 sec",
  },
  {
    name: "Compound Interest",
    desc: "See how interest compounds on any balance over time.",
    mark: "CI",
    href: "/calculators/compound-interest",
    cat: "Investing",
    time: "30 sec",
  },
  {
    name: "Retirement Planner",
    desc: "Project the nest egg you'll have and what it produces.",
    mark: "RT",
    href: "/calculators/retirement",
    cat: "Planning",
    time: "2 min",
  },
];

const railItems = [
  { name: "HYSA Calculator", desc: "High-yield savings growth", mark: "HY", href: "/calculators/hysa" },
  { name: "Savings Goal", desc: "Monthly deposit for any target", mark: "SV", href: "/calculators/savings" },
  { name: "Compound Interest", desc: "See how interest compounds", mark: "CI", href: "/calculators/compound-interest" },
  { name: "RMD Calculator", desc: "Required minimum distributions", mark: "RM", href: "/calculators/rmd" },
];

export default function CDCalculatorPage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>CD Calculator with Ladder Builder - Free | Fin Tools Lab</title>
        <meta
          name="description"
          content="Calculate CD interest from APY for any term, estimate early-withdrawal penalties, and build a 4-5 rung CD ladder with maturity schedule and blended yield. Free."
        />
        <meta name="keywords" content="CD calculator, certificate of deposit calculator, CD ladder calculator, CD interest calculator, APY calculator, early withdrawal penalty" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/cd" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/cd" />
        <meta property="og:title" content="CD Calculator with Ladder Builder - Free CD Interest Calculator" />
        <meta property="og:description" content="Calculate CD interest from APY, estimate early-withdrawal penalties, and build a CD ladder with maturity schedule and blended yield." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/cd" />
        <meta property="twitter:title" content="CD Calculator with Ladder Builder - Free CD Interest Calculator" />
        <meta property="twitter:description" content="Calculate CD interest from APY, estimate early-withdrawal penalties, and build a CD ladder with maturity schedule and blended yield." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "CD Calculator with Ladder Builder",
            "description": "Free certificate of deposit calculator with APY-based interest math, early-withdrawal penalty estimator, and CD ladder builder",
            "url": "https://fintoolslab.com/calculators/cd",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
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
              { "@type": "ListItem", "position": 3, "name": "CD Calculator", "item": "https://fintoolslab.com/calculators/cd" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Saving · 30-second setup"
        title={<>CD <em>calculator</em></>}
        lede="Enter a deposit, APY, and term to see exactly what a certificate of deposit pays at maturity — then switch to ladder mode to stagger 4–5 CDs so one matures every year."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "CD Calculator" },
        ]}
        workedExample={{
          amount: "10,450",
          label: "Value at maturity · $10,000 CD, 4.50% APY, 12 months",
          features: [
            "$450 interest, guaranteed by the fixed rate",
            "APY already includes compounding",
            "6-month early-withdrawal penalty ≈ $220",
            "FDIC insured up to $250,000",
          ],
        }}
      />

      <CalcShortAnswer heading="What is a CD calculator?">
        <strong>A CD calculator</strong> shows what a certificate of deposit will be worth at maturity: deposit × (1 + APY) raised to the term in years. Because banks quote APY — which already includes compounding — a $10,000 CD at 4.50% APY is worth exactly $10,450 after 12 months and $10,682.54 after 18 months, no matter whether the bank compounds daily or monthly. Ladder mode splits a lump sum across staggered terms so a rung matures every year.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <CDCalculator />
        </div>
      </section>

      <AdSlot size="leaderboard" />

      <section style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div className="cp-split">
            <div>{schedule && <CalcBreakdown
              schedule={schedule}
              columns={[
                { key: 'contributed', label: 'Deposit' },
                { key: 'interest', label: 'Interest earned', accent: true },
                { key: 'balance', label: 'Value' },
              ]}
              yearKey="p"
              yearFormat={(r) => (r.rung ? `Rung ${r.rung} · ${r.months} mo` : `Month ${r.p}`)}
              shareKey="interest"
              shareBase="balance"
              shareLabel="Interest share"
              title={<>The <em>growth schedule</em>.</>}
              csvFilename="cd-breakdown"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>Why CD math starts with <em>APY</em>, not APR.</>}
        paragraphs={[
          "Banks are required to advertise deposit accounts using APY — annual percentage yield — which already bakes in the effect of compounding. That makes CD math simpler than most people expect: the value at maturity is just your deposit multiplied by (1 + APY) raised to the term in years. A $10,000 CD at 4.50% APY is worth $10,450.00 after one year, $10,682.54 after 18 months, and a $10,000 five-year CD at 4.00% APY grows to $12,166.53. You never need to know whether the bank credits interest daily or monthly — two CDs with the same APY pay the same dollar amount.",
          "APR is different: it's the nominal rate before compounding. If a bank quotes 4.40% APR compounded daily, the effective yield is (1 + 0.044/365)^365 − 1 ≈ 4.50% APY. The converter in the calculator handles this so you can compare a credit-union APR quote against an online bank's APY quote on equal footing.",
          "The catch with CDs is liquidity. Withdraw early and most banks charge a penalty of 3–12 months of interest — about $220 on that $10,000 CD at 4.5% with a 6-month penalty. A ladder solves this: split $25,000 into five $5,000 rungs maturing in 1 through 5 years and one rung comes due every year. At today's rates (roughly 4.4% on 1-year down to 3.85% on 5-year), that ladder blends to about 4.06% APY and grows to roughly $28,134 if every rung is held to maturity.",
        ]}
        formulaLabel="Value at maturity"
        formulaDisplay={<>V = P (1 + APY)<sup>t</sup></>}
        legend={[
          { symbol: "V", label: "Maturity value", desc: "what the CD is worth when the term ends" },
          { symbol: "P", label: "Principal", desc: "your opening deposit" },
          { symbol: "APY", label: "Annual percentage yield", desc: "the advertised rate — compounding already included" },
          { symbol: "t", label: "Term in years", desc: "months ÷ 12 (an 18-month CD is t = 1.5)" },
        ]}
      />

      <CalcTips items={[
        { title: 'Compare on APY, never APR.', text: "APY includes compounding; APR doesn't. A 4.40% APR compounded daily beats a 4.45% APY quote — it's really 4.50% APY. Use the built-in converter before comparing offers." },
        { title: 'Check the penalty before the rate.', text: 'A 5-year CD with a 12-month interest penalty can cost more to break than the extra yield is worth. On $10,000 at 4%, twelve months of interest is about $400 forfeited.' },
        { title: 'Ladder money you might need.', text: "A 5-rung ladder gives you penalty-free access to 20% of the money every year while most of it earns longer-term rates. It's the standard fix for CD lock-up risk." },
        { title: 'Mind the $250K FDIC line.', text: 'Insurance is $250,000 per depositor, per bank. Laddering $400K? Put rungs at two different banks so every dollar stays covered.' },
        { title: 'Watch the auto-renewal trap.', text: 'Most CDs auto-renew at maturity into the same term at the then-current rate, which is often worse. Calendar the maturity date — grace periods are typically only 7-10 days.' },
        { title: 'CDs shine when rates are falling.', text: 'A CD locks today’s rate for years; HYSA rates float down with every Fed cut. If cuts are expected, lengthening your ladder locks the yield in.' },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
