import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { RMDCalculator } from '@/components/calculators/RMDCalculator';
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
    q: "What happens if I miss my RMD deadline?",
    a: "SECURE 2.0 sets the excise tax at 25% of the amount you failed to withdraw (down from the old 50%). If you fix the shortfall within the correction window — generally by the end of the second year after the miss, before the IRS assesses the tax — the penalty drops to 10%. You can also file Form 5329 and request a full waiver for reasonable cause. Missing a $20,000 RMD entirely could cost $5,000, so calendar the deadline: December 31 each year, or April 1 of the following year for your very first RMD.",
  },
  {
    q: "At what age do RMDs start in 2026?",
    a: "It depends on your birth year under SECURE 2.0. If you were born 1951–1959, RMDs begin at age 73. If you were born in 1960 or later, they begin at 75 — which means the first RMDs for that group arrive in 2035. Anyone born in 1950 or earlier is already past their required beginning date and simply continues annual RMDs.",
  },
  {
    q: "Which accounts require RMDs?",
    a: "Traditional IRAs, SEP and SIMPLE IRAs, and employer plans like 401(k), 403(b), and 457(b) accounts all require RMDs. Roth IRAs never require them during the owner's lifetime, and since 2024 Roth 401(k) accounts are also exempt. Each IRA's RMD is calculated separately but can be withdrawn from any combination of your IRAs; 401(k) RMDs must be taken from each plan separately. Still working past RMD age? Your current employer's 401(k) can often be deferred until you retire.",
  },
  {
    q: "How is my RMD actually calculated?",
    a: "Divide your account balance as of December 31 of the prior year by the IRS distribution period for your age in the current year. A 75-year-old with $500,000 on last December 31 uses the Uniform Lifetime Table divisor of 24.6: $500,000 ÷ 24.6 = $20,325. The divisor shrinks each year — 22.9 at 77, 20.2 at 80 — so the required percentage of your balance rises as you age.",
  },
  {
    q: "When does the Joint Life table lower my RMD?",
    a: "Only in one situation: your spouse is the sole primary beneficiary of the account for the entire year AND is more than 10 years younger than you. Then you use the Joint Life and Last Survivor Table (Table II), which has longer distribution periods. A 75-year-old with a 60-year-old spouse divides by 28.3 instead of 24.6, cutting the RMD on $500,000 from $20,325 to about $17,668.",
  },
  {
    q: "Are RMDs taxed, and can I avoid the tax?",
    a: "RMDs from pre-tax accounts are taxed as ordinary income and cannot be rolled over. The main relief valve is a qualified charitable distribution (QCD): IRA owners 70½ or older can send up to $108,000 (2025 limit, indexed) directly to charity, satisfying the RMD without the income hitting their return. Roth conversions before RMD age shrink future RMDs, but you cannot convert the RMD amount itself in the year it's due.",
  },
];

const relatedItems = [
  {
    name: "Retirement Planner",
    desc: "Project the nest egg you'll have and what it produces.",
    mark: "RT",
    href: "/calculators/retirement",
    cat: "Planning",
    time: "2 min",
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
    name: "CD Calculator",
    desc: "Lock a fixed rate — single CDs or a 5-rung ladder.",
    mark: "CD",
    href: "/calculators/cd",
    cat: "Saving",
    time: "30 sec",
  },
  {
    name: "HYSA Calculator",
    desc: "Project high-yield savings growth with monthly deposits.",
    mark: "HY",
    href: "/calculators/hysa",
    cat: "Saving",
    time: "30 sec",
  },
];

const railItems = [
  { name: "Retirement Planner", desc: "Project your nest egg", mark: "RT", href: "/calculators/retirement" },
  { name: "Compound Interest", desc: "See how interest compounds", mark: "CI", href: "/calculators/compound-interest" },
  { name: "CD Calculator", desc: "Fixed rates & CD ladders", mark: "CD", href: "/calculators/cd" },
  { name: "Savings Goal", desc: "Monthly deposit for any target", mark: "SV", href: "/calculators/savings" },
];

