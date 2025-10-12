import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EnhancedBarChart, EnhancedLineChart } from '@/components/ui/enhanced-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calculator, DollarSign, Calendar, TrendingDown, BarChart3, CreditCard, Info } from 'lucide-react';

interface LoanData {
  principal: number;
  interestRate: number;
  loanTerm: number;
  extraPayment: number;
  loanType: string;
}

export function LoanCalculator() {
  const [data, setData] = useState<LoanData>({
    principal: 25000,
    interestRate: 7.5,
    loanTerm: 5,
    extraPayment: 0,
    loanType: 'personal'
  });

  const results = useMemo(() => {
    const monthlyRate = data.interestRate / 100 / 12;
    const totalPayments = data.loanTerm * 12;
    
    // Monthly payment calculation
    const monthlyPayment = data.principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    const totalMonthlyPayment = monthlyPayment + data.extraPayment;
    const totalInterest = (monthlyPayment * totalPayments) - data.principal;
    
    // Calculate payoff time with extra payments
    let balance = data.principal;
    let months = 0;
    let totalInterestWithExtra = 0;
    
    while (balance > 0 && months < totalPayments * 2) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(totalMonthlyPayment - interestPayment, balance);
      
      totalInterestWithExtra += interestPayment;
      balance -= principalPayment;
      months++;
      
      if (balance <= 0) break;
    }
    
    // Payment schedule
    balance = data.principal;
    const schedule = [];
    
    for (let month = 1; month <= Math.min(totalPayments, 60); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        cumulativeInterest: schedule.reduce((sum, item) => sum + item.interest, 0) + interestPayment
      });
    }

    return {
      monthlyPayment,
      totalMonthlyPayment,
      totalInterest,
      totalCost: monthlyPayment * totalPayments,
      payoffMonths: months,
      interestSaved: totalInterest - totalInterestWithExtra,
      schedule
    };
  }, [data]);

  const chartData = results.schedule.map(item => ({
    year: item.month,
    Principal: item.principal,
    Interest: item.interest,
    'Remaining Balance': item.balance
  }));

  const loanTypes = {
    personal: { name: 'Personal Loan', description: 'Unsecured personal loan' },
    auto: { name: 'Auto Loan', description: 'Vehicle financing' },
    student: { name: 'Student Loan', description: 'Education financing' },
    business: { name: 'Business Loan', description: 'Commercial financing' }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartLabelFormatter = (label: number | string) => `Month ${label}`;
  const chartValueFormatter = (value: number | string, name: string): [string, string] => {
    const formattedValue = formatCurrency(Number(value));
    return [formattedValue, name] as [string, string];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Loan Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Calculate loan payments for personal loans, auto loans, and more
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className="financial-card bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Loan Details</CardTitle>
                  <CardDescription className="text-sm">
                    Configure your loan parameters
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Loan Type
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Type of loan you're calculating
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={data.loanType} onValueChange={(value) => setData(prev => ({ ...prev, loanType: value }))}>
                  <SelectTrigger className="border-slate-300 focus:border-primary bg-white rounded-md shadow-sm text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-md shadow-lg">
                    {Object.entries(loanTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Loan Amount
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Total amount you want to borrow
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    value={data.principal}
                    onChange={(e) => setData(prev => ({ ...prev, principal: Number(e.target.value) }))}
                    className="pl-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="25000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Interest Rate
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Annual interest rate on the loan
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    value={data.interestRate}
                    onChange={(e) => setData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                    className="pr-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="7.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Loan Term
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Duration of the loan in years
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={data.loanTerm.toString()} onValueChange={(value) => setData(prev => ({ ...prev, loanTerm: Number(value) }))}>
                  <SelectTrigger className="border-slate-300 focus:border-primary bg-white rounded-md shadow-sm text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-md shadow-lg">
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="4">4 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="7">7 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Extra Monthly Payment
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Additional amount to pay each month to reduce loan term
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    value={data.extraPayment}
                    onChange={(e) => setData(prev => ({ ...prev, extraPayment: Number(e.target.value) }))}
                    className="pl-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-md"
                size="lg"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Loan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Monthly Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(results.monthlyPayment)}
                </div>
                {data.extraPayment > 0 && (
                  <span className="text-sm text-muted-foreground mt-1">
                    Total: {formatCurrency(results.totalMonthlyPayment)}
                  </span>
                )}
              </CardContent>
            </Card>

            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  Total Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(results.totalInterest)}
                </div>
                {data.extraPayment > 0 && results.interestSaved > 0 && (
                  <span className="text-sm text-green-600 mt-1">
                    Save: {formatCurrency(results.interestSaved)}
                  </span>
                )}
              </CardContent>
            </Card>

            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Payoff Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(results.payoffMonths / 12)}y {results.payoffMonths % 12}m
                </div>
                <span className="text-sm text-muted-foreground mt-1">
                  {results.payoffMonths} months
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Payment Breakdown Chart */}
          <Card className="modern-card shadow-lg p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Payment Breakdown
              </CardTitle>
              <CardDescription className="text-base">
                See how your payments are split between principal and interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedBarChart
                data={chartData.slice(0, 24)}
                bars={[
                  { dataKey: 'Principal', name: 'Principal', color: 'url(#loan-principal-gradient)' },
                  { dataKey: 'Interest', name: 'Interest', color: 'url(#loan-interest-gradient)' }
                ]}
                height={350}
                labelFormatter={chartLabelFormatter}
                valueFormatter={chartValueFormatter}
              />
              {/* SVG gradients for bar chart */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="loan-principal-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                  <linearGradient id="loan-interest-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
            </CardContent>
          </Card>

          {/* Remaining Balance Chart */}
          <Card className="modern-card shadow-lg p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                Remaining Balance Over Time
              </CardTitle>
              <CardDescription className="text-base">
                Watch your loan balance decrease over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedLineChart
                data={chartData}
                lines={[
                  { dataKey: 'Remaining Balance', name: 'Remaining Balance', color: 'url(#loan-balance-gradient)', strokeWidth: 3 }
                ]}
                height={300}
                labelFormatter={chartLabelFormatter}
                valueFormatter={chartValueFormatter}
              />
              {/* SVG gradient for line chart */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="loan-balance-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#bbf7d0" />
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