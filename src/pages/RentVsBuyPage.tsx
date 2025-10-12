import { lazy, Suspense } from 'react';
import { RentVsBuyCalculator } from '@/components/calculators/RentVsBuyCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, DollarSign, Target, BookOpen, Lightbulb, Home, HelpCircle, Building, Wallet } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Lazy-load non-critical sections
const FooterAd = lazy(() => import('@/components/ads/AdSenseUnit').then(m => ({ default: m.FooterAd })));

// Educational content
const educationalContent = [
  {
    title: 'When Does Buying Make Sense?',
    content: 'Buying typically makes financial sense when you plan to stay in the same location for at least 5-7 years, have stable income, can afford the down payment without depleting emergency savings, and the monthly payment is manageable within your budget. Market conditions and your personal financial situation play crucial roles.',
    icon: Home
  },
  {
    title: 'The True Cost of Homeownership',
    content: 'Beyond the mortgage payment, homeownership includes property taxes, insurance, maintenance, repairs, HOA fees, and utilities. A general rule is to budget 1-3% of your home\'s value annually for maintenance and repairs. These costs can significantly impact the rent vs buy comparison.',
    icon: Wallet
  },
  {
    title: 'Opportunity Cost Considerations',
    content: 'When renting, your down payment money can be invested in stocks, bonds, or other investments that may provide higher returns than real estate appreciation. This opportunity cost is an important factor in the rent vs buy decision and depends on your investment strategy and market performance.',
    icon: TrendingUp
  },
  {
    title: 'Break-Even Analysis',
    content: 'The break-even point is when the total cost of buying equals the total cost of renting. This typically occurs between 3-7 years depending on local market conditions, home prices, rent levels, and your personal financial situation. Understanding this timeline helps inform your decision.',
    icon: Target
  }
];

const tips = [
  'Consider your long-term plans - buying works best when you stay put for 5+ years',
  'Factor in all costs: taxes, insurance, maintenance, HOA fees, and opportunity costs',
  'Don\'t stretch your budget - aim for housing costs under 28% of gross income',
  'Build an emergency fund before buying - aim for 3-6 months of expenses',
  'Research local market trends - some markets favor renting, others favor buying',
  'Consider your lifestyle - renting offers more flexibility, buying offers stability',
  'Calculate the true monthly cost including all homeownership expenses',
  'Think about maintenance responsibilities - are you ready to handle repairs?'
];

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Rent vs Buy Calculator",
  "description": "Free rent vs buy calculator with comprehensive analysis and interactive charts",
  "url": "https://fintoolslab.com/calculators/rent-vs-buy",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Net worth comparison",
    "Break-even analysis", 
    "Monthly cost breakdown",
    "Tax benefit calculations",
    "Interactive charts",
    "Scenario modeling"
  ],
  "screenshot": "https://fintoolslab.com/calculators/rent-vs-buy",
  "softwareVersion": "1.0",
  "author": {
    "@type": "Organization",
    "name": "Fin Tools Lab"
  }
};

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I know if I should rent or buy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The decision depends on factors like how long you plan to stay, your financial situation, local market conditions, and personal preferences. Generally, buying makes sense if you plan to stay 5+ years, have stable income, and can afford the down payment and monthly costs comfortably."
      }
    },
    {
      "@type": "Question",
      "name": "What costs should I consider when buying a home?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Beyond the mortgage payment, consider down payment, closing costs, property taxes, homeowners insurance, maintenance, repairs, HOA fees, utilities, and PMI if your down payment is less than 20%. These can add 30-50% to your monthly mortgage payment."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate is a rent vs buy calculator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rent vs buy calculators provide estimates based on the assumptions you input. They're useful for general guidance, but actual results may vary due to market changes, unexpected expenses, tax law changes, and personal circumstances. Use them as a starting point for your analysis."
      }
    },
    {
      "@type": "Question",
      "name": "What is the break-even point in rent vs buy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The break-even point is when the total cost of buying equals the total cost of renting. This typically ranges from 3-7 years depending on home prices, rent levels, appreciation rates, and your specific financial situation. Our calculator shows this break-even timeline."
      }
    },
    {
      "@type": "Question",
      "name": "Should I include investment returns in my calculation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, when renting, you can invest your down payment money in other investments. The potential returns from these investments (opportunity cost) should be factored into your rent vs buy analysis. Historical stock market returns average 7-10% annually over long periods."
      }
    }
  ]
};

const RentVsBuyPage = () => {
  return (
    <>
      <Helmet>
        <title>Rent vs Buy Calculator - Should You Rent or Buy? | Fin Tools Lab</title>
        <meta 
          name="description" 
          content="Free rent vs buy calculator. Compare the total costs of renting vs buying a home with break-even analysis, net worth projections, and interactive charts." 
        />
        <meta 
          name="keywords" 
          content="rent vs buy calculator, should I rent or buy, home buying calculator, real estate calculator, housing decision tool"
        />
        <link rel="canonical" href="https://fintoolslab.com/calculators/rent-vs-buy" />
        <meta property="og:title" content="Rent vs Buy Calculator - Make Informed Housing Decisions" />
        <meta property="og:description" content="Compare renting vs buying with our comprehensive calculator. Get break-even analysis, cost breakdowns, and net worth projections." />
        <meta property="og:url" content="https://fintoolslab.com/calculators/rent-vs-buy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://fintoolslab.com/calculator-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rent vs Buy Calculator | Fin Tools Lab" />
        <meta name="twitter:description" content="Make informed housing decisions with our free rent vs buy calculator" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/calculators">Calculators</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Rent vs Buy</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Calculator */}
        <RentVsBuyCalculator />

        {/* Educational Content */}
        <div className="mt-16 space-y-12">
          {/* Key Concepts */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Understanding Rent vs Buy Decisions
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Making the right housing decision requires understanding the financial implications, 
                opportunity costs, and personal factors involved in renting versus buying.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {educationalContent.map((item, index) => (
                <Card key={index} className="h-full">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tips Section */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Housing Decision Tips</h2>
                <p className="text-muted-foreground">
                  Expert advice to help you make the best choice for your situation
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Common questions about rent vs buy decisions
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {faqData.mainEntity.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.acceptedAnswer.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Related Calculators */}
          <section className="bg-slate-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Related Calculators</h2>
              <p className="text-muted-foreground">
                Explore other tools to help with your financial planning
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="group hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Mortgage Calculator</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate monthly payments and total interest for home loans
                  </p>
                  <Link 
                    to="/calculators/mortgage"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Try Calculator →
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Savings Calculator</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Plan and track your savings goals with compound interest
                  </p>
                  <Link 
                    to="/calculators/savings"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Try Calculator →
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Investment Calculator</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyze investment returns with different scenarios
                  </p>
                  <Link 
                    to="/calculators/investment"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Try Calculator →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Footer Ad */}
        <div className="mt-16">
          <Suspense fallback={<div className="h-24 bg-gray-100 rounded-lg animate-pulse" />}>
            <FooterAd />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default RentVsBuyPage; 