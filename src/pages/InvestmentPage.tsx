import { lazy, Suspense } from 'react';
import { InvestmentCalculator } from '@/components/calculators/InvestmentCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Target, TrendingUp, PiggyBank, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';
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

const educationalContent = [
  {
    title: 'Investment Basics',
    content: 'Investing involves purchasing assets with the expectation of generating income or appreciation. Diversification across different asset classes helps manage risk while pursuing returns over the long term.',
    icon: BookOpen
  },
  {
    title: 'Risk vs Return',
    content: 'Higher potential returns typically come with higher risk. Conservative investments offer stability but lower returns, while aggressive investments offer higher potential returns with more volatility.',
    icon: Target
  },
  {
    title: 'Time Horizon',
    content: 'Your investment timeline affects your strategy. Longer time horizons allow for more aggressive investments and recovery from market downturns, while shorter horizons require more conservative approaches.',
    icon: TrendingUp
  },
  {
    title: 'Tax Implications',
    content: 'Different investments have different tax treatments. Consider tax-advantaged accounts like 401(k)s and IRAs, and understand the difference between capital gains and ordinary income taxation.',
    icon: PiggyBank
  }
];

const tips = [
  'Start investing early to take advantage of compound growth',
  'Diversify across different asset classes and geographic regions',
  'Consider low-cost index funds for broad market exposure',
  'Rebalance your portfolio periodically to maintain target allocation',
  'Don\'t try to time the market - consistency beats timing',
  'Keep fees low as they can significantly impact long-term returns'
];

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
            See how investment growth works with a real example
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Scenario:</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Initial investment: $5,000</li>
                <li>• Annual return rate: 8%</li>
                <li>• Monthly contribution: $200</li>
                <li>• Time period: 25 years</li>
              </ul>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$65,000</div>
                <div className="text-sm text-blue-700">Total Contributions</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$120,000</div>
                <div className="text-sm text-green-700">Investment Growth</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$185,000</div>
                <div className="text-sm text-purple-700">Final Portfolio Value</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This example shows how regular investing and compound growth can turn $65,000 in contributions into $185,000 over 25 years.
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
            <TrendingUp className="h-5 w-5" />
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
              <h4 className="font-semibold mb-2">How do I calculate investment returns?</h4>
              <p className="text-sm text-muted-foreground">
                To calculate investment returns, enter your initial investment, expected annual return rate, time period, and any regular contributions. Our calculator will show your projected portfolio value, total contributions, and total returns including compound growth.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What is compound interest and how does it work?</h4>
              <p className="text-sm text-muted-foreground">
                Compound interest is when your investment earnings generate additional earnings over time. For example, if you earn 7% annually on $10,000, you'll have $10,700 after year 1, $11,449 after year 2, and so on. The longer you invest, the more powerful compound growth becomes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How much should I invest for retirement?</h4>
              <p className="text-sm text-muted-foreground">
                A common rule is to save 10-15% of your income for retirement. However, the exact amount depends on your age, desired retirement lifestyle, and current savings. Use our calculator to project different scenarios and find what works for your situation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What's the difference between simple and compound interest?</h4>
              <p className="text-sm text-muted-foreground">
                Simple interest is calculated only on the principal amount, while compound interest is calculated on both principal and accumulated interest. Compound interest grows faster over time, making it more beneficial for long-term investments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do I choose the right investment return rate?</h4>
              <p className="text-sm text-muted-foreground">
                Historical stock market returns average 7-10% annually, but past performance doesn't guarantee future results. Conservative estimates use 5-7%, moderate 7-9%, and aggressive 9-12%. Consider your risk tolerance and investment timeline when choosing a rate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvestmentPage() {
  return (
    <>
      <Helmet>
        <title>Investment Calculator - Portfolio Growth & Risk Analysis | Fin Tools Lab</title>
        <meta 
          name="description" 
          content="Analyze investment returns with different scenarios and timeframes. Calculate portfolio growth, risk assessment, and tax implications." 
        />
        <meta name="keywords" content="investment calculator, portfolio growth, risk analysis, investment returns, asset allocation, retirement investing" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/investment" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/investment" />
        <meta property="og:title" content="Investment Calculator - Portfolio Growth & Risk Analysis" />
        <meta property="og:description" content="Analyze investment returns with different scenarios and timeframes using our free investment calculator." />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/investment" />
        <meta property="twitter:title" content="Investment Calculator - Portfolio Growth & Risk Analysis" />
        <meta property="twitter:description" content="Analyze investment returns with different scenarios and timeframes using our free investment calculator." />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Investment Calculator",
            "description": "Free investment calculator with portfolio growth and risk analysis",
            "url": "https://fintoolslab.com/calculators/investment",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Portfolio growth projection",
              "Compound interest calculation",
              "Risk analysis",
              "Tax implications",
              "Regular contribution planning"
            ],
            "screenshot": "https://fintoolslab.com/calculators/investment",
            "softwareVersion": "1.0",
            "author": {
              "@type": "Organization",
              "name": "Fin Tools Lab"
            }
          })}
        </script>
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I calculate investment returns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To calculate investment returns, enter your initial investment, expected annual return rate, time period, and any regular contributions. Our calculator will show your projected portfolio value, total contributions, and total returns including compound growth."
                }
              },
              {
                "@type": "Question",
                "name": "What is compound interest and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Compound interest is when your investment earnings generate additional earnings over time. For example, if you earn 7% annually on $10,000, you'll have $10,700 after year 1, $11,449 after year 2, and so on. The longer you invest, the more powerful compound growth becomes."
                }
              },
              {
                "@type": "Question",
                "name": "How much should I invest for retirement?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A common rule is to save 10-15% of your income for retirement. However, the exact amount depends on your age, desired retirement lifestyle, and current savings. Use our calculator to project different scenarios and find what works for your situation."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between simple and compound interest?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simple interest is calculated only on the principal amount, while compound interest is calculated on both principal and accumulated interest. Compound interest grows faster over time, making it more beneficial for long-term investments."
                }
              },
              {
                "@type": "Question",
                "name": "How do I choose the right investment return rate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Historical stock market returns average 7-10% annually, but past performance doesn't guarantee future results. Conservative estimates use 5-7%, moderate 7-9%, and aggressive 9-12%. Consider your risk tolerance and investment timeline when choosing a rate."
                }
              }
            ]
          })}
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
                    <Target className="h-3 w-3" />
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
                <BreadcrumbPage>Investment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Short Answer Box for Featured Snippets */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <p className="text-blue-800 text-base leading-relaxed">
              An <strong>investment calculator</strong> helps you project the future value of your investments using compound interest. 
              Enter your initial investment, expected annual return rate, time period, and regular contributions to see how your 
              money can grow over time and plan for long-term financial goals like retirement.
            </p>
          </div>

          {/* Calculator */}
          <InvestmentCalculator />

          {/* How it Works Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                How Investment Growth Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Understanding compound interest and how to use our investment calculator effectively
              </p>
            </div>

            {/* Formula Section - Moved to top for better flow */}
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-financial-success/10 rounded-lg flex items-center justify-center">
                    <Calculator className="h-4 w-4 text-financial-success" />
                  </div>
                  The Investment Growth Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <p className="text-center text-lg font-mono mb-3">
                    FV = PV(1 + r)<sup>t</sup> + PMT[((1 + r)<sup>t</sup> - 1) / r]
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>FV</strong> = Future value<br />
                      <strong>PV</strong> = Present value<br />
                      <strong>r</strong> = Annual return rate
                    </div>
                    <div>
                      <strong>t</strong> = Time in years<br />
                      <strong>PMT</strong> = Regular contributions
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  This formula calculates the future value of an investment with regular contributions and compound growth.
                </p>
                
                {/* Step-by-step process */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">How the Formula Works:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Present Value (PV):</strong> Your initial investment amount</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Rate (r):</strong> Annual return rate (as a decimal)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Time (t):</strong> Investment period in years</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Contributions (PMT):</strong> Regular monthly or annual contributions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Future Value (FV):</strong> Your projected portfolio value</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {educationalContent.map((item, index) => (
                <Card key={item.title} className="financial-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
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
          </div>

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