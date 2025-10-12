import { lazy, Suspense } from 'react';
import { RetirementCalculator } from '@/components/calculators/RetirementCalculator';
import { HeaderAd } from '@/components/ads/AdSenseUnit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Target, Wallet, TrendingUp, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';
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
    title: 'Retirement Planning Basics',
    content: 'Retirement planning involves estimating future expenses and building sufficient savings to maintain your desired lifestyle. Start early to take advantage of compound growth and employer benefits.',
    icon: BookOpen
  },
  {
    title: 'The 4% Rule',
    content: 'A common guideline suggests withdrawing 4% of your retirement savings annually. This rate historically preserves capital while providing income. However, consider your specific situation and market conditions.',
    icon: Target
  },
  {
    title: 'Employer Matching',
    content: 'Always contribute enough to get your full employer 401(k) match - it\'s free money. Employer matches can significantly boost your retirement savings over time.',
    icon: Wallet
  },
  {
    title: 'Inflation Impact',
    content: 'Inflation reduces purchasing power over time. What costs $1,000 today might cost $1,500 in 20 years at 2% inflation. Plan for inflation when calculating retirement needs.',
    icon: TrendingUp
  }
];

const tips = [
  'Start contributing to retirement accounts as early as possible',
  'Maximize employer 401(k) matching - it\'s free money',
  'Consider both traditional and Roth retirement accounts',
  'Increase contributions when you get raises or bonuses',
  'Don\'t touch retirement savings early - penalties are costly',
  'Review and adjust your plan annually as circumstances change'
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
            See how retirement planning works with a real example
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Scenario:</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Current age: 30</li>
                <li>• Retirement age: 65</li>
                <li>• Current savings: $50,000</li>
                <li>• Annual contribution: $10,000</li>
                <li>• Expected return: 7%</li>
              </ul>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$350,000</div>
                <div className="text-sm text-blue-700">Total Contributions</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$900,000</div>
                <div className="text-sm text-green-700">Investment Growth</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$1,250,000</div>
                <div className="text-sm text-purple-700">Final Retirement Balance</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This example shows how consistent saving and compound growth can turn $350,000 in contributions into $1,250,000 by retirement.
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
            Retirement Tips
          </CardTitle>
          <CardDescription>
            Maximize your retirement savings with these proven strategies
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
              <h4 className="font-semibold mb-2">How much should I save for retirement?</h4>
              <p className="text-sm text-muted-foreground">
                A common guideline is to save 10-15% of your income, including employer matches. However, the exact amount depends on your age, desired retirement lifestyle, current savings, and expected retirement age. Use our calculator to project different scenarios.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What is the 4% rule for retirement withdrawals?</h4>
              <p className="text-sm text-muted-foreground">
                The 4% rule suggests you can withdraw 4% of your retirement savings annually while preserving your principal. For example, with $1 million saved, you could withdraw $40,000 annually. This rule accounts for inflation and market fluctuations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How does employer 401k matching work?</h4>
              <p className="text-sm text-muted-foreground">
                Many employers match a percentage of your 401k contributions, typically 3-6% of your salary. For example, if your employer matches 50% up to 6%, and you contribute 6% of your $50,000 salary ($3,000), your employer adds $1,500 - essentially free money.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">When should I start saving for retirement?</h4>
              <p className="text-sm text-muted-foreground">
                Start as early as possible to take advantage of compound growth. Even small contributions in your 20s can grow significantly over time. If you're already in your 30s or 40s, start immediately and consider increasing your contribution rate.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How does inflation affect retirement planning?</h4>
              <p className="text-sm text-muted-foreground">
                Inflation reduces purchasing power over time. At 2% annual inflation, what costs $1,000 today will cost $1,486 in 20 years. Factor inflation into your retirement planning by assuming higher future expenses and adjusting your savings goals accordingly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RetirementPage() {
  return (
    <>
      <Helmet>
        <title>Retirement Calculator - 401k & Retirement Planning Calculator | Fin Tools Lab</title>
        <meta 
          name="description" 
          content="Plan for retirement with comprehensive savings and withdrawal analysis. Calculate 401k growth, employer matching, and retirement income." 
        />
        <meta name="keywords" content="retirement calculator, 401k calculator, retirement planning, retirement savings, pension calculator, IRA calculator" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/retirement" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/retirement" />
        <meta property="og:title" content="Retirement Calculator - 401k & Retirement Planning Calculator" />
        <meta property="og:description" content="Plan for retirement with comprehensive savings and withdrawal analysis using our free retirement calculator." />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/retirement" />
        <meta property="twitter:title" content="Retirement Calculator - 401k & Retirement Planning Calculator" />
        <meta property="twitter:description" content="Plan for retirement with comprehensive savings and withdrawal analysis using our free retirement calculator." />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Retirement Calculator",
            "description": "Free retirement calculator with 401k and comprehensive retirement planning",
            "url": "https://fintoolslab.com/calculators/retirement",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "401k growth projection",
              "Employer matching calculation",
              "Retirement income planning",
              "Inflation adjustment",
              "Withdrawal strategy analysis"
            ],
            "screenshot": "https://fintoolslab.com/calculators/retirement",
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
                "name": "How much should I save for retirement?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A common guideline is to save 10-15% of your income, including employer matches. However, the exact amount depends on your age, desired retirement lifestyle, current savings, and expected retirement age. Use our calculator to project different scenarios."
                }
              },
              {
                "@type": "Question",
                "name": "What is the 4% rule for retirement withdrawals?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The 4% rule suggests you can withdraw 4% of your retirement savings annually while preserving your principal. For example, with $1 million saved, you could withdraw $40,000 annually. This rule accounts for inflation and market fluctuations."
                }
              },
              {
                "@type": "Question",
                "name": "How does employer 401k matching work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Many employers match a percentage of your 401k contributions, typically 3-6% of your salary. For example, if your employer matches 50% up to 6%, and you contribute 6% of your $50,000 salary ($3,000), your employer adds $1,500 - essentially free money."
                }
              },
              {
                "@type": "Question",
                "name": "When should I start saving for retirement?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Start as early as possible to take advantage of compound growth. Even small contributions in your 20s can grow significantly over time. If you're already in your 30s or 40s, start immediately and consider increasing your contribution rate."
                }
              },
              {
                "@type": "Question",
                "name": "How does inflation affect retirement planning?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Inflation reduces purchasing power over time. At 2% annual inflation, what costs $1,000 today will cost $1,486 in 20 years. Factor inflation into your retirement planning by assuming higher future expenses and adjusting your savings goals accordingly."
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
                <BreadcrumbPage>Retirement</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Short Answer Box for Featured Snippets */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <p className="text-blue-800 text-base leading-relaxed">
              A <strong>retirement calculator</strong> helps you plan for your financial future by projecting your retirement savings growth, 
              calculating employer 401k matches, and estimating your retirement income. Enter your current savings, contribution rates, 
              and retirement goals to see if you're on track for a comfortable retirement.
            </p>
          </div>

          {/* Calculator */}
          <RetirementCalculator />

          {/* How it Works Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                How Retirement Planning Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Understanding retirement calculations and how to use our calculator effectively
              </p>
            </div>

            {/* Formula Section - Moved to top for better flow */}
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-financial-success/10 rounded-lg flex items-center justify-center">
                    <Calculator className="h-4 w-4 text-financial-success" />
                  </div>
                  The 4% Rule for Retirement Withdrawals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <p className="text-center text-lg font-mono mb-3">
                    Monthly Income = Total Savings × 0.04 ÷ 12
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>4% Rule</strong> = Annual withdrawal rate<br />
                      <strong>Total Savings</strong> = Final retirement balance
                    </div>
                    <div>
                      <strong>Monthly Income</strong> = Sustainable monthly withdrawal
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  The 4% rule suggests you can withdraw 4% of your retirement savings annually while preserving your principal.
                </p>
                
                {/* Step-by-step process */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">How the 4% Rule Works:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Total Savings:</strong> Your retirement portfolio value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>4% Withdrawal:</strong> Annual amount you can safely withdraw</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Monthly Income:</strong> Divide annual withdrawal by 12</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Principal Preservation:</strong> Remaining balance continues growing</span>
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