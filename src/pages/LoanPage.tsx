import { lazy, Suspense } from 'react';
import { LoanCalculator } from '@/components/calculators/LoanCalculator';
import { HeaderAd } from '@/components/ads/AdSenseUnit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, CreditCard, TrendingDown, DollarSign, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';
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
    title: 'Types of Loans',
    content: 'Personal loans are unsecured and have higher interest rates. Auto loans are secured by the vehicle with lower rates. Student loans often have favorable terms and tax benefits. Each type has different requirements and benefits.',
    icon: BookOpen
  },
  {
    title: 'Interest Rates',
    content: 'Your credit score significantly impacts your interest rate. Secured loans typically offer better rates than unsecured loans. Shop around with multiple lenders to find the best rate for your situation.',
    icon: TrendingDown
  },
  {
    title: 'Loan Terms',
    content: 'Longer terms mean lower monthly payments but more total interest paid. Shorter terms have higher payments but save money overall. Choose based on your budget and financial goals.',
    icon: DollarSign
  },
  {
    title: 'Extra Payments',
    content: 'Making extra payments reduces the principal balance faster, saving interest and shortening the loan term. Even small additional payments can make a significant difference over time.',
    icon: CreditCard
  }
];

const tips = [
  'Check your credit score before applying to understand your rates',
  'Compare offers from multiple lenders including banks and credit unions',
  'Consider the total cost of the loan, not just monthly payments',
  'Read all terms and conditions, including prepayment penalties',
  'Make extra principal payments when possible to save on interest',
  'Avoid borrowing more than you need, even if pre-approved for more'
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
            See how a loan works with a real example
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Scenario:</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Loan amount: $20,000</li>
                <li>• Interest rate: 8%</li>
                <li>• Loan term: 5 years</li>
                <li>• Extra monthly payment: $50</li>
              </ul>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$406</div>
                <div className="text-sm text-blue-700">Monthly Payment</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$4,360</div>
                <div className="text-sm text-green-700">Total Interest</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$24,360</div>
                <div className="text-sm text-purple-700">Total Cost</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This example shows how a $20,000 loan at 8% over 5 years results in $4,360 in interest, for a total cost of $24,360. Making extra payments can save you money and shorten your loan term.
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
            Loan Tips
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
              <h4 className="font-semibold mb-2">How do I calculate my loan payment?</h4>
              <p className="text-sm text-muted-foreground">
                To calculate your loan payment, enter your loan amount, interest rate, and loan term. Our calculator will show your monthly payment, total interest paid, and complete amortization schedule. You can also add extra payments to see how they affect your loan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What's the difference between secured and unsecured loans?</h4>
              <p className="text-sm text-muted-foreground">
                Secured loans are backed by collateral (like a car or house) and typically have lower interest rates. Unsecured loans (like personal loans) have no collateral and higher rates. Secured loans are less risky for lenders, hence the better terms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do extra payments affect my loan?</h4>
              <p className="text-sm text-muted-foreground">
                Extra payments reduce your principal balance faster, which decreases total interest paid and can shorten your loan term. Even small additional payments can save hundreds or thousands in interest over the life of the loan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Should I choose a longer or shorter loan term?</h4>
              <p className="text-sm text-muted-foreground">
                Longer terms have lower monthly payments but higher total interest costs. Shorter terms have higher payments but save money overall. Choose based on your monthly budget and long-term financial goals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How does my credit score affect loan rates?</h4>
              <p className="text-sm text-muted-foreground">
                Higher credit scores typically qualify for lower interest rates. A difference of just 1-2 percentage points can save thousands over the loan term. Check your credit score before applying and work to improve it if needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoanPage() {
  return (
    <>
      <Helmet>
        <title>Loan Calculator - Personal & Auto Loan Payment Calculator | Fin Tools Lab</title>
        <meta 
          name="description" 
          content="Calculate loan payments for personal loans, auto loans, and more. Free loan calculator with extra payment options and payoff schedules." 
        />
        <meta name="keywords" content="loan calculator, personal loan, auto loan, loan payment, interest rate, loan comparison" />
        <link rel="canonical" href="https://fintoolslab.com/calculators/loan" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/calculators/loan" />
        <meta property="og:title" content="Loan Calculator - Personal & Auto Loan Payment Calculator" />
        <meta property="og:description" content="Calculate loan payments for personal loans, auto loans, and more with our free loan calculator." />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/calculators/loan" />
        <meta property="twitter:title" content="Loan Calculator - Personal & Auto Loan Payment Calculator" />
        <meta property="twitter:description" content="Calculate loan payments for personal loans, auto loans, and more with our free loan calculator." />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Loan Calculator",
            "description": "Free loan calculator for personal, auto, and other loan types",
            "url": "https://fintoolslab.com/calculators/loan",
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
              "Extra payment analysis",
              "Interest savings calculator",
              "Loan comparison tools"
            ],
            "screenshot": "https://fintoolslab.com/calculators/loan",
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
                "name": "How do I calculate my loan payment?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To calculate your loan payment, enter your loan amount, interest rate, and loan term. Our calculator will show your monthly payment, total interest paid, and complete amortization schedule. You can also add extra payments to see how they affect your loan."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between secured and unsecured loans?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Secured loans are backed by collateral (like a car or house) and typically have lower interest rates. Unsecured loans (like personal loans) have no collateral and higher rates. Secured loans are less risky for lenders, hence the better terms."
                }
              },
              {
                "@type": "Question",
                "name": "How do extra payments affect my loan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Extra payments reduce your principal balance faster, which decreases total interest paid and can shorten your loan term. Even small additional payments can save hundreds or thousands in interest over the life of the loan."
                }
              },
              {
                "@type": "Question",
                "name": "Should I choose a longer or shorter loan term?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Longer terms have lower monthly payments but higher total interest costs. Shorter terms have higher payments but save money overall. Choose based on your monthly budget and long-term financial goals."
                }
              },
              {
                "@type": "Question",
                "name": "How does my credit score affect loan rates?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Higher credit scores typically qualify for lower interest rates. A difference of just 1-2 percentage points can save thousands over the loan term. Check your credit score before applying and work to improve it if needed."
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
                    <CreditCard className="h-3 w-3" />
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
                <BreadcrumbPage>Loan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Short Answer Box for Featured Snippets */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <p className="text-blue-800 text-base leading-relaxed">
              A <strong>loan calculator</strong> helps you determine your monthly loan payments, total interest costs, and payoff timeline. 
              Enter your loan amount, interest rate, and term to see your payment breakdown and understand the true cost of borrowing. 
              You can also explore how extra payments can save you money and shorten your loan term.
            </p>
          </div>

          {/* Calculator */}
          <LoanCalculator />

          {/* How it Works Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                How Loan Payments Work
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Understanding loan calculations and how to use our calculator effectively
              </p>
            </div>

            {/* Formula Section - Moved to top for better flow */}
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-financial-success/10 rounded-lg flex items-center justify-center">
                    <Calculator className="h-4 w-4 text-financial-success" />
                  </div>
                  The Loan Payment Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <p className="text-center text-lg font-mono mb-3">
                    PMT = P[r(1+r)<sup>n</sup>]/[(1+r)<sup>n</sup>-1]
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>PMT</strong> = Monthly payment<br />
                      <strong>P</strong> = Principal amount<br />
                      <strong>r</strong> = Monthly interest rate
                    </div>
                    <div>
                      <strong>n</strong> = Total number of payments
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  This formula calculates your fixed monthly payment amount for any type of installment loan.
                </p>
                
                {/* Step-by-step process */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">How the Formula Works:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-financial-success rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Principal (P):</strong> Your total loan amount</span>
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
                      <span><strong>Result (PMT):</strong> Your fixed monthly payment amount</span>
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