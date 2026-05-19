import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CalcFAQ } from '@/components/calculators/CalcFAQ';
import { useState, useEffect, useRef, useMemo } from 'react';
import type { BlogPost } from '@/types/blog';

/* ---------- Reading progress bar ---------- */
function ReadProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setPct(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="read-progress" style={{ width: pct + '%' }} />;
}

/* ---------- TOC with active tracking ---------- */
function TableOfContents({ sections }: { sections: { heading: string; id: string }[] }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="toc">
      <h4>On this page</h4>
      <ol>
        {sections.map((s, i) => (
          <li key={s.id} className={active === s.id ? 'active' : ''}>
            <a href={`#${s.id}`}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              {s.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Newsletter rail widget ---------- */
function RailNewsletter() {
  return (
    <div className="rail-newsletter">
      <h4>Get one useful idea about money, every Sunday.</h4>
      <p>No hot takes. Just frameworks and tools that actually help.</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="you@inbox.com" />
        <button type="submit">Subscribe</button>
      </form>
      <div className="note">Join our readers · One-click unsubscribe.</div>
    </div>
  );
}

/* ---------- Author bio ---------- */
function AuthorBio({ name, initials }: { name: string; initials: string }) {
  return (
    <div className="author-bio">
      <div className="author-avatar">{initials}</div>
      <div>
        <h5>{name}</h5>
        <div className="role">Staff writer · Fin Tools Lab</div>
        <p>
          Contributing writer at Fin Tools Lab, focused on making financial math
          accessible through clear explanations and practical tools.
        </p>
      </div>
    </div>
  );
}

export default function BlogPostTemplate() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await import(`@/data/blog/posts/${slug}.json`);
        setPost(postData.default);
        setLoading(false);
      } catch (err) {
        console.error(`Failed to load blog post: ${slug}`, err);
        setError(true);
        setLoading(false);
      }
    };
    if (slug) loadPost();
  }, [slug]);

  // Build TOC from sections
  const tocSections = useMemo(() => {
    if (!post) return [];
    const items: { heading: string; id: string }[] = [];
    post.content.sections.forEach((section, i) => {
      if (section.level !== 'h3') {
        const id = `section-${i}`;
        items.push({ heading: section.heading, id });
      }
    });
    if (post.content.practicalExample) items.push({ heading: 'Practical Example', id: 'practical-example' });
    items.push({ heading: 'Conclusion', id: 'conclusion' });
    if (post.content.faqs?.length) items.push({ heading: 'FAQ', id: 'faq' });
    return items;
  }, [post]);

  if (loading) {
    return (
      <div className="container" style={{ paddingBlock: 'clamp(40px, 6vw, 80px)' }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ height: 48, background: 'var(--bg-sunken)', borderRadius: 'var(--r-sm)', marginBottom: 16 }} />
          <div style={{ height: 24, background: 'var(--bg-sunken)', borderRadius: 'var(--r-sm)', marginBottom: 32, width: '60%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[100, 85, 70].map((w, i) => (
              <div key={i} style={{ height: 16, background: 'var(--bg-sunken)', borderRadius: 'var(--r-sm)', width: w + '%' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) return <Navigate to="/404" replace />;

  const authorName = post.author || 'Fin Tools Lab';
  const authorInitials = authorName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://fintoolslab.com/blog/${post.slug}#article`,
    "headline": post.title,
    "description": post.metaDescription,
    "image": { "@type": "ImageObject", "url": "https://fintoolslab.com/og-image.png", "width": 1200, "height": 630 },
    "author": authorName === "Fin Tools Lab"
      ? { "@type": "Organization", "@id": "https://fintoolslab.com/#organization", "name": authorName }
      : { "@type": "Person", "name": authorName },
    "publisher": { "@type": "Organization", "@id": "https://fintoolslab.com/#organization", "name": "Fin Tools Lab", "logo": { "@type": "ImageObject", "url": "https://fintoolslab.com/icon-192.png", "width": 192, "height": 192 } },
    "datePublished": post.publishDate,
    "dateModified": (post as any).lastModified || post.publishDate,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://fintoolslab.com/blog/${post.slug}` },
    "keywords": [post.primaryKeyword, ...post.secondaryKeywords].join(', '),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fintoolslab.com" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://fintoolslab.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://fintoolslab.com/blog/${post.slug}` },
    ],
  };

  const faqSchema = post.content.faqs?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.content.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  } : null;

  const faqItems = post.content.faqs?.map((faq) => ({ q: faq.question, a: faq.answer })) || [];

  return (
    <>
      <Helmet>
        <title>{post.title} | Fin Tools Lab</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={[post.primaryKeyword, ...post.secondaryKeywords].join(', ')} />
        <link rel="canonical" href={`https://fintoolslab.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://fintoolslab.com/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta property="og:image" content="https://fintoolslab.com/og-image.png" />
        <meta name="twitter:image" content="https://fintoolslab.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <ReadProgress />

      {/* Breadcrumb */}
      <div className="container">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep"> · </span>
          <Link to="/blog">Field notes</Link>
          <span className="sep"> · </span>
          <span className="here">{post.category}</span>
        </nav>
      </div>

      {/* Post hero */}
      <section className="post-hero">
        <div className="container">
          <div className="post-meta">
            <span className="cat">{post.category}</span>
            <span className="dot">·</span>
            <span>{post.readTime}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="subtitle">{post.metaDescription}</p>

          <div className="post-author-row">
            <div className="author-avatar">{authorInitials}</div>
            <div className="author-meta">
              <b>{authorName}</b>
              <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="post-share">
              <button type="button" aria-label="Share on Twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://fintoolslab.com/blog/${post.slug}`)}`, '_blank')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4l6.5 8L4 20h2l5.5-7 4.5 7h5l-7-9 6-7h-2l-5 6L8 4H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </button>
              <button type="button" aria-label="Copy link" onClick={() => navigator.clipboard?.writeText(`https://fintoolslab.com/blog/${post.slug}`)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 14a3.5 3.5 0 005 0l4-4a3.536 3.536 0 00-5-5l-.5.5M14 10a3.5 3.5 0 00-5 0l-4 4a3.536 3.536 0 005 5l.5-.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-column layout */}
      <section className="container" style={{ paddingBlock: 'clamp(40px, 5vw, 64px)' }}>
        <div className="post-layout">
          {/* TOC */}
          <div className="post-toc-col">
            <TableOfContents sections={tocSections} />
          </div>

          {/* Article content */}
          <div ref={contentRef}>
            {/* Key takeaway */}
            <div className="key-takeaway">
              <h4>Key takeaway</h4>
              <p dangerouslySetInnerHTML={{ __html: post.content.introduction.replace(/<[^>]+>/g, '').slice(0, 300) + '...' }} />
            </div>

            <div className="post-content">
              <div dangerouslySetInnerHTML={{ __html: post.content.introduction }} />

              {post.content.sections.map((section, index) => {
                const id = section.level !== 'h3' ? `section-${index}` : undefined;
                return (
                  <section key={index}>
                    {section.level === 'h3' ? (
                      <h3>{section.heading}</h3>
                    ) : (
                      <h2 id={id}>{section.heading}</h2>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </section>
                );
              })}

              {post.content.practicalExample && (
                <section>
                  <h2 id="practical-example">Practical Example</h2>
                  <div className="callout">
                    <div className="callout-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v10l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
                    </div>
                    <div className="callout-body" dangerouslySetInnerHTML={{ __html: post.content.practicalExample }} />
                  </div>
                </section>
              )}

              <section>
                <h2 id="conclusion">Conclusion</h2>
                <div dangerouslySetInnerHTML={{ __html: post.content.conclusion }} />
              </section>
            </div>

            {/* Inline calculator CTA */}
            {post.internalLinks?.length > 0 && (
              <div className="inline-calc">
                <div className="label">Try it yourself</div>
                <h4>Run the numbers with our free calculators</h4>
                <p>See how the concepts in this article apply to your specific financial situation.</p>
                <div className="row">
                  {post.internalLinks.map((link, i) => (
                    <Link key={i} to={link} className="btn btn-accent btn-sm">
                      {link.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author bio */}
            <AuthorBio name={authorName} initials={authorInitials} />

            {/* FAQ */}
            {faqItems.length > 0 && (
              <div id="faq">
                <CalcFAQ items={faqItems} />
              </div>
            )}
          </div>

          {/* Rail */}
          <div className="post-rail-col">
            <div className="post-rail">
              <RailNewsletter />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter band */}
      <section style={{ paddingBlock: 'clamp(48px, 6vw, 96px)' }}>
        <div className="container">
          <div className="newsletter-band">
            <div>
              <div className="eyebrow" style={{ color: 'var(--ink-on-dark-2)', marginBottom: 14 }}>The Compound newsletter</div>
              <h2>One useful idea<br />about money, <em>every Sunday</em>.</h2>
              <p style={{ marginTop: 16 }}>
                No hot takes, no "10 things millionaires do." Just one solid framework or tool we found
                useful this week — like the article you just read.
              </p>
            </div>
            <div>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="you@inbox.com" />
                <button type="submit">Subscribe</button>
              </form>
              <div style={{ fontSize: 12, color: 'var(--ink-on-dark-3)', marginTop: 12 }}>
                Join our readers · One-click unsubscribe.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <section style={{ paddingBottom: 40 }}>
        <div className="container">
          <Link to="/blog" className="btn btn-ghost">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: 'rotate(180deg)' }}>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View all articles
          </Link>
        </div>
      </section>
    </>
  );
}
