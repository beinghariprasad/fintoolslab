import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Calculator, Home, DollarSign, TrendingUp, PiggyBank, Target, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { HeaderAd, SidebarAd } from '@/components/ads/AdSenseUnit';

const calculators = [
  {
    id: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'Calculate how your investments grow with compound interest over time. See the power of compounding with interactive charts and detailed projections.',
    icon: TrendingUp,
    category: 'Investment',
    difficulty: 'Beginner',
    color: 'from-financial-blue to-financial-blue-light',
    features: ['Interactive charts', 'Multiple currencies', 'Flexible contributions', 'Export results'],
    popular: true,
    href: '/calculators/compound-interest'
  },
  {
    id: 'mortgage',
    title: 'Mortgage Calculator',
    description: 'Calculate monthly payments, total interest, and amortization schedules for home loans. Compare different loan terms and rates.',
    icon: Home,
    category: 'Real Estate',
    difficulty: 'Intermediate',
    color: 'from-financial-gold to-financial-gold-light',
    features: ['Amortization table', 'PMI calculations', 'Extra payments', 'Comparison tools'],
    popular: true,
    href: '/calculators/mortgage'
  },
  {
    id: 'loan',
    title: 'Loan Calculator',
    description: 'Calculate loan payments for personal loans, auto loans, and more. Understand your payment schedule and total interest costs.',
    icon: DollarSign,
    category: 'Loans',
    difficulty: 'Beginner',
    color: 'from-financial-success to-financial-success-light',
    features: ['Payment schedules', 'Interest breakdown', 'Early payoff calculator', 'Multiple loan types'],
    popular: false,
    href: '/calculators/loan'
  },
  {
    id: 'investment',
    title: 'Investment Calculator',
    description: 'Analyze investment returns with different scenarios and timeframes. Plan your investment strategy with comprehensive analysis.',
    icon: PiggyBank,
    category: 'Investment',
    difficulty: 'Advanced',
    color: 'from-purple-500 to-purple-600',
    features: ['Portfolio analysis', 'Risk assessment', 'Goal tracking', 'Performance metrics'],
    popular: false,
    href: '/calculators/investment'
  },
  {
    id: 'retirement',
    title: 'Retirement Calculator',
    description: 'Plan for retirement with comprehensive savings and withdrawal analysis. Ensure you have enough for your golden years.',
    icon: Target,
    category: 'Retirement',
    difficulty: 'Advanced',
    color: 'from-emerald-500 to-emerald-600',
    features: ['Retirement planning', '401k analysis', 'Withdrawal strategies', 'Social Security'],
    popular: true,
    href: '/calculators/retirement'
  },
  {
    id: 'savings',
    title: 'Savings Goal Calculator',
    description: 'Calculate how much to save monthly to reach your financial goals. Set targets and track your progress.',
    icon: Calculator,
    category: 'Savings',
    difficulty: 'Beginner',
    color: 'from-orange-500 to-orange-600',
    features: ['Goal tracking', 'Timeline planning', 'Savings strategies', 'Progress monitoring'],
    popular: false,
    href: '/calculators/savings'
  },
  {
    id: 'rent-vs-buy',
    title: 'Rent vs Buy Calculator',
    description: 'Compare the total costs of renting vs buying a home. Get break-even analysis, net worth projections, and comprehensive cost breakdowns.',
    icon: Home,
    category: 'Real Estate',
    difficulty: 'Intermediate',
    color: 'from-green-500 to-green-600',
    features: ['Break-even analysis', 'Net worth comparison', 'Cost breakdown', 'Tax benefits'],
    popular: true,
    href: '/calculators/rent-vs-buy'
  }
];

const categories = ['All', 'Investment', 'Real Estate', 'Loans', 'Retirement', 'Savings'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CalculatorList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const filteredCalculators = calculators.filter(calculator => {
    const matchesSearch = calculator.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calculator.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || calculator.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || calculator.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto container-padding section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Financial Calculators
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional financial tools to help you make informed decisions about your money.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4 sticky top-4">
            <Card className="financial-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search calculators..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-4">
              {filteredCalculators.map((calculator, index) => (
                <Card 
                  key={calculator.id} 
                  className="financial-card group hover:shadow-lg transition-all duration-200 relative"
                >
                  {calculator.popular && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs">
                      Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${calculator.color} flex items-center justify-center`}>
                        <calculator.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          {calculator.category}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-1 ${
                            calculator.difficulty === 'Beginner' ? 'border-green-500 text-green-600' :
                            calculator.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-600' :
                            'border-red-500 text-red-600'
                          }`}
                        >
                          {calculator.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {calculator.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {calculator.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-1 mb-4">
                      {calculator.features.slice(0, 4).map((feature) => (
                        <div key={feature} className="flex items-center text-xs text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      asChild 
                      className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                      size="sm"
                    >
                      <Link to={calculator.href}>
                        Open Calculator
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCalculators.length === 0 && (
              <div className="text-center py-8 col-span-2">
                <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No calculators found</h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}