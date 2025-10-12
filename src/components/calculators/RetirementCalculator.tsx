import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EnhancedLineChart, EnhancedPieChart } from '@/components/ui/enhanced-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calculator, Target, DollarSign, Calendar, TrendingUp, PieChart, Wallet, Info } from 'lucide-react';

interface RetirementData {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  employerMatch: number;
  salaryGrowth: number;
  returnRate: number;
  inflationRate: number;
  retirementDuration: number;
}

export function RetirementCalculator() {
  const [data, setData] = useState<RetirementData>({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 1000,
    employerMatch: 50,
    salaryGrowth: 3,
    returnRate: 7,
    inflationRate: 2.5,
    retirementDuration: 25
  });

  const results = useMemo(() => {
    const yearsToRetirement = data.retirementAge - data.currentAge;
    const totalMonthlyContribution = data.monthlyContribution + (data.monthlyContribution * data.employerMatch / 100);
    const monthlyReturn = data.returnRate / 100 / 12;
    const annualSalaryGrowth = data.salaryGrowth / 100;
    const monthlyInflation = data.inflationRate / 100 / 12;
    
    // Future value calculation with growing contributions
    let totalSavings = data.currentSavings;
    let currentContribution = totalMonthlyContribution;
    const projections = [];
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      const age = data.currentAge + year;
      
      // Compound existing savings
      totalSavings *= Math.pow(1 + data.returnRate / 100, 1);
      
      // Add contributions for the year with growth
      for (let month = 1; month <= 12; month++) {
        totalSavings = totalSavings * (1 + monthlyReturn) + currentContribution;
      }
      
      // Increase contribution based on salary growth
      if (year > 1) {
        currentContribution *= (1 + annualSalaryGrowth);
      }
      
      projections.push({
        year,
        age,
        totalSavings,
        yearlyContribution: currentContribution * 12,
        realValue: totalSavings / Math.pow(1 + data.inflationRate / 100, year)
      });
    }
    
    const finalAmount = totalSavings;
    const totalContributions = data.currentSavings + 
      projections.reduce((sum, p) => sum + p.yearlyContribution, 0);
    const totalGrowth = finalAmount - totalContributions;
    
    // Monthly retirement income calculation
    const monthlyWithdrawalRate = 0.04 / 12; // 4% rule
    const monthlyRetirementIncome = finalAmount * monthlyWithdrawalRate;
    const inflationAdjustedIncome = monthlyRetirementIncome / Math.pow(1 + data.inflationRate / 100, yearsToRetirement);
    
    return {
      finalAmount,
      totalContributions,
      totalGrowth,
      monthlyRetirementIncome,
      inflationAdjustedIncome,
      projections: projections.filter((_, index) => index % 5 === 4 || index === projections.length - 1)
    };
  }, [data]);

  const chartData = results.projections.map(item => ({
    year: item.year,
    'Total Savings': item.totalSavings,
    'Real Value': item.realValue,
    'Contributions': data.currentSavings + 
      results.projections.slice(0, results.projections.indexOf(item) + 1)
        .reduce((sum, p) => sum + p.yearlyContribution, 0)
  }));

  const allocationData = [
    { name: 'Contributions', value: results.totalContributions, color: 'hsl(var(--financial-blue))' },
    { name: 'Investment Growth', value: results.totalGrowth, color: 'hsl(var(--financial-success))' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartLabelFormatter = (label: number | string) => `Year ${label}`;
  const chartValueFormatter = (value: number | string, name: string): [string, string] => {
    const formattedValue = formatCurrency(Number(value));
    return [formattedValue, name] as [string, string];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Retirement Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Plan for retirement with comprehensive savings and withdrawal analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className="financial-card bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Retirement Planning</CardTitle>
                  <CardDescription className="text-sm">
                    Configure your retirement parameters
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-1">
                    Current Age
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                            <Info className="h-4 w-4" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs text-xs">
                          Your current age in years
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    type="number"
                    value={data.currentAge}
                    onChange={(e) => setData(prev => ({ ...prev, currentAge: Number(e.target.value) }))}
                    className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-1">
                    Retirement Age
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                            <Info className="h-4 w-4" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs text-xs">
                          Age when you plan to retire
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    type="number"
                    value={data.retirementAge}
                    onChange={(e) => setData(prev => ({ ...prev, retirementAge: Number(e.target.value) }))}
                    className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="65"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Current Savings
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Total amount currently saved for retirement
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
                    value={data.currentSavings}
                    onChange={(e) => setData(prev => ({ ...prev, currentSavings: Number(e.target.value) }))}
                    className="pl-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Monthly Contribution
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Amount you contribute monthly to retirement savings
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
                    value={data.monthlyContribution}
                    onChange={(e) => setData(prev => ({ ...prev, monthlyContribution: Number(e.target.value) }))}
                    className="pl-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Employer Match
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Percentage of your contribution that your employer matches
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    value={data.employerMatch}
                    onChange={(e) => setData(prev => ({ ...prev, employerMatch: Number(e.target.value) }))}
                    className="pr-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Expected Return
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Annual expected return on your investments
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    value={data.returnRate}
                    onChange={(e) => setData(prev => ({ ...prev, returnRate: Number(e.target.value) }))}
                    className="pr-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="7"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Salary Growth
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Expected annual growth in your salary
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    value={data.salaryGrowth}
                    onChange={(e) => setData(prev => ({ ...prev, salaryGrowth: Number(e.target.value) }))}
                    className="pr-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="3"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Inflation Rate
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Expected annual inflation rate
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    value={data.inflationRate}
                    onChange={(e) => setData(prev => ({ ...prev, inflationRate: Number(e.target.value) }))}
                    className="pr-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="2.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-md"
                size="lg"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Calculate Retirement
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
                  <Wallet className="h-4 w-4 text-primary" />
                  Total at Retirement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(results.finalAmount)}
                </div>
                <span className="text-sm text-muted-foreground mt-1">
                  In {data.retirementAge - data.currentAge} years
                </span>
              </CardContent>
            </Card>

            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(results.monthlyRetirementIncome)}
                </div>
                <span className="text-sm text-muted-foreground mt-1">
                  Today's value: {formatCurrency(results.inflationAdjustedIncome)}
                </span>
              </CardContent>
            </Card>

            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                  Investment Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(results.totalGrowth)}
                </div>
                <span className="text-sm text-muted-foreground mt-1">
                  Return on investment
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Savings Growth Chart */}
          <Card className="modern-card shadow-lg p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Retirement Savings Growth
              </CardTitle>
              <CardDescription className="text-base">
                Watch your retirement savings grow over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedLineChart
                data={chartData}
                lines={[
                  { dataKey: 'Total Savings', name: 'Total Savings', color: 'url(#retirement-total-gradient)', strokeWidth: 3 },
                  { dataKey: 'Real Value', name: 'Real Value (Inflation Adjusted)', color: 'url(#retirement-real-gradient)', strokeWidth: 2, strokeDasharray: '5 5' }
                ]}
                height={350}
                labelFormatter={chartLabelFormatter}
                valueFormatter={chartValueFormatter}
              />
              {/* SVG gradients for line chart */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="retirement-total-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                  <linearGradient id="retirement-real-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
            </CardContent>
          </Card>

          {/* Contribution vs Growth */}
          <Card className="modern-card shadow-lg p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <PieChart className="h-5 w-5 text-emerald" />
                Contributions vs Investment Growth
              </CardTitle>
              <CardDescription className="text-base">
                See how compound interest accelerates your retirement savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedPieChart
                data={allocationData}
                height={320}
                showLabels={true}
                valueFormatter={formatCurrency}
                innerRadius={60}
                outerRadius={100}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}