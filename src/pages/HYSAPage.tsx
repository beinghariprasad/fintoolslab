import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { HYSACalculator } from '@/components/calculators/HYSACalculator';
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
    q: "Are high-yield savings accounts safe?",
    a: "Yes — an HYSA at an FDIC-member bank is insured up to $250,000 per depositor, per bank, per ownership category, exactly like a regular savings account (credit unions carry equivalent NCUA coverage). The 'high-yield' label describes the rate, not extra risk. Most high-APY accounts come from online banks with low overhead, not from riskier products.",
  },
  {
    q: "Why is my bank paying 0.4% when HYSAs pay over 4%?",
    a: "Large branch banks rely on customer inertia and pay near the FDIC national average — just 0.38% as of July 2026. Online banks compete for deposits with rates ten times higher. On a $10,000 balance that's the difference between about $38 and $430 of interest in a single year. Moving an emergency fund to an HYSA is usually the highest-return 15 minutes in personal finance.",
  },
  {
    q: "Is HYSA interest taxed?",
    a: "Yes. Savings interest is ordinary income, taxed at your federal marginal rate (and usually state rate) in the year it's credited. Your bank issues a 1099-INT once you earn $10 or more. Earning $430 in the 22% bracket costs about $95 in federal tax, leaving roughly $335 net — still far ahead of a 0.38% account's $38.",
  },
  {
    q: "Can my HYSA rate change after I open the account?",
    a: "Yes — HYSA rates are variable and track the federal funds rate. Banks can raise or lower them at any time without notice, which is the key difference from a CD's locked rate. When the Fed cuts, HYSA yields typically fall within weeks. If you want certainty on money you won't touch for a year or more, pair the HYSA with a CD or CD ladder.",
  },
  {
    q: "How often does a high-yield savings account compound?",
    a: "Most compound daily and credit monthly, but it doesn't change the math you should do: the advertised APY already includes compounding. This calculator converts APY to an exact monthly growth factor — (1 + APY)^(1/12) — so twelve months of growth lands precisely on the quoted APY. $10,000 at 4.30% APY earns about $35 in the first month and exactly $430 over a full year.",
  },
  {
    q: "HYSA vs money market fund — what's the difference?",
    a: "An HYSA is a bank deposit with FDIC insurance and a rate the bank sets. A money market fund is an investment fund holding short-term Treasuries and commercial paper; its yield floats with the market and it is not FDIC insured (though it's considered very low risk). Funds sometimes yield slightly more, but the HYSA wins on simplicity and hard insurance guarantees for emergency savings.",
  },
];

