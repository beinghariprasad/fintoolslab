import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, ArrowLeft } from 'lucide-react';
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
          <div
            className="mb-8 text-xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content.introduction }}
          />

          {/* Sections */}
          {post.content.sections.map((section, index) => (
            <section key={index} className="mb-8">
              {section.level === 'h3' ? (
                <h3 className="text-2xl font-semibold mb-4">{section.heading}</h3>
              ) : (
                <h2 className="text-3xl font-bold mb-6">{section.heading}</h2>
              )}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}

          {/* Practical Example */}
          {post.content.practicalExample && (
            <section className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Practical Example</h2>
              <Card className="bg-blue-50">
                <CardContent className="p-6">
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content.practicalExample }}
                  />
                </CardContent>
              </Card>
            </section>
          )}

          {/* Conclusion */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content.conclusion }}
            />
          </section>

          {/* FAQs */}
          {post.content.faqs && post.content.faqs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.content.faqs.map((faq, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <Alert className="mt-8">
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              <strong>Ready to calculate?</strong> Try our free financial calculators to plan your financial future.
              {post.internalLinks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.internalLinks.map((link, index) => (
                    <Link key={index} to={link}>
                      <Button variant="outline" size="sm">
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
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
