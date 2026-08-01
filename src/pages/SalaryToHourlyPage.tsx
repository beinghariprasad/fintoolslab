import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SalaryToHourlyCalculator, type PayRow } from '@/components/calculators/SalaryToHourlyCalculator';
import { CalcPageHero } from '@/components/calculators/CalcPageHero';
import { CalcExplainer } from '@/components/calculators/CalcExplainer';
import { CalcFAQ } from '@/components/calculators/CalcFAQ';
import { CalcRelatedGrid, RailCard } from '@/components/calculators/CalcRelated';
import { CalcShortAnswer } from '@/components/calculators/CalcShortAnswer';
import { CalcTips } from '@/components/calculators/CalcTips';
import { AdSlot } from '@/components/ads/AdSlot';

const faqItems = [
  {
    q: "How do I convert an hourly wage to an annual salary?",
    a: "Multiply your hourly rate by the hours you work per week, then by the weeks you work per year. At the standard 40 hours and 52 weeks, $25/hour is 25 × 40 × 52 = $52,000 per year. A quick mental shortcut for full-time work: double the hourly rate and add three zeros — $25/hour ≈ $50,000. The shortcut assumes 50 working weeks, which is why it lands slightly below the exact 52-week figure.",
  },
  {
    q: "How much is $50,000 a year per hour?",
    a: "At 40 hours per week and 52 weeks per year, $50,000 ÷ 2,080 hours = $24.04 per hour. If you only work 50 weeks (taking two unpaid weeks off), the same salary equals $25.00 per hour across 2,000 hours. This is why hours-per-week and weeks-per-year matter — two people with the same salary can have very different effective hourly rates.",
  },
  {
    q: "Does the calculator show gross or take-home pay?",
    a: "Gross pay — your earnings before federal and state income tax, Social Security, Medicare, and deductions like 401(k) contributions or health insurance premiums. Take-home pay in the US typically runs 70–80% of gross depending on your state, filing status, and pre-tax deductions. Use the gross figures here for comparing offers, then apply your own effective tax rate for budgeting.",
  },
  {
    q: "How is overtime pay calculated?",
    a: "Under the FLSA, non-exempt employees earn at least 1.5× their regular rate for hours beyond 40 in a workweek. This calculator applies that 1.5× multiplier to the overtime hours you enter. Example: at $25/hour with 5 overtime hours weekly, each OT hour pays $37.50, adding $187.50 per week — $9,750 per year at 52 weeks. Salaried employees can also be overtime-eligible if they're classified non-exempt and earn under the federal salary threshold.",
  },
  {
    q: "Why do salaried and hourly pay compare differently than they look?",
    a: "A salary quietly assumes 'whatever hours it takes.' If a $70,000 salary really means 50-hour weeks, the effective rate is $70,000 ÷ 2,600 hours = $26.92/hour — not the $33.65 the 40-hour math suggests. Hourly workers get paid for every hour but may face variable schedules and fewer paid benefits. When comparing offers, convert both to effective hourly rates using realistic hours, then add the value of benefits like employer 401(k) match, insurance, and PTO.",
  },
  {
    q: "How does unpaid time off change my annual pay?",
    a: "Each unpaid week off removes one week of wages. At $25/hour and 40 hours, every unpaid week costs $1,000 of gross income, so 4 unpaid weeks turns a $52,000 pace into $48,000 actually earned. Freelancers and contractors should always model unpaid weeks — vacation, gaps between clients, and sick days all come out of the annual figure, which is a key reason contract rates need to be higher than the equivalent employee wage.",
  },
];

const relatedItems = [
  {
    name: "Savings Goal",
    desc: "Turn your new pay number into a monthly savings plan.",
    mark: "SG",
    href: "/calculators/savings",
    cat: "Saving",
    time: "30 sec",
  },
  {
    name: "Compound Interest",
    desc: "See what investing part of each paycheck grows into.",
    mark: "CI",
    href: "/calculators/compound-interest",
    cat: "Investing",
    time: "30 sec",
  },
  {
    name: "Retirement Planner",
    desc: "Project the nest egg your salary can build by retirement.",
    mark: "RT",
    href: "/calculators/retirement",
    cat: "Planning",
    time: "2 min",
  },
  {
    name: "Coast FIRE",
    desc: "Find the savings level where compounding does the rest.",
    mark: "CF",
    href: "/calculators/coast-fire",
    cat: "Planning",
    time: "1 min",
  },
];

