/**
 * Updates blog-posts.json index with metadata from all blog post files
 * Run this after generating new blog posts
 */

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../src/data/blog/posts');
const indexPath = path.join(__dirname, '../src/data/blog/blog-posts.json');

// Read all JSON files from posts directory
const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));

const blogPosts = files.map(file => {
  const filePath = path.join(postsDir, file);
  const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Extract metadata only (not full content)
  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    description: post.metaDescription,
    publishDate: post.publishDate,
    readTime: post.readTime,
    category: post.category,
    featured: post.featured || false,
    keywords: [post.primaryKeyword, ...post.secondaryKeywords.slice(0, 3)],
    template: post.template
  };
});

// Sort by publish date (newest first)
blogPosts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

// Write to index file
fs.writeFileSync(indexPath, JSON.stringify(blogPosts, null, 2));

console.log(`✅ Updated blog index with ${blogPosts.length} posts`);
console.log(`📁 Index file: ${indexPath}`);
