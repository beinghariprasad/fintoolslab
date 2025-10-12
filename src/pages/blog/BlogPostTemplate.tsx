import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, ArrowLeft, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { BlogPost } from '@/types/blog';

export default function BlogPostTemplate() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        // Dynamic import of blog post JSON
        const postData = await import(`@/data/blog/posts/${slug}.json`);
        setPost(postData.default);
        setLoading(false);
      } catch (err) {
        console.error(`Failed to load blog post: ${slug}`, err);
        setError(true);
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-8 w-2/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/404" replace />;
  }

  // Generate structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "author": {
      "@type": "Person",
      "name": post.author || "FinSavvy Future Forge Financial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FinSavvy Future Forge",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fintoolslab.com/favicon.ico"
      }
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://fintoolslab.com/blog/${post.slug}`
    },
    "keywords": [post.primaryKeyword, ...post.secondaryKeywords].join(', ')
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fintoolslab.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://fintoolslab.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://fintoolslab.com/blog/${post.slug}`
      }
    ]
  };

  const faqSchema = post.content.faqs && post.content.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      <Helmet>
        <title>{post.title} | Fintoolslab</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={[post.primaryKeyword, ...post.secondaryKeywords].join(', ')} />
        <link rel="canonical" href={`https://fintoolslab.com/blog/${post.slug}`} />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://fintoolslab.com/blog/${post.slug}`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back to Blog Button */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground">{post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            Published on {new Date(post.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </header>

        {/* Main Content */}
        <article className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="mb-8 text-xl leading-relaxed blog-content">
            <div dangerouslySetInnerHTML={{ __html: post.content.introduction }} />
          </div>

          {/* Sections */}
          {post.content.sections.map((section, index) => (
            <section key={index} className="mb-12">
              {section.level === 'h3' ? (
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  {section.heading}
                </h3>
              ) : (
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  {section.heading}
                </h2>
              )}
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: section.content }} />
            </section>
          ))}

          {/* Practical Example */}
          {post.content.practicalExample && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Calculator className="h-8 w-8 text-green-600" />
                Practical Example
              </h2>
              <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content.practicalExample }} />
                </CardContent>
              </Card>
            </section>
          )}

          {/* Conclusion */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
            <div className="blog-content text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content.conclusion }} />
          </section>

          {/* FAQs */}
          {post.content.faqs && post.content.faqs.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Info className="h-8 w-8 text-purple-600" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {post.content.faqs.map((faq, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-blue-600">{faq.question}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <Alert className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-300">
            <Calculator className="h-5 w-5 text-green-600" />
            <AlertDescription>
              <strong className="text-lg">Ready to calculate?</strong>
              <p className="mt-2 mb-3">Try our free financial calculators to plan your financial future with precision and confidence.</p>
              {post.internalLinks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.internalLinks.map((link, index) => (
                    <Link key={index} to={link}>
                      <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                        {link.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Calculator
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </AlertDescription>
          </Alert>
        </article>

        {/* Related Posts Navigation */}
        <div className="mt-12 pt-8 border-t">
          <Link to="/blog">
            <Button variant="outline" className="hover:bg-gray-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View All Articles
            </Button>
          </Link>
        </div>
      </div>

      {/* Global Styles for Blog Content */}
      <style>{`
        .blog-content {
          color: #374151;
          line-height: 1.8;
        }

        .blog-content p {
          margin-bottom: 1.5rem;
          font-size: 1.0625rem;
        }

        .blog-content ul, .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .blog-content ul {
          list-style-type: disc;
        }

        .blog-content ol {
          list-style-type: decimal;
        }

        .blog-content li {
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }

        .blog-content strong {
          font-weight: 600;
          color: #1f2937;
        }

        .blog-content a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
          transition: color 0.2s;
        }

        .blog-content a:hover {
          color: #1d4ed8;
        }

        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .blog-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #374151;
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .blog-content th,
        .blog-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          text-align: left;
        }

        .blog-content th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #1f2937;
        }

        .blog-content tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4b5563;
        }

        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: 'Courier New', monospace;
        }

        .blog-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .blog-content pre code {
          background-color: transparent;
          padding: 0;
          color: #f9fafb;
        }

        /* Special styling for highlighted content divs */
        .blog-content div[style*="background"] {
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        .blog-content div[style*="border-left"] {
          padding-left: 1.5rem;
          margin: 1.5rem 0;
        }
      `}</style>
    </>
  );
}
