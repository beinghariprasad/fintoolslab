import { lazy, Suspense } from 'react';
import { CompoundInterestCalculator } from '@/components/calculators/CompoundInterestCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, DollarSign, Target, BookOpen, Lightbulb, Home, HelpCircle } from 'lucide-react';
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

// Move static data outside component to prevent re-creation
const educationalContent = [
  {
    title: 'What is Compound Interest?',
    content: 'Compound interest is the addition of interest to the principal sum of a loan or deposit, or in other words, interest on interest. It is the result of reinvesting interest, rather than paying it out, so that interest in the next period is then earned on the principal sum plus previously accumulated interest.',
    icon: BookOpen
  },
  {
    title: 'The Power of Time',
    content: 'The longer your money has to compound, the more dramatic the results. Starting early, even with small amounts, can lead to significantly larger returns than starting later with larger amounts. Time is your most powerful ally in building wealth.',
    icon: Target
  },
  {
    title: 'Compound Frequency Matters',
    content: 'The frequency of compounding affects your returns. Daily compounding typically yields slightly higher returns than monthly, which yields more than annually. However, the difference becomes less significant as the compounding frequency increases.',
    icon: TrendingUp
  },
  {
    title: 'Regular Contributions',
    content: 'Making regular contributions to your investment significantly amplifies the power of compound interest. Even small, consistent contributions can lead to substantial wealth accumulation over time due to the compounding effect.',
    icon: DollarSign
  }
];

const tips = [
  'Start investing as early as possible to maximize the power of compound interest',
  'Make regular contributions, even if they\'re small - consistency is key',
  'Choose investments with higher compound frequencies when possible',
  'Reinvest your returns rather than withdrawing them to maintain compounding',
  'Be patient - compound interest works best over long time periods',
  'Consider tax-advantaged accounts like 401(k)s and IRAs for retirement savings'
];

// Pre-compute structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Compound Interest Calculator",
  "description": "Free compound interest calculator with interactive charts and detailed projections",
  "url": "https://fintoolslab.com/calculators/compound-interest",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Interactive charts",
    "Multiple currencies",
    "Flexible contribution schedules",
    "Real-time calculations",
    "Export results"
  ],
  "screenshot": "https://fintoolslab.com/calculators/compound-interest",
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
      "name": "How do I use a compound interest calculator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To use our compound interest calculator, enter your initial investment amount, annual interest rate, investment time period, and monthly contribution amount. The calculator will instantly show your projected returns, total contributions, and interest earned over time."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between simple and compound interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simple interest is calculated only on the principal amount, while compound interest is calculated on both the principal and accumulated interest. Compound interest grows faster over time because you earn interest on your interest, creating exponential growth."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate are compound interest calculators?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our compound interest calculator uses industry-standard formulas and provides accurate projections based on your inputs. However, actual returns may vary due to market fluctuations, fees, and tax implications. Always consult with a financial advisor for personalized advice."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best frequency for compound interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "More frequent compounding (daily or monthly) typically yields slightly higher returns than annual compounding. However, the difference becomes less significant as compounding frequency increases. Focus on starting early and making regular contributions for maximum impact."
      }
    },
    {
      "@type": "Question",
      "name": "How much should I invest to reach my financial goals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use our calculator to experiment with different investment amounts and time periods. Start with your current savings and gradually increase contributions as your income grows. Remember, even small regular investments can grow significantly over time due to compound interest."
      }
    }
  ]
};

