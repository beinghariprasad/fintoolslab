/**
 * Automatic Sitemap Generator
 *
 * Generates sitemap.xml with all static pages and dynamic blog posts
 * Run after updating blog posts or when deploying
 *
 * Usage: node scripts/generateSitemap.cjs
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://fintoolslab.com';
const TODAY = new Date().toISOString().split('T')[0];

// Static routes configuration
const staticRoutes = [
  {
    path: '/',
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    path: '/calculators',
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    path: '/calculators/compound-interest',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/calculators/mortgage',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/calculators/loan',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/calculators/retirement',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/calculators/investment',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/calculators/savings',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/calculators/rent-vs-buy',
    lastmod: '2025-01-18',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/blog',
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    path: '/embed/savings',
    lastmod: '2025-01-15',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    path: '/privacy-policy',
    lastmod: '2024-01-15',
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    path: '/terms-of-service',
    lastmod: '2024-01-15',
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    path: '/about',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    path: '/contact',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.5
  }
];

// Load blog posts from index
const blogPostsPath = path.join(__dirname, '../src/data/blog/blog-posts.json');
let blogPosts = [];

try {
  if (fs.existsSync(blogPostsPath)) {
    blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'));
  }
} catch (error) {
  console.error('Error loading blog posts:', error);
}

// Generate blog post routes
const blogRoutes = blogPosts.map(post => ({
  path: `/blog/${post.slug}`,
  lastmod: post.publishDate || TODAY,
  changefreq: 'monthly',
  priority: post.featured ? 0.9 : 0.7
}));

// Combine all routes
const allRoutes = [...staticRoutes, ...blogRoutes];

// Generate XML
const generateSitemapXML = (routes) => {
  const urls = routes.map(route => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

// Write sitemap
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
const sitemapContent = generateSitemapXML(allRoutes);

fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');

console.log('✅ Sitemap generated successfully!');
console.log(`📄 Total URLs: ${allRoutes.length}`);
console.log(`   - Static pages: ${staticRoutes.length}`);
console.log(`   - Blog posts: ${blogRoutes.length}`);
console.log(`📁 Location: ${sitemapPath}`);
console.log(`🌐 Domain: ${DOMAIN}`);
console.log(`📅 Generated: ${TODAY}`);

// Output blog post URLs for verification
if (blogRoutes.length > 0) {
  console.log('\n📝 Blog post URLs added:');
  blogRoutes.forEach(route => {
    console.log(`   ${DOMAIN}${route.path}`);
  });
}
