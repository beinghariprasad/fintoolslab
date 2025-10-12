import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Calculator, TrendingUp, Target, Users, Award, Globe, Heart } from 'lucide-react';

const teamMembers = [
  {
    name: 'Hari Prasad',
    role: 'Founder & Lead Developer',
    bio: 'Financial technology enthusiast with over 8 years of experience in building user-friendly financial tools. Passionate about making complex financial concepts accessible to everyone.',
    expertise: ['React', 'TypeScript', 'Financial Modeling', 'UX Design']
  },
  {
    name: 'Sarah Chen',
    role: 'Financial Analyst',
    bio: 'Certified financial planner with expertise in retirement planning and investment strategies. Ensures all our calculators provide accurate and reliable financial projections.',
    expertise: ['Financial Planning', 'Investment Analysis', 'Risk Management', 'Tax Planning']
  },
  {
    name: 'Michael Rodriguez',
    role: 'UX/UI Designer',
    bio: 'Design specialist focused on creating intuitive and accessible financial tools. Believes that great design can make complex financial decisions easier to understand.',
    expertise: ['User Experience', 'Interface Design', 'Accessibility', 'Visual Design']
  }
];

const values = [
  {
    icon: Calculator,
    title: 'Accuracy',
    description: 'Every calculation is thoroughly tested and verified to ensure precise results you can trust for your financial decisions.'
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'We continuously improve our tools with the latest financial models and user experience best practices.'
  },
  {
    icon: Target,
    title: 'Accessibility',
    description: 'Making professional financial tools available to everyone, regardless of their financial knowledge or background.'
  },
  {
    icon: Heart,
    title: 'User-First',
    description: 'Every feature is designed with our users in mind, prioritizing clarity, ease of use, and educational value.'
  }
];

const stats = [
  { number: '50,000+', label: 'Active Users' },
  { number: '6', label: 'Professional Calculators' },
  { number: '99.9%', label: 'Uptime' },
  { number: '4.9/5', label: 'User Rating' }
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us - Fin Tools Lab | Professional Financial Calculators</title>
        <meta 
          name="description" 
          content="Learn about Fin Tools Lab's mission to provide free, professional financial calculators. Meet our team of financial experts and technology professionals." 
        />
        <meta name="keywords" content="about Fin Tools Lab, financial calculator team, financial planning tools, investment calculators" />
        <link rel="canonical" href="https://fintoolslab.com/about" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/about" />
        <meta property="og:title" content="About Us - Fin Tools Lab" />
        <meta property="og:description" content="Learn about Fin Tools Lab's mission to provide free, professional financial calculators." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/about" />
        <meta property="twitter:title" content="About Us - Fin Tools Lab" />
        <meta property="twitter:description" content="Learn about Fin Tools Lab's mission to provide free, professional financial calculators." />
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
                <BreadcrumbPage>About Us</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Fin Tools Lab
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We're on a mission to democratize financial planning by providing free, 
                professional-grade calculators that help everyone make informed financial decisions.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <Card key={index} className="financial-card text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mission Section */}
            <Card className="financial-card mb-16">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl mb-4">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Financial planning shouldn't be complicated or expensive. At Fin Tools Lab, we believe that 
                  everyone deserves access to professional financial tools that can help them build wealth, 
                  plan for retirement, and achieve their financial goals.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our team combines deep financial expertise with cutting-edge technology to create 
                  calculators that are not only accurate and reliable but also intuitive and educational. 
                  We're committed to continuous improvement and user feedback to ensure our tools remain 
                  the best in the industry.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="financial-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <value.icon className="h-5 w-5 text-primary" />
                        </div>
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Team Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="financial-card text-center">
                    <CardHeader>
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-financial-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <p className="text-financial-gold font-medium">{member.role}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {member.bio}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.expertise.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Story Section */}
            <Card className="financial-card mb-16">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl mb-4">Our Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Fin Tools Lab was born from a simple observation: while there were many financial 
                  calculators available online, most were either too basic to be useful or too complex 
                  to understand. We saw an opportunity to bridge this gap by creating tools that combine 
                  professional accuracy with user-friendly design.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  What started as a personal project has grown into a platform trusted by thousands of 
                  users worldwide. Our calculators are used by individuals, financial advisors, and 
                  educational institutions to help people make better financial decisions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We're proud to offer our tools completely free, supported by our commitment to 
                  financial education and empowerment. Our goal is to help you take control of your 
                  financial future, one calculation at a time.
                </p>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="financial-card text-center">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl mb-4">Ready to Start Planning?</CardTitle>
                <p className="text-muted-foreground">
                  Explore our professional financial calculators and take the first step toward your financial goals.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/calculators"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    View All Calculators
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Get in Touch
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 