function ExampleWalkthrough() {
  return (
    <div className="mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Example Walkthrough
          </CardTitle>
          <CardDescription>
            See how compound interest works with a real example
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Scenario:</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Initial investment: $10,000</li>
                <li>• Annual interest rate: 7%</li>
                <li>• Monthly contribution: $500</li>
                <li>• Time period: 20 years</li>
              </ul>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$130,000</div>
                <div className="text-sm text-blue-700">Total Contributions</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$180,000</div>
                <div className="text-sm text-green-700">Interest Earned</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$310,000</div>
                <div className="text-sm text-purple-700">Final Balance</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This example shows how regular contributions and compound interest can turn $130,000 in contributions into $310,000 over 20 years!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TipsSection() {
  return (
    <div className="mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Investment Tips
          </CardTitle>
          <CardDescription>
            Maximize your returns with these proven strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">How do I use a compound interest calculator?</h4>
              <p className="text-sm text-muted-foreground">
                To use our compound interest calculator, enter your initial investment amount, annual interest rate, investment time period, and monthly contribution amount. The calculator will instantly show your projected returns, total contributions, and interest earned over time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What is the difference between simple and compound interest?</h4>
              <p className="text-sm text-muted-foreground">
                Simple interest is calculated only on the principal amount, while compound interest is calculated on both the principal and accumulated interest. Compound interest grows faster over time because you earn interest on your interest, creating exponential growth.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How accurate are compound interest calculators?</h4>
              <p className="text-sm text-muted-foreground">
                Our compound interest calculator uses industry-standard formulas and provides accurate projections based on your inputs. However, actual returns may vary due to market fluctuations, fees, and tax implications. Always consult with a financial advisor for personalized advice.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What is the best frequency for compound interest?</h4>
              <p className="text-sm text-muted-foreground">
                More frequent compounding (daily or monthly) typically yields slightly higher returns than annual compounding. However, the difference becomes less significant as compounding frequency increases. Focus on starting early and making regular contributions for maximum impact.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How much should I invest to reach my financial goals?</h4>
              <p className="text-sm text-muted-foreground">
                Use our calculator to experiment with different investment amounts and time periods. Start with your current savings and gradually increase contributions as your income grows. Remember, even small regular investments can grow significantly over time due to compound interest.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CompoundInterestPage() {
  return (
    <>
      <Helmet>
        <title>Compound Interest Calculator - Free Investment Growth Calculator | Fin Tools Lab</title>
        <meta 
          name="description" 
          content="Calculate compound interest with our free calculator. See how your investments grow over time with interactive charts, multiple currencies, and detailed projections. Perfect for retirement and investment planning." 
        />
        <meta name="keywords" content="compound interest calculator, investment calculator, compound interest, retirement planning, savings calculator, investment growth" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/compound-interest" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/compound-interest" />
        <meta property="og:title" content="Compound Interest Calculator - Free Investment Growth Calculator" />
        <meta property="og:description" content="Calculate compound interest with our free calculator. See how your investments grow over time with interactive charts and detailed projections." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/compound-interest" />
        <meta property="twitter:title" content="Compound Interest Calculator - Free Investment Growth Calculator" />
        <meta property="twitter:description" content="Calculate compound interest with our free calculator. See how your investments grow over time with interactive charts and detailed projections." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
      </Helmet>

      <div className="bg-background">
        <div className="container mx-auto container-padding section-padding">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
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
              <BreadcrumbItem>
                <BreadcrumbPage>Compound Interest</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Short Answer Box for Featured Snippets */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <p className="text-blue-800 text-base leading-relaxed">
              A <strong>compound interest calculator</strong> helps you determine how much your investments will grow over time, 
              accounting for interest earned on both the principal amount and accumulated interest. 
              Simply enter your initial investment, interest rate, time period, and contribution frequency 
              to see your projected returns and understand the power of compounding.
            </p>
          </div>

          {/* Calculator */}
          <CompoundInterestCalculator />

          {/* How it Works Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                How Compound Interest Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Understanding the mechanics behind compound interest and how to use our calculator effectively
              </p>
            </div>

            {/* Formula Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  The Compound Interest Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-mono text-sm md:text-base">
                      A = P(1 + r/n)^(nt)
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>A</strong> = Final amount (principal + interest)
                    </div>
                    <div>
                      <strong>P</strong> = Principal amount (initial investment)
                    </div>
                    <div>
                      <strong>r</strong> = Annual interest rate (as a decimal)
                    </div>
                    <div>
                      <strong>n</strong> = Number of times interest is compounded per year
                    </div>
                    <div>
                      <strong>t</strong> = Time in years
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <div className="grid md:grid-cols-2 gap-6">
              {educationalContent.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Example Walkthrough (lazy) */}
          <Suspense fallback={<PageLoadingSpinner text="Loading example..." />}>
            <ExampleWalkthrough />
          </Suspense>

          {/* Tips Section (lazy) */}
          <Suspense fallback={<PageLoadingSpinner text="Loading tips..." />}>
            <TipsSection />
          </Suspense>

          {/* FAQ Section (lazy) */}
          <Suspense fallback={<PageLoadingSpinner text="Loading FAQs..." />}>
            <FAQSection />
          </Suspense>

          {/* AdSense Footer (lazy) */}
          <Suspense fallback={<PageLoadingSpinner text="Loading ads..." />}>
            <div className="mt-16">
              <FooterAd />
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}