const railItems = [
  { name: "Savings Goal", desc: "Plan a monthly deposit from your pay", mark: "SG", href: "/calculators/savings" },
  { name: "Compound Interest", desc: "Grow part of every paycheck", mark: "CI", href: "/calculators/compound-interest" },
  { name: "Retirement Planner", desc: "Project your nest egg", mark: "RT", href: "/calculators/retirement" },
  { name: "Coast FIRE", desc: "When can compounding take over?", mark: "CF", href: "/calculators/coast-fire" },
];

function fmtRow(n: number, decimals: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function SalaryToHourlyPage() {
  const [rows, setRows] = useState<PayRow[] | null>(null);

  useEffect(() => {
    const onUpdate = (e: CustomEvent) => setRows(e.detail?.rows);
    window.addEventListener('calc:salary', onUpdate as EventListener);
    if ((window as any).__finSalaryRows) setRows((window as any).__finSalaryRows);
    return () => window.removeEventListener('calc:salary', onUpdate as EventListener);
  }, []);

  return (
    <>
      <Helmet>
        <title>Hourly to Salary Calculator - Convert Hourly Wage to Annual Pay | Fin Tools Lab</title>
        <meta
          name="description"
          content="Convert hourly wage to annual salary or salary to hourly instantly. See hourly, daily, weekly, biweekly, monthly and annual pay with overtime and unpaid time off."
        />
        <meta name="keywords" content="hourly to salary calculator, salary to hourly calculator, hourly wage to annual salary, pay converter, overtime calculator, biweekly pay" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/salary-to-hourly" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/salary-to-hourly" />
        <meta property="og:title" content="Hourly to Salary Calculator - Convert Hourly Wage to Annual Pay" />
        <meta property="og:description" content="Convert between hourly wage and annual salary instantly, with overtime and unpaid time off. See every pay period at once." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/salary-to-hourly" />
        <meta property="twitter:title" content="Hourly to Salary Calculator - Convert Hourly Wage to Annual Pay" />
        <meta property="twitter:description" content="Convert between hourly wage and annual salary instantly, with overtime and unpaid time off. See every pay period at once." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Hourly to Salary Calculator",
            "description": "Free bidirectional pay converter between hourly wage and annual salary with overtime and unpaid time off",
            "url": "https://fintoolslab.com/calculators/salary-to-hourly",
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
              { "@type": "ListItem", "position": 3, "name": "Salary to Hourly", "item": "https://fintoolslab.com/calculators/salary-to-hourly" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Income · 30-second setup"
        title={<>Salary to hourly <em>converter</em></>}
        lede="Enter either an hourly wage or an annual salary and see every pay period at once — hourly, daily, weekly, biweekly, monthly and annual — with overtime and unpaid time off factored in."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Salary to hourly" },
        ]}
        workedExample={{
          amount: "52,000",
          label: "Annual salary · $25/hr, 40 hrs/week, 52 weeks",
          features: [
            "$1,000 per week gross",
            "$2,000 per biweekly paycheck",
            "$4,333 per month on average",
            "2,080 working hours per year",
          ],
        }}
      />

      <CalcShortAnswer heading="How do you convert between salary and hourly pay?">
        <strong>Annual salary = hourly wage × hours per week × weeks per year.</strong> At full-time hours that's 2,080 hours a year, so $25/hour equals $52,000 and $60,000 equals $28.85/hour. This converter runs the math in both directions and adjusts for overtime at 1.5× and any unpaid weeks off, so the number you see reflects what you'd actually earn — not just the textbook case.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <SalaryToHourlyCalculator />
        </div>
      </section>

      <AdSlot size="leaderboard" />

      <section style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div className="cp-split">
            <div>
              <div className="bd-head">
                <div>
                  <div className="eyebrow">Pay periods</div>
                  <h2>One wage, <em>every</em> paycheck.</h2>
                </div>
              </div>
              {rows && (
                <div style={{ overflowX: 'auto' }}>
                  <table className="bd-table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th className="r">Base pay</th>
                        <th className="r">With overtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const dec = r.period === 'Hourly' || r.period === 'Daily' ? 2 : 0;
                        return (
                          <tr key={r.period}>
                            <td className="row-y">{r.period}</td>
                            <td className="r">${fmtRow(r.base, dec)}</td>
                            <td className="r" style={{ color: 'var(--ft-accent)' }}>${fmtRow(r.total, dec)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 14 }}>
                Biweekly is two weeks of pay (26 checks a year at 52 working weeks). Monthly is the annual total divided by 12, which is why it doesn't exactly match two biweekly checks — two months a year contain three paydays.
              </p>
            </div>
            <div className="cp-rail">
              <AdSlot size="half" />
              <RailCard items={railItems} />
            </div>
          </div>
        </div>
      </section>

      <CalcExplainer
        title={<>The one formula behind <em>every</em> pay conversion.</>}
        paragraphs={[
          "Every salary-to-hourly conversion is the same multiplication read in different directions. A full-time year is 40 hours × 52 weeks = 2,080 hours, so an hourly rate becomes a salary by multiplying through, and a salary becomes an hourly rate by dividing by hours worked. The classic mental shortcut — double the hourly rate and add three zeros — assumes 2,000 hours, which is why it undershoots the exact figure by about 4%.",
          "The textbook case breaks as soon as real schedules enter the picture. Overtime pays 1.5× for hours past 40, unpaid weeks remove entire weeks of income, and part-time or compressed schedules change the hours term. A nurse at $38/hour working three 12-hour shifts (36 hours) earns $71,136 over 52 weeks — while a contractor billing $50/hour who takes 6 unpaid weeks between projects grosses $92,000, not the $104,000 the naive math promises.",
          "That gap is the whole point of converting carefully: when you compare a salaried offer against an hourly one, use the hours you will actually work and the weeks you will actually be paid, then compare effective hourly rates. It's the only apples-to-apples number.",
        ]}
        formulaLabel="Annual pay from an hourly wage"
        formulaDisplay={<>Annual = h × H × W&nbsp;&nbsp;(+ 1.5h × OT × W)</>}
        legend={[
          { symbol: "h", label: "Hourly wage", desc: "your base rate per hour before taxes" },
          { symbol: "H", label: "Hours per week", desc: "regular hours — 40 for standard full-time" },
          { symbol: "W", label: "Paid weeks per year", desc: "52 minus any unpaid weeks off" },
          { symbol: "OT", label: "Overtime hours", desc: "weekly hours past 40, paid at 1.5× your rate" },
        ]}
      />

      <CalcTips items={[
        { title: 'Memorize the 2,080 number.', text: 'Full-time = 2,080 hours/year. Salary ÷ 2,080 = hourly; hourly × 2,080 = salary. Every other conversion is a variation on this.' },
        { title: 'Compare offers in effective hourly.', text: "A $70K salary at real 50-hour weeks is $26.92/hour — less than a $28/hour job at 40 hours. Always divide by the hours you'll actually work." },
        { title: 'Price benefits into the rate.', text: 'Employer health insurance, 401(k) match, and paid time off are typically worth 20-30% of base pay. An hourly gig without them needs a much higher rate to break even.' },
        { title: 'Contractors: bill for unpaid weeks.', text: 'Six unpaid weeks a year (vacation, gaps, sick days) means 46 billable weeks. To match a $52K job, you need roughly $28/hour, not $25.' },
        { title: 'Overtime compounds fast.', text: 'Just 5 OT hours weekly at $25/hour adds $9,750/year — a 19% raise. Model it before turning down (or chasing) extra shifts.' },
        { title: 'Budget on take-home, not gross.', text: 'These figures are pre-tax. Take-home is typically 70-80% of gross in the US. Set your rent and savings targets from the net number.' },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