const relatedItems = [
  {
    name: "CD Calculator",
    desc: "Lock a fixed rate — single CDs or a 5-rung ladder.",
    mark: "CD",
    href: "/calculators/cd",
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
  { name: "CD Calculator", desc: "Fixed rates & CD ladders", mark: "CD", href: "/calculators/cd" },
  { name: "Savings Goal", desc: "Monthly deposit for any target", mark: "SV", href: "/calculators/savings" },
  { name: "Compound Interest", desc: "See how interest compounds", mark: "CI", href: "/calculators/compound-interest" },
  { name: "Retirement Planner", desc: "Project your nest egg", mark: "RT", href: "/calculators/retirement" },
];

export default function HYSAPage() {
  const [schedule, setSchedule] = useState<any[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setSchedule(e.detail?.schedule);
    window.addEventListener('calc:schedule', onUpdate as EventListener);
    return () => window.removeEventListener('calc:schedule', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>HYSA Calculator - High-Yield Savings Growth | Fin Tools Lab</title>
        <meta
          name="description"
          content="See how a high-yield savings account grows with monthly deposits at 4%+ APY. Month-by-month table plus comparison against the 0.38% national average and a 3% CD."
        />
        <meta name="keywords" content="HYSA calculator, high yield savings calculator, savings interest calculator, APY calculator, high yield savings account growth" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/hysa" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/hysa" />
        <meta property="og:title" content="HYSA Calculator - High-Yield Savings Growth Calculator" />
        <meta property="og:description" content="Project high-yield savings growth with monthly deposits, and compare against the national average savings rate and a 3% CD." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/hysa" />
        <meta property="twitter:title" content="HYSA Calculator - High-Yield Savings Growth Calculator" />
        <meta property="twitter:description" content="Project high-yield savings growth with monthly deposits, and compare against the national average savings rate and a 3% CD." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "HYSA Calculator",
            "description": "Free high-yield savings account calculator with month-by-month growth, monthly contributions, and rate comparisons",
            "url": "https://fintoolslab.com/calculators/hysa",
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
              { "@type": "ListItem", "position": 3, "name": "HYSA Calculator", "item": "https://fintoolslab.com/calculators/hysa" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Saving · 30-second setup"
        title={<>HYSA <em>calculator</em></>}
        lede="Enter your deposit, monthly contribution, and APY to see exactly how a high-yield savings account grows — and how much more it earns than the 0.38% national average."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "HYSA Calculator" },
        ]}
        workedExample={{
          amount: "29,009",
          label: "Balance · $10,000 + $250/mo at 4.30% APY, 5 years",
          features: [
            "$25,000 of your own deposits",
            "$4,009 of compound interest",
            "vs $332 interest at the 0.38% national average",
            "≈ $35/month interest on $10,000 today",
          ],
        }}
      />

      <CalcShortAnswer heading="What is a HYSA calculator?">
        <strong>A HYSA calculator</strong> projects a high-yield savings balance month by month: each month the balance grows by (1 + APY)^(1/12) and your contribution is added. At 4.30% APY, $10,000 plus $250 a month becomes $29,009 in five years — $4,009 of it interest. The same deposits at the FDIC national average savings rate of 0.38% (July 2026) earn just $332. The gap between those two numbers is the entire case for moving your savings.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <HYSACalculator />
        </div>
      </section>

      <AdSlot size="leaderboard" />

      <section style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div className="cp-split">
            <div>{schedule && <CalcBreakdown
              schedule={schedule}
              columns={[
                { key: 'contributed', label: 'Deposited' },
                { key: 'interest', label: 'Interest earned', accent: true },
                { key: 'balance', label: 'Balance' },
              ]}
              yearKey="p"
              yearFormat={(r) => `Yr ${Math.ceil(r.p / 12)} · Mo ${((r.p - 1) % 12) + 1}`}
              shareKey="interest"
              shareBase="balance"
              shareLabel="Interest share"
              title={<>Month-by-month <em>growth</em>.</>}
              csvFilename="hysa-breakdown"
            />}</div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>The monthly math behind an <em>APY</em>.</>}
        paragraphs={[
          "APY — annual percentage yield — is the rate after compounding, so the honest way to model monthly growth is to take the 12th root: each month your balance multiplies by (1 + APY)^(1/12). At 4.30% APY that's about 0.352% a month, which is why $10,000 earns roughly $35.15 in month one and exactly $430.00 over a full year — landing precisely on the advertised APY, with contributions added at the end of each month on top.",
          "Compounding is what separates an HYSA from a drawer of cash. Deposit $10,000, add $250 a month, and at 4.30% APY you reach $29,009 in five years. Only $25,000 of that is your own money; $4,009 is interest earning interest. Run the identical deposits at the FDIC national average of 0.38% (July 2026) and interest collapses to $332. At a fixed 3.00% CD-style rate you'd earn about $2,738 — better, but a CD can't take monthly deposits the way a savings account can.",
          "The trade-off for that flexibility is rate risk. HYSA rates float with the federal funds rate, so the 4%+ yields of 2024–2026 can fall quickly when the Fed cuts. That's the reason savers pair an HYSA (liquid emergency fund, variable rate) with a CD ladder (locked rates, staggered access) — each covers the other's weakness.",
        ]}
        formulaLabel="Balance after m months"
        formulaDisplay={<>B = P(1+r)<sup>m</sup> + C · [(1+r)<sup>m</sup> − 1] / r</>}
        legend={[
          { symbol: "B", label: "Ending balance", desc: "value after m months of growth and deposits" },
          { symbol: "P", label: "Starting deposit", desc: "what you open the account with" },
          { symbol: "C", label: "Monthly contribution", desc: "added at the end of each month" },
          { symbol: "r", label: "Monthly rate", desc: "(1 + APY)^(1/12) − 1, exact 12th root of the APY" },
        ]}
      />

      <CalcTips items={[
        { title: 'Move the emergency fund first.', text: 'The gap between 0.38% and 4.30% on a $15,000 emergency fund is roughly $590 a year for the same zero risk. This is the account to move before optimizing anything else.' },
        { title: 'Chase APY, ignore sign-up gimmicks.', text: 'A $100 bonus on a 3% account loses to a plain 4.3% account within a year on balances over $8,000. Compute a full year of interest before switching for a bonus.' },
        { title: 'Rates are variable — check quarterly.', text: 'Banks quietly drop legacy account rates while advertising new ones. Put a quarterly reminder on the calendar to compare your APY against current offers.' },
        { title: 'Automate the monthly deposit.', text: 'The $250/month in the example contributes $15,000 of the $29,009 five-year total. Automation, not the rate, does most of the heavy lifting.' },
        { title: 'Keep it under $250K per bank.', text: 'FDIC insurance caps at $250,000 per depositor per bank. Above that, open a second HYSA elsewhere — rates barely differ at the top of the market.' },
        { title: 'Budget for the tax bill.', text: 'Interest is ordinary income. Earning $430 in the 22% bracket nets about $335. High earners in taxed states may prefer Treasury bills, which are state-tax exempt.' },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
