import { lazy, Suspense } from 'react';
import { MortgageCalculator } from '@/components/calculators/MortgageCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Home, TrendingDown, DollarSign, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';
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
    title: 'Understanding Mortgages',
    content: 'A mortgage is a loan specifically used to purchase real estate. The property serves as collateral for the loan. Mortgages typically have lower interest rates than personal loans because they are secured by the property value.',
    icon: BookOpen
  },
  {
    title: 'Down Payment Impact',
    content: 'A larger down payment reduces your loan amount, monthly payments, and total interest paid. It can also help you avoid Private Mortgage Insurance (PMI) if you put down 20% or more.',
    icon: Home
  },
  {
    title: 'Interest Rates Matter',
    content: 'Even a small difference in interest rates can significantly impact your monthly payment and total cost. A 1% difference on a $300,000 loan can cost or save you tens of thousands over the life of the loan.',
    icon: TrendingDown
  },
  {
    title: 'Additional Costs',
    content: 'Beyond principal and interest, homeowners pay property taxes, insurance, and possibly PMI. These costs are often escrowed with your monthly payment, making budgeting easier.',
    icon: DollarSign
  }
];

const tips = [
  'Save for a 20% down payment to avoid PMI and get better rates',
  'Shop around with multiple lenders to find the best interest rate',
  'Consider the total monthly payment, not just principal and interest',
  'Factor in maintenance, utilities, and other homeownership costs',
  'Get pre-approved to understand your budget before house hunting',
  'Consider shorter loan terms if you can afford higher payments'
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
            See how a mortgage works with a real example
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Scenario:</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Home price: $400,000</li>
                <li>• Down payment: $80,000 (20%)</li>
                <li>• Loan amount: $320,000</li>
                <li>• Interest rate: 6%</li>
                <li>• Loan term: 30 years</li>
              </ul>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$1,919</div>
                <div className="text-sm text-blue-700">Monthly Payment</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$371,640</div>
                <div className="text-sm text-green-700">Total Interest</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$691,640</div>
                <div className="text-sm text-purple-700">Total Cost</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This example shows how a $320,000 loan at 6% over 30 years results in $371,640 in interest, for a total cost of $691,640.
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
            <TrendingDown className="h-5 w-5" />
            Mortgage Tips
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
              <h4 className="font-semibold mb-2">How do I calculate my mortgage payment?</h4>
              <p className="text-sm text-muted-foreground">
                To calculate your mortgage payment, enter your loan amount, interest rate, loan term, and down payment. Our calculator will show your monthly principal and interest payment, plus estimates for property taxes, insurance, and PMI if applicable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What is PMI and when do I need it?</h4>
              <p className="text-sm text-muted-foreground">
                PMI (Private Mortgage Insurance) is required when your down payment is less than 20% of the home's value. It protects the lender if you default on the loan. PMI typically costs 0.5% to 1% of the loan amount annually and can be removed once you reach 20% equity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How much should I put down on a house?</h4>
              <p className="text-sm text-muted-foreground">
                A 20% down payment is ideal as it avoids PMI and provides better loan terms. However, many lenders accept 3-5% down payments for first-time buyers. Consider your savings, monthly budget, and long-term financial goals when deciding on your down payment amount.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What's the difference between 15-year and 30-year mortgages?</h4>
              <p className="text-sm text-muted-foreground">
                A 15-year mortgage has higher monthly payments but lower total interest costs and builds equity faster. A 30-year mortgage has lower monthly payments but higher total interest costs. Choose based on your monthly budget and long-term financial goals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do interest rates affect my mortgage payment?</h4>
              <p className="text-sm text-muted-foreground">
                Higher interest rates increase your monthly payment and total loan cost. A 1% rate difference on a $300,000 loan can change your monthly payment by $200-300 and total interest by tens of thousands of dollars over the loan term.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MortgagePage() {
  return (
    <>
      <Helmet>
        <title>Mortgage Calculator - Free Home Loan Payment Calculator | Fin Tools Lab</title>
        <meta 
          name="description" 
          content="Calculate mortgage payments, total interest, and amortization schedules. Free mortgage calculator with PMI, property tax, and insurance calculations." 
        />
        <meta name="keywords" content="mortgage calculator, home loan calculator, mortgage payment, interest rate, down payment, PMI calculator" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/mortgage" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/mortgage" />
        <meta property="og:title" content="Mortgage Calculator - Free Home Loan Payment Calculator" />
        <meta property="og:description" content="Calculate mortgage payments, total interest, and amortization schedules with our free mortgage calculator." />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/mortgage" />
        <meta property="twitter:title" content="Mortgage Calculator - Free Home Loan Payment Calculator" />
        <meta property="twitter:description" content="Calculate mortgage payments, total interest, and amortization schedules with our free mortgage calculator." />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mortgage Calculator",
            "description": "Free mortgage calculator with PMI, property tax, and insurance calculations",
            "url": "https://fintoolslab.com/calculators/mortgage",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Monthly payment calculation",
              "Amortization schedule",
              "PMI calculations",
              "Property tax estimates",
              "Insurance costs"
            ],
            "screenshot": "https://fintoolslab.com/calculators/mortgage",
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
                "name": "How do I calculate my mortgage payment?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To calculate your mortgage payment, enter your loan amount, interest rate, loan term, and down payment. Our calculator will show your monthly principal and interest payment, plus estimates for property taxes, insurance, and PMI if applicable."
                }
              },
              {
                "@type": "Question",
                "name": "What is PMI and when do I need it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "PMI (Private Mortgage Insurance) is required when your down payment is less than 20% of the home's value. It protects the lender if you default on the loan. PMI typically costs 0.5% to 1% of the loan amount annually and can be removed once you reach 20% equity."
                }
              },
              {
                "@type": "Question",
                "name": "How much should I put down on a house?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 20% down payment is ideal as it avoids PMI and provides better loan terms. However, many lenders accept 3-5% down payments for first-time buyers. Consider your savings, monthly budget, and long-term financial goals when deciding on your down payment amount."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between 15-year and 30-year mortgages?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 15-year mortgage has higher monthly payments but lower total interest costs and builds equity faster. A 30-year mortgage has lower monthly payments but higher total interest costs. Choose based on your monthly budget and long-term financial goals."
                }
              },
              {
                "@type": "Question",
                "name": "How do interest rates affect my mortgage payment?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Higher interest rates increase your monthly payment and total loan cost. A 1% rate difference on a $300,000 loan can change your monthly payment by $200-300 and total interest by tens of thousands of dollars over the loan term."
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
                <BreadcrumbPage>Mortgage</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Short Answer Box for Featured Snippets */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <p className="text-blue-800 text-base leading-relaxed">
              A <strong>mortgage calculator</strong> helps you determine your monthly home loan payments, including principal, 
              interest, property taxes, insurance, and PMI. Simply enter your loan amount, interest rate, loan term, 
              and down payment to see your total monthly payment and understand the full cost of homeownership.
            </p>
          </div>

          {/* Calculator */}
          <MortgageCalculator />

          {/* How it Works Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                How Mortgage Payments Work
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Understanding the mechanics behind mortgage calculations and how to use our calculator effectively
              </p>
            </div>

            {/* Formula Section - Moved to top for better flow */}
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-financial-success/10 rounded-lg flex items-center justify-center">
                    <Calculator className="h-4 w-4 text-financial-success" />
                  </div>
                  The Mortgage Payment Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <p className="text-center text-lg font-mono mb-3">
                    M = P[r(1+r)<sup>n</sup>]/[(1+r)<sup>n</sup>-1]
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>M</strong> = Monthly payment<br />
                      <strong>P</strong> = Principal amount<br />
                      <strong>r</strong> = Monthly interest rate
                    </div>
                    <div>
                      <strong>n</strong> = Total number of payments
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  This formula calculates your monthly principal and interest payment. Additional costs like taxes, insurance, and PMI are added separately.
                </p>
                
                {/* Step-by-step process */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">How the Formula Works:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Principal (P):</strong> Your loan amount after down payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Rate (r):</strong> Monthly interest rate (annual rate ÷ 12)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Payments (n):</strong> Total number of monthly payments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Result (M):</strong> Your monthly principal and interest payment</span>
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