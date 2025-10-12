import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EnhancedPieChart, EnhancedBarChart } from '@/components/ui/enhanced-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Home, DollarSign, Calendar, TrendingDown, PieChart, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MortgageData {
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
}

// Tooltip content for each label
const labelTooltips = {
  loanAmount: 'The total amount you are borrowing for your home purchase.',
  downPayment: 'The upfront payment you make when buying a home. A higher down payment reduces your loan amount and monthly payment.',
  interestRate: 'The annual interest rate charged by your lender, expressed as a percentage.',
  loanTerm: 'The length of your mortgage, typically 15 or 30 years.',
  propertyTax: 'Annual property tax rate as a percentage of your home value.',
  insurance: 'Yearly cost of homeowners insurance.',
  pmi: 'Private Mortgage Insurance, required if your down payment is less than 20%.',
};

export function MortgageCalculator() {
  const [data, setData] = useState<MortgageData>({
    loanAmount: 400000,
    downPayment: 80000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTax: 1.2,
    insurance: 1200,
    pmi: 0.5
  });

  const results = useMemo(() => {
    const principal = data.loanAmount - data.downPayment;
    const monthlyRate = data.interestRate / 100 / 12;
    const totalPayments = data.loanTerm * 12;
    
    // Monthly payment calculation
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    // Additional monthly costs
    const monthlyPropertyTax = (data.loanAmount * data.propertyTax / 100) / 12;
    const monthlyInsurance = data.insurance / 12;
    const monthlyPMI = principal < data.loanAmount * 0.8 ? (principal * data.pmi / 100) / 12 : 0;
    
    const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI;
    const totalInterest = (monthlyPayment * totalPayments) - principal;
    
    // Amortization schedule
    let balance = principal;
    const schedule = [];
    
    for (let month = 1; month <= Math.min(totalPayments, 360); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      if (month <= 12 || month % 12 === 0) {
        schedule.push({
          year: Math.ceil(month / 12),
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance),
          totalPaid: monthlyPayment * month
        });
      }
    }

    return {
      principal,
      monthlyPayment,
      totalMonthlyPayment,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyPMI,
      totalInterest,
      totalCost: monthlyPayment * totalPayments,
      schedule
    };
  }, [data]);

  const chartData = results.schedule.map(item => ({
    year: `Year ${item.year}`,
    Principal: item.principal,
    Interest: item.interest,
    'Remaining Balance': item.balance
  }));

  const pieData = [
    { name: 'Principal & Interest', value: results.monthlyPayment, gradient: ['#2563eb', '#60a5fa'] },
    { name: 'Property Tax', value: results.monthlyPropertyTax, gradient: ['#f59e42', '#fbbf24'] },
    { name: 'Insurance', value: results.monthlyInsurance, gradient: ['#22c55e', '#bbf7d0'] },
    { name: 'PMI', value: results.monthlyPMI, gradient: ['#a21caf', '#f472b6'] }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-financial-blue to-financial-blue-light rounded-xl">
          <Home className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Mortgage Calculator</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Calculate monthly payments, total interest, and amortization schedules for home loans
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className="financial-card bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Loan Details
              </CardTitle>
              <CardDescription>Enter your mortgage information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homePrice" className="flex items-center gap-1 font-bold">
                  Home Price
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {labelTooltips.loanAmount}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="homePrice"
                  type="number"
                  value={data.loanAmount}
                  onChange={(e) => setData(prev => ({ ...prev, loanAmount: Number(e.target.value) }))}
                  className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downPayment" className="flex items-center gap-1 font-bold">
                  Down Payment
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {labelTooltips.downPayment}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={data.downPayment}
                  onChange={(e) => setData(prev => ({ ...prev, downPayment: Number(e.target.value) }))}
                  className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate" className="flex items-center gap-1 font-bold">
                  Interest Rate (%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {labelTooltips.interestRate}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  value={data.interestRate}
                  onChange={(e) => setData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                  className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTerm" className="flex items-center gap-1 font-bold">
                  Loan Term
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {labelTooltips.loanTerm}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={data.loanTerm.toString()} onValueChange={(value) => setData(prev => ({ ...prev, loanTerm: Number(value) }))}>
                  <SelectTrigger className="border-slate-300 focus:border-primary bg-white rounded-md shadow-sm text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-md shadow-lg">
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="25">25 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyTax" className="flex items-center gap-1 font-bold">
                  Property Tax Rate (%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {labelTooltips.propertyTax}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="propertyTax"
                  type="number"
                  step="0.01"
                  value={data.propertyTax}
                  onChange={(e) => setData(prev => ({ ...prev, propertyTax: Number(e.target.value) }))}
                  className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance" className="flex items-center gap-1 font-bold">
                  Home Insurance (Annual)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {labelTooltips.insurance}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="insurance"
                  type="number"
                  value={data.insurance}
                  onChange={(e) => setData(prev => ({ ...prev, insurance: Number(e.target.value) }))}
                  className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pmi" className="flex items-center gap-1 font-bold">
                  PMI Rate (%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {labelTooltips.pmi}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="pmi"
                  type="number"
                  step="0.01"
                  value={data.pmi}
                  onChange={(e) => setData(prev => ({ ...prev, pmi: Number(e.target.value) }))}
                  className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Monthly Payment */}
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-4 w-4" />
                  Monthly Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-primary">${results.totalMonthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  <span className="text-sm text-muted-foreground mt-1">Principal & Interest: ${results.monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
              </CardContent>
            </Card>

            {/* Loan Amount */}
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-4 w-4" />
                  Loan Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-green-600">${results.principal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  <span className="text-sm text-muted-foreground mt-1">Amount borrowed after down payment</span>
                  <span className="text-sm mt-1 opacity-0 select-none">placeholder</span>
                </div>
              </CardContent>
            </Card>

            {/* Total Interest */}
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingDown className="h-4 w-4" />
                  Total Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-destructive">${results.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  <span className="text-sm text-muted-foreground mt-1">Over {data.loanTerm} years</span>
                  <span className="text-sm mt-1 opacity-0 select-none">placeholder</span>
                </div>
              </CardContent>
            </Card>

            {/* Total Cost */}
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-4 w-4" />
                  Total Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-yellow-600">${results.totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  <span className="text-sm text-muted-foreground mt-1">Total of all payments (principal + interest)</span>
                  <span className="text-sm mt-1 opacity-0 select-none">placeholder</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Breakdown Chart */}
          <Card className="modern-card shadow-lg p-4">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Monthly Payment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedPieChart
                data={pieData}
                height={320}
                showLabels={true}
                valueFormatter={v => `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                innerRadius={60}
                outerRadius={100}
                className="pie-gradient"
              />
            </CardContent>
          </Card>

          {/* Amortization Chart */}
          <Card className="modern-card shadow-lg p-4 mt-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Payment Schedule Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedBarChart
                data={chartData}
                bars={[
                  { dataKey: 'Principal', name: 'Principal', color: 'url(#principalGradient)', radius: [8, 8, 0, 0] },
                  { dataKey: 'Interest', name: 'Interest', color: 'url(#interestGradient)', radius: [8, 8, 0, 0] }
                ]}
                height={400}
                className="bar-gradient"
                labelFormatter={label => label}
                valueFormatter={(v, n) => [`$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, n]}
              />
              {/* SVG gradients for Recharts */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                  <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e42" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}