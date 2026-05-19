import { Helmet } from 'react-helmet-async';
import { RentVsBuyCalculator } from '@/components/calculators/RentVsBuyCalculator';
import { CalcPageHero } from '@/components/calculators/CalcPageHero';
import { CalcExplainer } from '@/components/calculators/CalcExplainer';
import { CalcFAQ } from '@/components/calculators/CalcFAQ';
import { CalcRelatedGrid } from '@/components/calculators/CalcRelated';
import { CalcShortAnswer } from '@/components/calculators/CalcShortAnswer';
import { CalcTips } from '@/components/calculators/CalcTips';
import { AdSlot } from '@/components/ads/AdSlot';

const faqItems = [
  {
    q: "How many years do I need to stay for buying to beat renting?",
    a: "The break-even horizon varies by market but typically falls between 4 and 7 years in most US cities. In expensive coastal markets it can stretch to 10+ years; in affordable Midwest cities it can be as short as 2–3 years. The calculator shows your personal break-even based on the rent, purchase price, and appreciation rate you enter.",
  },
  {
    q: "What hidden costs of homeownership am I missing?",
    a: "Beyond the mortgage, budget for property taxes (0.5–2.5% of value annually), homeowners insurance (0.5–1%), maintenance and repairs (1–2% of value per year), HOA fees if applicable, and mortgage insurance (PMI) if your down payment is under 20%. These can add 30–50% on top of your principal-and-interest payment — a common surprise for first-time buyers.",
  },
  {
    q: "What is opportunity cost and why does it matter here?",
    a: "Opportunity cost is what your down payment money could earn if invested elsewhere. A $70,000 down payment invested in a diversified portfolio at 7% annually grows to roughly $275,000 in 20 years. That potential return belongs on the buying side of the ledger as a cost — it is money you forgo by tying it up in a home. The calculator factors this in.",
  },
  {
    q: "How does home price appreciation affect the decision?",
    a: "Appreciation is the main financial argument for buying. US home prices have appreciated roughly 4% annually over the long run, though with wide geographic variation and cyclical volatility. Higher assumed appreciation makes buying look better; lower appreciation or a flat market shortens the window in which renting wins. Try a range from 2% to 5% to stress-test the result.",
  },
  {
    q: "Should I factor in the mortgage interest tax deduction?",
    a: "The deduction is only available if you itemize on your federal return, and since the 2017 tax law nearly doubled the standard deduction ($29,200 for married couples filing jointly in 2024), fewer than 10% of filers itemize. Run the calculator with and without the deduction to see its actual impact on your situation, and consult a tax professional for personalized advice.",
  },
  {
    q: "Is renting really throwing money away?",
    a: "No — this is one of the most persistent myths in personal finance. Rent buys you housing, flexibility, freedom from maintenance costs, and the ability to deploy capital elsewhere. Mortgage payments also contain a large interest component (especially early on) that doesn't build equity. Neither choice is inherently wasteful; the right answer depends on your local market, timeline, and financial goals.",
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
    name: "Investment Growth",
    desc: "Project how a lump sum or contributions grow with returns.",
    mark: "IV",
    href: "/calculators/investment",
    cat: "Investing",
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
];

export default function RentVsBuyPage() {
  return (
    <>
      <Helmet>
        <title>Rent vs. Buy Calculator - Should You Rent or Buy? | Fin Tools Lab</title>
        <meta
          name="description"
          content="Compare the true cost of renting against buying over your time horizon. Includes appreciation, tax benefits, opportunity cost and more with our free rent vs buy calculator."
        />
        <meta name="keywords" content="rent vs buy calculator, should I rent or buy, home buying decision, rent or buy, break-even calculator, opportunity cost" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/rent-vs-buy" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/rent-vs-buy" />
        <meta property="og:title" content="Rent vs. Buy Calculator - Should You Rent or Buy?" />
        <meta property="og:description" content="Compare the true cost of renting against buying over your time horizon with our free calculator." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/rent-vs-buy" />
        <meta property="twitter:title" content="Rent vs. Buy Calculator - Should You Rent or Buy?" />
        <meta property="twitter:description" content="Compare the true cost of renting against buying over your time horizon with our free calculator." />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Rent vs. Buy Calculator",
            "description": "Free rent vs buy calculator with break-even analysis, opportunity cost, and net worth projections",
            "url": "https://fintoolslab.com/calculators/rent-vs-buy",
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
              { "@type": "ListItem", "position": 3, "name": "Rent vs. buy", "item": "https://fintoolslab.com/calculators/rent-vs-buy" },
            ],
          })}
        </script>
      </Helmet>

      <CalcPageHero
        chip="Real estate · 2-minute setup"
        title={<>Rent vs. buy <em>calculator</em></>}
        lede="Compare the true cost of renting against buying over your time horizon. Includes appreciation, tax benefits, opportunity cost and more."
        meta={[
          { label: "Free", value: "no sign-up required" },
          { label: "Updated", value: "2026" },
        ]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Rent vs. buy" },
        ]}
        workedExample={{
          amount: "Buy saves $142K",
          label: "Over 10 years · $2,000/mo rent, $350K home, 6.5% rate",
          features: [
            "$2,000/month current rent",
            "$350,000 home purchase price",
            "6.5% mortgage rate, 30-year term",
            "3% annual appreciation assumed",
          ],
        }}
      />

      <CalcShortAnswer heading="What is a rent vs buy calculator?">
        <strong>A rent vs buy calculator</strong> models both housing paths in parallel: buying builds equity and home value, while renting frees up the down payment to invest. The honest answer compares net worth at the end of your time horizon — including taxes, maintenance, opportunity cost, and rent inflation. It depends heavily on how long you'll stay.
      </CalcShortAnswer>

      <section className="cp-calc-wrap">
        <div className="container">
          <div className="calc-wrap">
            <RentVsBuyCalculator />
          </div>
        </div>
      </section>

      <AdSlot size="leaderboard" />

      <CalcExplainer
        title={<>How the <em>comparison</em> is built.</>}
        paragraphs={[
          "The calculator tracks two parallel net-worth paths year by year. The buying path accumulates home equity (appreciation plus principal paydown) and subtracts all ownership costs. The renting path grows your invested down payment at the assumed investment return and subtracts cumulative rent paid.",
          "The year where the buying net-worth line crosses the renting net-worth line is your break-even point. Before that year, renting leaves you ahead financially. After it, buying comes out ahead — all else equal. The exact crossover depends heavily on local appreciation rates and your investment return assumption, so try several scenarios.",
        ]}
        formulaLabel="Net worth advantage of buying"
        formulaDisplay={<>Δ = (Equity + Appreciation) − (Total Ownership Costs) − (Invested DP Growth − Rent Paid)</>}
        legend={[
          { symbol: "Equity", label: "Principal paydown", desc: "loan balance reduction through monthly payments" },
          { symbol: "Appreciation", label: "Price appreciation", desc: "home value growth at the assumed annual rate" },
          { symbol: "Invested DP", label: "Opportunity cost", desc: "down payment compounded at your investment return" },
          { symbol: "Δ", label: "Net advantage", desc: "positive means buying is ahead; negative means renting is ahead" },
        ]}
      />

      <CalcTips items={[
        { title: 'Length of stay is everything.', text: 'Under 3 years, renting almost always wins (closing costs are ~3% of home value, eaten in transaction).' },
        { title: "Don't forget 1% maintenance.", text: 'Plan to spend ~1% of home value per year on maintenance and repairs. Older homes more. Buyers chronically underestimate this.' },
        { title: "Rent inflation isn't free either.", text: "Your rent grows. A locked 30-year mortgage doesn't (excluding tax/insurance creep). Long horizons increasingly favor buying for this reason." },
        { title: 'Closing costs are real money.', text: 'Total transaction costs are typically 5-8% on the buy side, 6% on the sell side. A short hold can erase years of appreciation.' },
        { title: 'Tax benefits are smaller than you think.', text: 'Mortgage interest deduction matters less after the 2017 SALT cap and standard deduction increase. Most middle-income buyers no longer itemize.' },
        { title: 'Optionality has value.', text: 'Renting is a real option to relocate, take a chance on a new city, change jobs. Hard to price in a calculator — but worth weighing.' },
      ]} />

      <CalcFAQ items={faqItems} />

      <CalcRelatedGrid items={relatedItems} />
    </>
  );
}
