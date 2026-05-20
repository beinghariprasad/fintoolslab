/**
 * Rebuild blog-posts.json index from all JSON files in src/data/blog/posts/.
 * Usage: npx tsx scripts/seo/generate-index.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_DIR = path.resolve(__dirname, '../../src/data/blog/posts');
const INDEX_FILE = path.resolve(__dirname, '../../src/data/blog/blog-posts.json');

interface BlogMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  category: string;
  featured: boolean;
  keywords: string[];
  template: string;
}

function main() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} blog post files.`);

  const entries: BlogMetadata[] = [];

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    entries.push({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      description: post.metaDescription,
      publishDate: post.publishDate,
      readTime: post.readTime,
      category: post.category,
      featured: post.featured || false,
      keywords: [post.primaryKeyword, ...(post.secondaryKeywords || [])],
      template: post.template,
    });
  }

  // Sort by publish date descending (newest first)
  entries.sort((a, b) => b.publishDate.localeCompare(a.publishDate));

  fs.writeFileSync(INDEX_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  console.log(`Blog index written: ${entries.length} entries → ${INDEX_FILE}`);
}

main();