export default function RMDCalculatorPage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>RMD Calculator 2026 - IRS Uniform Table | Fin Tools Lab</title>
        <meta
          name="description"
          content="Calculate your 2026 required minimum distribution with the IRS Uniform Lifetime Table, SECURE 2.0 start ages (73/75), spouse Joint Life option, and RMDs to age 100."
        />
        <meta name="keywords" content="RMD calculator, required minimum distribution calculator 2026, IRS uniform lifetime table, SECURE 2.0 RMD age, RMD table, joint life table" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/rmd" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/rmd" />
        <meta property="og:title" content="RMD Calculator 2026 - Required Minimum Distribution Calculator" />
        <meta property="og:description" content="Calculate your 2026 RMD with the IRS Uniform Lifetime Table, SECURE 2.0 start ages, and a projection of every RMD to age 100." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/rmd" />
        <meta property="twitter:title" content="RMD Calculator 2026 - Required Minimum Distribution Calculator" />
        <meta property="twitter:description" content="Calculate your 2026 RMD with the IRS Uniform Lifetime Table, SECURE 2.0 start ages, and a projection of every RMD to age 100." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "RMD Calculator 2026",
            "description": "Free required minimum distribution calculator using the IRS Uniform Lifetime and Joint Life tables with SECURE 2.0 start ages",
            "url": "https://fintoolslab.com/calculators/rmd",
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
              { "@type": "ListItem", "position": 3, "name": "RMD Calculator", "item": "https://fintoolslab.com/calculators/rmd" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Retirement · 2026 tables"
        title={<>RMD <em>calculator</em></>}
        lede="Enter your birth year and last December 31 balance to get this year's required minimum distribution from the IRS Uniform Lifetime Table — plus a projection of every RMD to age 100."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Tables", value: "IRS Pub 590-B · SECURE 2.0" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "RMD Calculator" },
        ]}
        workedExample={{
          amount: "20,325",
          label: "2026 RMD · age 75, $500,000 balance on Dec 31, 2025",
          features: [
            "Uniform Lifetime Table divisor: 24.6",
            "$500,000 ÷ 24.6 = $20,325",
            "Deadline: December 31, 2026",
            "Missed RMDs: 25% excise tax (10% if corrected)",
          ],
        }}
      />

      <CalcShortAnswer heading="What is an RMD calculator?">
        <strong>An RMD calculator</strong> divides your retirement account balance as of December 31 of last year by the IRS distribution period for your age this year. A 75-year-old with $500,000 divides by 24.6 and must withdraw $20,325 during 2026. Under SECURE 2.0, RMDs begin at age 73 if you were born 1951–1959 and at 75 if you were born in 1960 or later. This tool is an educational estimate — confirm the exact figure with your custodian or tax professional.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <RMDCalculator />
        </div>
      </section>

      <section className="container" style={{ paddingTop: 20 }}>
        <div style={{ border: '1px solid var(--line)', borderLeft: '3px solid var(--ft-accent)', borderRadius: 12, padding: '18px 22px', fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--ink)' }}>Educational estimate — not tax advice.</strong> This calculator applies the IRS Uniform Lifetime Table (and Joint Life Table II where you indicate a sole spouse beneficiary more than 10 years younger) as published in IRS Publication 590-B, but it cannot account for every situation: multiple accounts, inherited IRAs, still-working exceptions, annuitized balances, or state tax. Your custodian calculates the official figure. Failing to take a full RMD triggers a 25% excise tax on the shortfall, reduced to 10% if corrected within the IRS correction window. Consult a qualified tax professional before acting.
        </div>
      </section>

      <AdSlot size="leaderboard" />

      <section style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div className="cp-split">
            <div>{schedule && <CalcBreakdown
              schedule={schedule}
              columns={[
                { key: 'balance', label: 'Year-start balance' },
                { key: 'rmd', label: 'Required withdrawal', accent: true },
                { key: 'cumulative', label: 'Total withdrawn' },
              ]}
              yearKey="age"
              yearFormat={(r) => `${r.year} · age ${r.age}`}
              shareKey="rmd"
              shareBase="balance"
              shareLabel="% of balance"
              title={<>Every RMD to <em>age 100</em>.</>}
              csvFilename="rmd-projection"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>One division, straight from the <em>IRS table</em>.</>}
        paragraphs={[
          "The RMD formula is deliberately simple: last December 31's balance divided by a life-expectancy factor the IRS publishes in Publication 590-B. Most owners use the Uniform Lifetime Table — 26.5 at age 73, 24.6 at 75, 20.2 at 80, 12.2 at 90. A 73-year-old with $500,000 must withdraw $500,000 ÷ 26.5 = $18,868 that year; by 80, with the same balance, the requirement climbs to $24,752 because the divisor has fallen to 20.2. The divisor shrinks every year, so the required slice of your account keeps growing — from about 3.8% of the balance at 73 to 8.2% at 90.",
          "SECURE 2.0 rewrote the start dates. Born 1951–1959, your first RMD year is the year you turn 73; born 1960 or later, it's the year you turn 75. Only your first RMD can be delayed to April 1 of the following year — and doing so stacks two taxable RMDs into one year, which often costs more in bracket creep than the deferral saves.",
          "One exception lowers the bill: if your spouse is your sole beneficiary and more than 10 years younger, you use the Joint Life and Last Survivor Table instead. At 75 with a 60-year-old spouse the divisor stretches from 24.6 to 28.3, trimming the RMD on $500,000 from $20,325 to $17,668. The projection above applies whichever table you select year by year, with the balance growing at your chosen rate net of each withdrawal.",
        ]}
        formulaLabel="Required minimum distribution"
        formulaDisplay={<>RMD = B<sub>Dec 31</sub> / d<sub>age</sub></>}
        legend={[
          { symbol: "B", label: "Prior year-end balance", desc: "account value on December 31 of last year" },
          { symbol: "d", label: "Distribution period", desc: "IRS divisor for your age this year (24.6 at 75)" },
          { symbol: "73/75", label: "Start age", desc: "born 1951-1959 → 73 · born 1960+ → 75 (SECURE 2.0)" },
          { symbol: "25%", label: "Excise tax", desc: "penalty on any shortfall, 10% if corrected promptly" },
        ]}
      />

      <CalcTips items={[
        { title: 'Take it by December 31.', text: 'Every RMD after your first is due December 31. Custodians get swamped in late December — schedule the withdrawal by early December to avoid a processing miss.' },
        { title: 'Think twice about the April 1 delay.', text: 'Delaying your first RMD to April 1 means two RMDs land in one tax year. On a $500K balance that is roughly $39K of income at once — often enough to jump a bracket or trigger IRMAA.' },
        { title: 'Use QCDs if you give anyway.', text: 'A qualified charitable distribution sends IRA money straight to charity, counts toward the RMD, and never appears in your AGI — better than deducting a cash gift.' },
        { title: 'Aggregate IRAs, not 401(k)s.', text: 'You may total all IRA RMDs and take the sum from one IRA. 401(k)s do not aggregate — each plan must distribute its own RMD. Consolidating old 401(k)s into an IRA simplifies this.' },
        { title: 'Withhold taxes from the RMD itself.', text: 'Custodians can withhold federal (and state) tax from the distribution, and IRS treats withholding as paid evenly through the year — a clean way to fix an estimated-tax shortfall in December.' },
        { title: 'Model growth honestly.', text: 'At 5% growth, RMDs on $500K keep rising into your mid-80s even as withdrawals accelerate. Use the projection to plan taxes a decade ahead, not just this year.' },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
