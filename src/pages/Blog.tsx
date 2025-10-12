import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const blogPosts = [
    {
      id: 'compound-interest-guide',
      title: 'The Complete Guide to Compound Interest: How to Turn $1,000 Into $7,400',
      description: 'Learn how compound interest works, avoid costly mistakes that drain wealth, and discover proven strategies to maximize your money\'s growth potential with real examples.',
      publishDate: '2025-01-15',
      readTime: '12 min read',
      category: 'Investment Strategy',
      featured: true,
      slug: '/blog/compound-interest-guide',
      keywords: ['compound interest', 'investment growth', 'wealth building', 'financial planning']
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <>
      <Helmet>
        <title>Financial Blog - Expert Insights & Strategies | Fin-Savvy Future Forge</title>
        <meta name="description" content="Expert financial insights, investment strategies, and practical money management tips. Learn from CFP professionals to build wealth and achieve financial freedom." />
        <meta name="keywords" content="financial blog, investment advice, money management, wealth building, financial planning, personal finance tips" />
        <link rel="canonical" href="https://fintoolslab.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Financial Blog - Expert Insights & Strategies" />
        <meta property="og:description" content="Expert financial insights, investment strategies, and practical money management tips from CFP professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/blog" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Financial Blog - Expert Insights & Strategies" />
        <meta name="twitter:description" content="Expert financial insights and investment strategies from CFP professionals." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Financial Blog
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Expert insights, proven strategies, and practical tips to help you build wealth and achieve financial freedom. 
            Written by certified financial professionals with 10+ years of experience.
          </p>
        </header>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">Featured</span>
              Latest Insights
            </h2>
            
            <Card className="overflow-hidden border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white flex items-center">
                  <div>
                    <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      {featuredPost.category}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 leading-tight">
                      {featuredPost.title}
                    </h3>
                    <div className="flex items-center gap-4 text-blue-100 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(featuredPost.publishDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-8">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  <Link to={featuredPost.slug}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">All Articles</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-blue-600 transition-colors">
                      <Link to={post.slug}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {post.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.keywords.slice(0, 3).map((keyword, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    
                    <Link to={post.slug}>
                      <Button variant="outline" size="sm" className="w-full">
                        Read Article
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Stay Updated with Financial Insights</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get the latest financial strategies, calculator updates, and expert tips delivered to your inbox. 
                Join thousands of readers building wealth with our proven advice.
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Subscribe to Newsletter
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
} 