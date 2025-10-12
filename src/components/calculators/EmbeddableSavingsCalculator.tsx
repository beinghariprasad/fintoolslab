import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EnhancedAreaChart, EnhancedLineChart } from '@/components/ui/enhanced-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Target, DollarSign, Calendar, TrendingUp, BarChart3, Wallet, Info, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface SavingsData {
  savingsGoal: number;
  currentSavings: number;
  monthlySavings: number;
  interestRate: number;
  timeFrame: number;
  goalType: string;
}

interface EmbeddableSavingsCalculatorProps {
  theme?: 'light' | 'dark';
  height?: string;
  width?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function EmbeddableSavingsCalculator({ 
  theme = 'light', 
  height = '600px', 
  width = '100%',
  showHeader = true,
  showFooter = true 
}: EmbeddableSavingsCalculatorProps) {
  const [data, setData] = useState<SavingsData>({
    savingsGoal: 50000,
    currentSavings: 5000,
    monthlySavings: 500,
    interestRate: 4.5,
    timeFrame: 8,
    goalType: 'emergency'
  });

  const [copied, setCopied] = useState(false);

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
      const pv = data.currentSavings;
      const pmt = data.monthlySavings;
      const fv = data.savingsGoal;
      
      if (monthlyRate > 0) {
        monthsToGoal = Math.log((fv * monthlyRate + pmt) / (pv * monthlyRate + pmt)) / 
                      Math.log(1 + monthlyRate);
      } else {
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

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="https://compound-clarity-fq1ms.web.app/embed/savings" width="100%" height="600" frameborder="0" style="border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></iframe>`;
    
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      toast.success('Embed code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white border-gray-700' 
    : 'bg-slate-50 border-slate-200';

  return (
    <div 
      className={`max-w-6xl mx-auto space-y-6 ${theme === 'dark' ? 'text-white' : ''}`}
      style={{ height, width }}
    >
      {/* Header */}
      {showHeader && (
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold">
            Savings Goal Calculator
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Calculate how much to save monthly to reach your financial goals
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className={`financial-card ${themeClasses} rounded-xl shadow-sm`}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Savings Goal</CardTitle>
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
                  <SelectTrigger className={`border-slate-300 focus:border-primary ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-md shadow-sm text-sm`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} border-slate-200 rounded-md shadow-lg`}>
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
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={data.savingsGoal}
                    onChange={(e) => setData(prev => ({ ...prev, savingsGoal: Number(e.target.value) }))}
                    className={`pl-10 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white'} border-slate-300 focus:border-primary rounded-md shadow-sm text-sm`}
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
                        Amount you already have saved
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={data.currentSavings}
                    onChange={(e) => setData(prev => ({ ...prev, currentSavings: Number(e.target.value) }))}
                    className={`pl-10 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white'} border-slate-300 focus:border-primary rounded-md shadow-sm text-sm`}
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
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={data.monthlySavings}
                    onChange={(e) => setData(prev => ({ ...prev, monthlySavings: Number(e.target.value) }))}
                    className={`pl-10 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white'} border-slate-300 focus:border-primary rounded-md shadow-sm text-sm`}
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Annual Interest Rate
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Expected annual return on your savings
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.1"
                    value={data.interestRate}
                    onChange={(e) => setData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                    className={`pl-10 pr-8 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white'} border-slate-300 focus:border-primary rounded-md shadow-sm text-sm`}
                    placeholder="4.5"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">%</span>
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
                        How long you plan to save
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={data.timeFrame}
                    onChange={(e) => setData(prev => ({ ...prev, timeFrame: Number(e.target.value) }))}
                    className={`pl-10 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white'} border-slate-300 focus:border-primary rounded-md shadow-sm text-sm`}
                    placeholder="8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={`${themeClasses} border-l-4 border-l-green-500`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Future Value</span>
                </div>
                <p className="text-xl font-bold">{formatCurrency(results.futureValue)}</p>
              </CardContent>
            </Card>

            <Card className={`${themeClasses} border-l-4 border-l-blue-500`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Contributions</span>
                </div>
                <p className="text-xl font-bold">{formatCurrency(results.totalContributions)}</p>
              </CardContent>
            </Card>

            <Card className={`${themeClasses} border-l-4 border-l-purple-500`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Interest Earned</span>
                </div>
                <p className="text-xl font-bold">{formatCurrency(results.totalInterest)}</p>
              </CardContent>
            </Card>

            <Card className={`${themeClasses} border-l-4 ${results.shortfall > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className={`h-4 w-4 ${results.shortfall > 0 ? 'text-red-600' : 'text-green-600'}`} />
                  <span className="text-sm font-medium">
                    {results.shortfall > 0 ? 'Shortfall' : 'Surplus'}
                  </span>
                </div>
                <p className={`text-xl font-bold ${results.shortfall > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(results.shortfall > 0 ? results.shortfall : results.surplus)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card className={themeClasses}>
            <CardHeader>
              <CardTitle className="text-lg">Savings Growth Over Time</CardTitle>
              <CardDescription>Projected savings balance and contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <EnhancedAreaChart
                  data={chartData}
                  xKey="year"
                  yKeys={['Total Savings', 'Contributions']}
                  colors={['#10b981', '#3b82f6']}
                  showTooltip={true}
                  showLegend={true}
                  showGrid={true}
                  labelFormatter={chartLabelFormatter}
                  valueFormatter={chartValueFormatter}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="text-center pt-6 border-t border-slate-200">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">
              Powered by Fin-Savvy Future Forge
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={copyEmbedCode}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Embed Code
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 