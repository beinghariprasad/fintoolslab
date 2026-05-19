import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calculator, TrendingUp, PieChart, Target, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-financial.jpg';

const features = [
  {
    icon: Calculator,
    title: 'Advanced Calculators',
    description: 'Professional-grade financial calculators with real-time results'
  },
  {
    icon: TrendingUp,
    title: 'Interactive Charts',
    description: 'Beautiful visualizations to understand your financial growth'
  },
  {
    icon: PieChart,
    title: 'Detailed Analysis',
    description: 'Comprehensive breakdowns and projections for informed decisions'
  },
  {
    icon: Target,
    title: 'Goal Planning',
    description: 'Set and track your financial goals with precision'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data stays private - calculations done client-side'
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Real-time calculations as you adjust your parameters'
  }
];

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-mesh" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-emerald/10 border border-primary/20 mb-6">
                <span className="text-sm font-medium text-primary">✨ Modern Financial Tools</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-violet to-emerald bg-clip-text text-transparent">
                  Calculate
                </span>
                <br />
                <span className="text-foreground">
                  Your Future
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Professional financial calculators with interactive charts and real-time insights. 
                Plan your investments, loans, and retirement with confidence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="gradient-blue text-white hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group h-14 px-8 text-lg"
              >
                <Link to="/calculators">
                  Start Calculating
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 h-14 px-8 text-lg"
              >
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald/10 border border-emerald/20">
                <Shield className="h-4 w-4 text-emerald" />
                <span className="font-medium text-emerald-600">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-amber/10 border border-amber/20">
                <Zap className="h-4 w-4 text-amber" />
                <span className="font-medium text-amber-600">Instant Results</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-violet/10 border border-violet/20">
                <Target className="h-4 w-4 text-violet" />
                <span className="font-medium text-violet-600">Precise Analytics</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative glass-card p-8 float-animation">
              <img
                src={heroImage}
                alt="Financial calculators showing compound interest growth charts and investment projections"
                className="w-full h-auto rounded-xl"
                width={600}
                height={400}
                fetchPriority="high"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 modern-card p-4 pulse-glow">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              
              <div className="absolute -bottom-6 -right-6 modern-card p-4 pulse-glow" style={{ animationDelay: '1s' }}>
                <TrendingUp className="h-8 w-8 text-emerald" />
              </div>
              
              <div className="absolute top-4 -right-4 modern-card p-3" style={{ animationDelay: '2s' }}>
                <PieChart className="h-6 w-6 text-violet" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 lg:mt-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-emerald bg-clip-text text-transparent">
                Why Choose
              </span>{" "}
              <span className="text-foreground">Our Platform?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the next generation of financial planning with beautiful, interactive tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const gradients = [
                'gradient-blue', 'gradient-emerald', 'gradient-sunset', 
                'gradient-ocean', 'gradient-blue', 'gradient-emerald'
              ];
              const colors = ['primary', 'emerald', 'orange', 'cyan', 'violet', 'rose'];
              
              return (
                <div 
                  key={feature.title} 
                  className="group hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="gradient-card p-8 text-center space-y-6 h-full">
                    <div className={`w-20 h-20 ${gradients[index % gradients.length]} rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};