import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EnhancedAreaChart, EnhancedLineChart } from '@/components/ui/enhanced-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calculator, Target, DollarSign, Calendar, TrendingUp, BarChart3, Wallet, Info } from 'lucide-react';

interface SavingsData {
  savingsGoal: number;
  currentSavings: number;
  monthlySavings: number;
  interestRate: number;
  timeFrame: number;
  goalType: string;
}

export function SavingsCalculator() {
  const [data, setData] = useState<SavingsData>({
    savingsGoal: 50000,
    currentSavings: 5000,
    monthlySavings: 500,
    interestRate: 4.5,
    timeFrame: 8,
    goalType: 'emergency'
  });

  const results = useMemo(() => {
    const monthlyRate = data.interestRate / 100 / 12;
    const totalMonths = data.timeFrame * 12;
    
    // Future value with compound interest and regular contributions
    const futureValue = data.currentSavings * Math.pow(1 + monthlyRate, totalMonths) +
      data.monthlySavings * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalContributions = data.currentSavings + (data.monthlySavings * totalMonths);
    const totalInterest = futureValue - totalContributions;
    
    // Calculate what monthly savings is needed to reach goal
    const remainingGoal = Math.max(0, data.savingsGoal - data.currentSavings);
    const requiredMonthlyForGoal = remainingGoal / 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    // Timeline to reach goal with current savings rate
    const goalDiff = data.savingsGoal - data.currentSavings;
    let monthsToGoal = 0;
    
    if (data.monthlySavings > 0 && goalDiff > 0) {
      // Using formula to solve for time when compound interest is involved
      const pv = data.currentSavings;
      const pmt = data.monthlySavings;
      const fv = data.savingsGoal;
      
      if (monthlyRate > 0) {
        // Complex formula for time calculation with compound interest
        monthsToGoal = Math.log((fv * monthlyRate + pmt) / (pv * monthlyRate + pmt)) / 
                      Math.log(1 + monthlyRate);
      } else {
        // Simple calculation when no interest
        monthsToGoal = goalDiff / pmt;
      }
    }
    
    // Monthly projections
    const projections = [];
    let currentBalance = data.currentSavings;
    
    for (let month = 1; month <= Math.min(totalMonths, 120); month++) {
      currentBalance = currentBalance * (1 + monthlyRate) + data.monthlySavings;
      
      if (month % 6 === 0 || month <= 12) {
        projections.push({
          year: month,
          balance: currentBalance,
          contributions: data.currentSavings + (data.monthlySavings * month),
          interest: currentBalance - (data.currentSavings + (data.monthlySavings * month)),
          progressToGoal: Math.min(100, (currentBalance / data.savingsGoal) * 100)
        });
      }
    }

    return {
      futureValue,
      totalContributions,
      totalInterest,
      requiredMonthlyForGoal,
      monthsToGoal: Math.max(0, monthsToGoal),
      shortfall: Math.max(0, data.savingsGoal - futureValue),
      surplus: Math.max(0, futureValue - data.savingsGoal),
      projections
    };
  }, [data]);

  const chartData = results.projections.map(item => ({
    year: item.year,
    'Total Savings': item.balance,
    'Contributions': item.contributions,
    'Interest Earned': item.interest,
    'Goal Progress': item.progressToGoal
  }));

  const goalTypes = {
    emergency: { name: 'Emergency Fund', description: '3-6 months of expenses' },
    vacation: { name: 'Vacation', description: 'Travel and leisure' },
    car: { name: 'Car Purchase', description: 'Vehicle down payment' },
    home: { name: 'Home Down Payment', description: 'Real estate purchase' },
    education: { name: 'Education', description: 'Tuition and fees' },
    other: { name: 'Other Goal', description: 'Custom savings target' }
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
          Savings Goal Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Calculate how much to save monthly to reach your financial goals
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className="financial-card bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Savings Goal</CardTitle>
                  <CardDescription className="text-sm">
                    Set your savings target and timeline
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Goal Type
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Type of savings goal you're working towards
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={data.goalType} onValueChange={(value) => setData(prev => ({ ...prev, goalType: value }))}>
                  <SelectTrigger className="border-slate-300 focus:border-primary bg-white rounded-md shadow-sm text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-md shadow-lg">
                    {Object.entries(goalTypes).map(([key, goal]) => (
                      <SelectItem key={key} value={key}>
                        {goal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Savings Goal
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Total amount you want to save
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
                    value={data.savingsGoal}
                    onChange={(e) => setData(prev => ({ ...prev, savingsGoal: Number(e.target.value) }))}
                    className="pl-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="50000"
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
                        Amount you've already saved towards your goal
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
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Monthly Savings
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Amount you can save each month
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
                    value={data.monthlySavings}
                    onChange={(e) => setData(prev => ({ ...prev, monthlySavings: Number(e.target.value) }))}
                    className="pl-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="500"
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
                        Annual interest rate on your savings
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    value={data.interestRate}
                    onChange={(e) => setData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                    className="pr-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="4.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Time Frame (Years)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        How long you have to reach your savings goal
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  type="number"
                  value={data.timeFrame}
                  onChange={(e) => setData(prev => ({ ...prev, timeFrame: Number(e.target.value) }))}
                  placeholder="8"
                  className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                />
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-md"
                size="lg"
              >
                <Target className="h-5 w-5 mr-2" />
                Calculate Savings
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
                  Future Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(results.futureValue)}
                </div>
                <span className="text-sm text-muted-foreground mt-1">
                  In {data.timeFrame} years
                </span>
              </CardContent>
            </Card>

            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Goal Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.shortfall > 0 ? (
                  <>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(results.shortfall)}
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">
                      Shortfall from goal
                    </span>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.surplus)}
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">
                      Surplus over goal
                    </span>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Time to Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(results.monthsToGoal / 12)}y {results.monthsToGoal % 12}m
                </div>
                <span className="text-sm text-muted-foreground mt-1">
                  {results.monthsToGoal} months
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Savings Growth Chart */}
          <Card className="modern-card shadow-lg p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Savings Growth Over Time
              </CardTitle>
              <CardDescription className="text-base">
                Watch your savings grow with compound interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedAreaChart
                data={chartData}
                areas={[
                  { dataKey: 'Total Savings', name: 'Total Savings', color: 'url(#savings-total-gradient)' },
                  { dataKey: 'Contributions', name: 'Contributions', color: 'url(#savings-contributions-gradient)' }
                ]}
                height={350}
                labelFormatter={chartLabelFormatter}
                valueFormatter={chartValueFormatter}
              />
              {/* SVG gradients for area chart */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="savings-total-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                  <linearGradient id="savings-contributions-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
            </CardContent>
          </Card>

          {/* Goal Progress Chart */}
          <Card className="modern-card shadow-lg p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Progress Towards Goal
              </CardTitle>
              <CardDescription className="text-base">
                Track your progress towards your savings goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedLineChart
                data={chartData}
                lines={[
                  { dataKey: 'Goal Progress', name: 'Goal Progress (%)', color: 'url(#savings-progress-gradient)', strokeWidth: 3 }
                ]}
                height={300}
                labelFormatter={chartLabelFormatter}
                valueFormatter={(value, name) => [`${value.toFixed(1)}%`, name]}
              />
              {/* SVG gradient for line chart */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="savings-progress-gradient" x1="0" y1="0" x2="1" y2="1">
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