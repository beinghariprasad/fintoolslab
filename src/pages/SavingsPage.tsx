import { lazy, Suspense } from 'react';
import { SavingsCalculator } from '@/components/calculators/SavingsCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Target, PiggyBank, DollarSign, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';
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
    title: 'Emergency Fund Importance',
    content: 'An emergency fund covers unexpected expenses like job loss, medical bills, or major repairs. Aim for 3-6 months of living expenses in a high-yield savings account for easy access.',
    icon: BookOpen
  },
  {
    title: 'SMART Goals',
    content: 'Make savings goals Specific, Measurable, Achievable, Relevant, and Time-bound. Clear goals with deadlines help maintain motivation and track progress effectively.',
    icon: Target
  },
  {
    title: 'High-Yield Savings',
    content: 'Use high-yield savings accounts to earn more interest on your savings. Online banks often offer higher rates than traditional banks, helping your money grow faster.',
    icon: PiggyBank
  },
  {
    title: 'Automatic Savings',
    content: 'Set up automatic transfers to your savings account. Treating savings like a bill ensures consistent progress toward your goals without relying on willpower alone.',
    icon: DollarSign
  }
];

const tips = [
  'Start with small, achievable goals to build the savings habit',
  'Pay yourself first - save before spending on discretionary items',
  'Use separate accounts for different savings goals',
  'Take advantage of high-yield savings accounts for better returns',
  'Review and adjust your savings goals regularly',
  'Consider increasing savings when you get raises or bonuses'
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
            See how savings planning works with a real example
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Scenario:</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Goal: $12,000 for a vacation</li>
                <li>• Current savings: $2,000</li>
                <li>• Timeline: 2 years</li>
                <li>• Interest rate: 2% (high-yield savings)</li>
              </ul>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$2,000</div>
                <div className="text-sm text-blue-700">Current Savings</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$10,000</div>
                <div className="text-sm text-green-700">Amount to Save</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$410</div>
                <div className="text-sm text-purple-700">Monthly Contribution</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This example shows how saving $410 per month for 2 years, starting with $2,000, can help you reach a $12,000 goal (with a little help from interest).
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
            <PiggyBank className="h-5 w-5" />
            Savings Tips
          </CardTitle>
          <CardDescription>
            Maximize your savings with these proven strategies
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
              <h4 className="font-semibold mb-2">How much should I save for an emergency fund?</h4>
              <p className="text-sm text-muted-foreground">
                Financial experts recommend saving 3-6 months of living expenses for an emergency fund. This covers unexpected expenses like job loss, medical bills, or major repairs. Start with a smaller goal like $1,000, then build up to the full amount.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do I calculate monthly savings for a goal?</h4>
              <p className="text-sm text-muted-foreground">
                Divide your goal amount by the number of months until your target date. For example, to save $6,000 in 12 months, you need $500 monthly. Consider interest earned to potentially reduce your monthly contribution amount.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What's the best way to save money consistently?</h4>
              <p className="text-sm text-muted-foreground">
                Set up automatic transfers to your savings account on payday. Treat savings like a bill that must be paid. Start with small amounts and increase gradually. Use separate accounts for different goals to stay organized.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Should I save or invest my money?</h4>
              <p className="text-sm text-muted-foreground">
                Save first for short-term goals (under 5 years) and emergency funds. Invest for long-term goals (5+ years) to take advantage of compound growth. High-yield savings accounts offer better returns than traditional savings while maintaining accessibility.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How much should I save each month?</h4>
              <p className="text-sm text-muted-foreground">
                Aim to save 10-20% of your income, but start with what you can afford. Even $50-100 monthly adds up over time. Increase your savings rate when you get raises or pay off debt. Focus on building the habit first, then optimize the amount.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SavingsPage() {
  return (
    <>
      <Helmet>
        <title>Savings Goal Calculator - Emergency Fund & Goal Planning | Fin Tools Lab</title>
        <meta 
          name="description" 
          content="Calculate how much to save monthly to reach your financial goals. Plan for emergency funds, vacations, and major purchases." 
        />
        <meta name="keywords" content="savings calculator, emergency fund, savings goal, financial planning, budget calculator, savings plan" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/savings" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/savings" />
        <meta property="og:title" content="Savings Goal Calculator - Emergency Fund & Goal Planning" />
        <meta property="og:description" content="Calculate how much to save monthly to reach your financial goals with our free savings calculator." />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/savings" />
        <meta property="twitter:title" content="Savings Goal Calculator - Emergency Fund & Goal Planning" />
        <meta property="twitter:description" content="Calculate how much to save monthly to reach your financial goals with our free savings calculator." />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Savings Goal Calculator",
            "description": "Free savings calculator for emergency funds and financial goal planning",
            "url": "https://fintoolslab.com/calculators/savings",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Emergency fund planning",
              "Goal-based savings calculation",
              "Monthly contribution planning",
              "Timeline projection",
              "Interest growth calculation"
            ],
            "screenshot": "https://fintoolslab.com/calculators/savings",
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
                "name": "How much should I save for an emergency fund?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Financial experts recommend saving 3-6 months of living expenses for an emergency fund. This covers unexpected expenses like job loss, medical bills, or major repairs. Start with a smaller goal like $1,000, then build up to the full amount."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate monthly savings for a goal?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Divide your goal amount by the number of months until your target date. For example, to save $6,000 in 12 months, you need $500 monthly. Consider interest earned to potentially reduce your monthly contribution amount."
                }
              },
              {
                "@type": "Question",
                "name": "What's the best way to save money consistently?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Set up automatic transfers to your savings account on payday. Treat savings like a bill that must be paid. Start with small amounts and increase gradually. Use separate accounts for different goals to stay organized."
                }
              },
              {
                "@type": "Question",
                "name": "Should I save or invest my money?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Save first for short-term goals (under 5 years) and emergency funds. Invest for long-term goals (5+ years) to take advantage of compound growth. High-yield savings accounts offer better returns than traditional savings while maintaining accessibility."
                }
              },
              {
                "@type": "Question",
                "name": "How much should I save each month?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Aim to save 10-20% of your income, but start with what you can afford. Even $50-100 monthly adds up over time. Increase your savings rate when you get raises or pay off debt. Focus on building the habit first, then optimize the amount."
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
                    <PiggyBank className="h-3 w-3" />
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
                <BreadcrumbPage>Savings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Short Answer Box for Featured Snippets */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <p className="text-blue-800 text-base leading-relaxed">
              A <strong>savings calculator</strong> helps you determine how much to save monthly to reach your financial goals. 
              Enter your target amount, timeline, and current savings to see your required monthly contribution. Whether you're 
              building an emergency fund, saving for a vacation, or planning a major purchase, this tool helps you stay on track.
            </p>
          </div>

          {/* Calculator */}
          <SavingsCalculator />

          {/* How it Works Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                How Savings Planning Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Understanding savings calculations and how to use our calculator effectively
              </p>
            </div>

            {/* Formula Section - Moved to top for better flow */}
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-financial-success/10 rounded-lg flex items-center justify-center">
                    <Calculator className="h-4 w-4 text-financial-success" />
                  </div>
                  The Savings Goal Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <p className="text-center text-lg font-mono mb-3">
                    Monthly Savings = (Goal Amount - Current Savings) ÷ Months to Goal
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>Goal Amount</strong> = Target savings amount<br />
                      <strong>Current Savings</strong> = Already saved amount
                    </div>
                    <div>
                      <strong>Months to Goal</strong> = Timeline to reach goal<br />
                      <strong>Monthly Savings</strong> = Required monthly contribution
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  This formula helps you determine how much to save each month to reach your financial goal by your target date.
                </p>
                
                {/* Step-by-step process */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">How the Formula Works:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Goal Amount:</strong> Your target savings amount</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Current Savings:</strong> Amount you've already saved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Remaining Amount:</strong> Goal minus current savings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Monthly Savings:</strong> Remaining amount divided by months</span>
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