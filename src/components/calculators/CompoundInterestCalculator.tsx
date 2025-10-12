import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedLineChart, EnhancedAreaChart, EnhancedPieChart } from '@/components/ui/enhanced-chart';
import { Calculator, TrendingUp, DollarSign, Calendar, Percent, PieChart, Target, Info } from 'lucide-react';
import { InContentAd } from '@/components/ads/AdSenseUnit';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CalculationResult {
  totalAmount: number;
  totalContributions: number;
  totalInterest: number;
  yearlyData: Array<{
    year: number;
    principal: number;
    interest: number;
    total: number;
  }>;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const compoundingFrequencies = [
  { value: 1, label: 'Annually' },
  { value: 2, label: 'Semi-annually' },
  { value: 4, label: 'Quarterly' },
  { value: 12, label: 'Monthly' },
  { value: 365, label: 'Daily' },
];

const contributionFrequencies = [
  { value: 1, label: 'Annually' },
  { value: 12, label: 'Monthly' },
  { value: 52, label: 'Weekly' },
];

export const CompoundInterestCalculator = () => {
  const [currency, setCurrency] = useState('USD');
  const [principal, setPrincipal] = useState('10000');
  const [contributionAmount, setContributionAmount] = useState('500');
  const [contributionFrequency, setContributionFrequency] = useState(12);
  const [annualRate, setAnnualRate] = useState('7');
  const [compoundingFrequency, setCompoundingFrequency] = useState(12);
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const selectedCurrency = currencies.find(c => c.code === currency);

  const calculateCompoundInterest = () => {
    const P = parseFloat(principal) || 0;
    const PMT = parseFloat(contributionAmount) || 0;
    const r = (parseFloat(annualRate) || 0) / 100;
    const n = compoundingFrequency;
    const t = parseFloat(years) || 0;
    const contributionsPerYear = contributionFrequency;

    if (P <= 0 || r < 0 || t <= 0) return;

    const yearlyData: CalculationResult['yearlyData'] = [];
    let currentPrincipal = P;
    let totalContributions = P;

    for (let year = 1; year <= t; year++) {
      // Add annual contributions
      const annualContribution = PMT * contributionsPerYear;
      
      // Calculate compound interest for the year
      const yearStartBalance = currentPrincipal;
      
      // For monthly contributions, we need to compound each month
      let yearEndBalance = yearStartBalance;
      for (let month = 1; month <= 12; month++) {
        // Add monthly contribution if applicable
        if (contributionsPerYear === 12 && month <= 12) {
          yearEndBalance += PMT;
        } else if (contributionsPerYear === 1 && month === 12) {
          yearEndBalance += PMT;
        } else if (contributionsPerYear === 52 && month <= 12) {
          yearEndBalance += PMT * (52/12);
        }
        
        // Apply monthly compounding
        yearEndBalance *= (1 + r/n);
      }

      // If annual contribution, add at year end
      if (contributionsPerYear === 1) {
        yearEndBalance += PMT;
      }

      totalContributions += annualContribution;
      currentPrincipal = yearEndBalance;
      
      const totalInterest = currentPrincipal - totalContributions;

      yearlyData.push({
        year,
        principal: totalContributions,
        interest: totalInterest,
        total: currentPrincipal,
      });
    }

    const finalResult: CalculationResult = {
      totalAmount: currentPrincipal,
      totalContributions,
      totalInterest: currentPrincipal - totalContributions,
      yearlyData,
    };

    setResult(finalResult);
  };

  useEffect(() => {
    calculateCompoundInterest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principal, contributionAmount, contributionFrequency, annualRate, compoundingFrequency, years]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartLabelFormatter = (label: number | string) => `Year ${label}`
  const chartValueFormatter = (value: number | string, name: string): [string, string] => {
    const formattedValue = formatCurrency(Number(value))
    return [formattedValue, name] as [string, string]
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Compound Interest Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See how your investments grow over time with our advanced calculator and interactive charts.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="lg:col-span-1">
          <Card className="financial-card bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Investment Calculator</CardTitle>
                  <CardDescription className="text-sm">
                    Configure your investment parameters
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Currency Selection */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="font-bold flex items-center gap-1">
                  Currency
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Select your preferred currency for calculations.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="border-slate-300 focus:border-primary bg-white rounded-md shadow-sm text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-md shadow-lg">
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Initial Principal */}
              <div className="space-y-2">
                <Label htmlFor="principal" className="font-bold flex items-center gap-1">
                  Initial Investment
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        The starting amount you invest initially.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {selectedCurrency?.symbol}
                  </span>
                  <Input
                    id="principal"
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className="pl-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="10000"
                  />
                </div>
              </div>

              {/* Regular Contribution */}
              <div className="space-y-2">
                <Label htmlFor="contribution" className="font-bold flex items-center gap-1">
                  Regular Contribution
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        The amount you add to your investment at each interval.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {selectedCurrency?.symbol}
                    </span>
                    <Input
                      id="contribution"
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="pl-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                      placeholder="500"
                    />
                  </div>
                  <Select 
                    value={contributionFrequency.toString()} 
                    onValueChange={(value) => setContributionFrequency(parseInt(value))}
                  >
                    <SelectTrigger className="border-slate-300 focus:border-primary bg-white rounded-md shadow-sm text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 rounded-md shadow-lg">
                      {contributionFrequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value.toString()}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Annual Interest Rate */}
              <div className="space-y-2">
                <Label htmlFor="rate" className="font-bold flex items-center gap-1">
                  Annual Interest Rate
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        The yearly rate of return expected on your investment (as a percentage).
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Input
                    id="rate"
                    type="number"
                    step="0.1"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                    className="pr-8 text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                    placeholder="7"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              {/* Compounding Frequency */}
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  Compounding Frequency
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        How often interest is added to your investment balance.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select 
                  value={compoundingFrequency.toString()} 
                  onValueChange={(value) => setCompoundingFrequency(parseInt(value))}
                >
                  <SelectTrigger className="border-slate-300 focus:border-primary bg-white rounded-md shadow-sm text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-md shadow-lg">
                    {compoundingFrequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value.toString()}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Investment Term */}
              <div className="space-y-2">
                <Label htmlFor="years" className="font-bold flex items-center gap-1">
                  Investment Term (Years)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="ml-1 cursor-pointer text-muted-foreground">
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        The total number of years you plan to invest.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="10"
                  className="text-base border-slate-300 focus:border-primary bg-white rounded-md shadow-sm"
                />
              </div>

              <Button 
                onClick={calculateCompoundInterest}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-md"
                size="lg"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Calculate Growth
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="financial-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Final Amount
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(result.totalAmount)}
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">Total value at end of term</span>
                    <span className="text-sm mt-1 opacity-0 select-none">placeholder</span>
                  </CardContent>
                </Card>
                <Card className="financial-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-4 w-4 text-green-600" />
                      Total Invested
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(result.totalContributions)}
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">Sum of all contributions</span>
                    <span className="text-sm mt-1 opacity-0 select-none">placeholder</span>
                  </CardContent>
                </Card>
                <Card className="financial-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Percent className="h-4 w-4 text-yellow-600" />
                      Interest Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(result.totalInterest)}
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">Total interest earned</span>
                    <span className="text-sm mt-1 opacity-0 select-none">placeholder</span>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <Tabs defaultValue="growth" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/30 p-1 rounded-2xl">
                  <TabsTrigger value="growth" className="rounded-xl">Growth Chart</TabsTrigger>
                  <TabsTrigger value="breakdown" className="rounded-xl">Breakdown</TabsTrigger>
                  <TabsTrigger value="comparison" className="rounded-xl">Comparison</TabsTrigger>
                </TabsList>
                
                <TabsContent value="growth">
                  <Card className="modern-card shadow-lg p-4">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Investment Growth Over Time
                      </CardTitle>
                      <CardDescription className="text-base">
                        Watch your wealth grow exponentially with compound interest
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnhancedLineChart
                        data={result.yearlyData}
                        height={350}
                        lines={[
                          {
                            dataKey: "total",
                            name: "Total Value",
                            color: "url(#ci-total-gradient)",
                            strokeWidth: 3
                          },
                          {
                            dataKey: "principal",
                            name: "Contributions",
                            color: "url(#ci-principal-gradient)",
                            strokeWidth: 2,
                            strokeDasharray: "5 5"
                          }
                        ]}
                        labelFormatter={chartLabelFormatter}
                        valueFormatter={chartValueFormatter}
                      />
                      {/* SVG gradients for line chart */}
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient id="ci-total-gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#60a5fa" />
                          </linearGradient>
                          <linearGradient id="ci-principal-gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#bbf7d0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="breakdown">
                  <Card className="modern-card shadow-lg p-4">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-emerald" />
                        Principal vs Interest Breakdown
                      </CardTitle>
                      <CardDescription className="text-base">
                        See how compound interest accelerates your wealth building
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnhancedPieChart
                        data={[
                          { name: 'Principal', value: result.totalContributions, gradient: ['#22c55e', '#bbf7d0'] },
                          { name: 'Interest', value: result.totalInterest, gradient: ['#f59e42', '#fbbf24'] }
                        ]}
                        height={320}
                        showLabels={true}
                        valueFormatter={v => formatCurrency(v)}
                        innerRadius={60}
                        outerRadius={100}
                        className="pie-gradient"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="comparison">
                  <div className="gradient-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange" />
                        Final Portfolio Composition
                      </CardTitle>
                      <CardDescription className="text-base">
                        Visualize your investment's final allocation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <EnhancedPieChart
                          data={[
                            {
                              name: "Total Contributions",
                              value: result.totalContributions,
                              color: "hsl(var(--emerald))"
                            },
                            {
                              name: "Interest Earned",
                              value: result.totalInterest,
                              color: "hsl(var(--violet))"
                            }
                          ]}
                          height={250}
                          valueFormatter={formatCurrency}
                          innerRadius={60}
                        />
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-emerald/10 rounded-2xl border border-emerald/20">
                            <p className="text-sm text-emerald font-medium mb-1">You Invested</p>
                            <p className="text-2xl font-bold text-emerald">{formatCurrency(result.totalContributions)}</p>
                          </div>
                          <div className="text-center p-4 bg-violet/10 rounded-2xl border border-violet/20">
                            <p className="text-sm text-violet font-medium mb-1">Interest Earned</p>
                            <p className="text-2xl font-bold text-violet">{formatCurrency(result.totalInterest)}</p>
                          </div>
                          <div className="text-center p-4 bg-primary/10 rounded-2xl border border-primary/20">
                            <p className="text-sm text-primary font-medium mb-1">Total Growth</p>
                            <p className="text-3xl font-bold text-primary">
                              {((result.totalInterest / result.totalContributions) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Ad Content */}
              <div className="mt-8">
                <InContentAd />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};