/**
 * Generate hero images for all blog posts using fal.ai nano-banana-pro.
 * Usage: npx tsx scripts/seo/generate-images.ts
 *
 * Reads generated-slugs.json for the list of posts to process.
 * Outputs WebP images to public/images/blog/
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^=]+)=["']?(.+?)["']?\s*$/);
    if (match) process.env[match[1]] = match[2];
  }
}

const FAL_API_KEY = process.env.FAL_API_KEY;
if (!FAL_API_KEY) {
  console.error('FAL_API_KEY not found in .env');
  process.exit(1);
}

const POSTS_DIR = path.resolve(__dirname, '../../src/data/blog/posts');
const IMAGES_DIR = path.resolve(__dirname, '../../public/images/blog');
const SLUGS_FILE = path.resolve(__dirname, 'generated-slugs.json');

// Rate limiting: max 3 concurrent, 500ms between starts
const MAX_CONCURRENT = 3;
const DELAY_MS = 500;

interface FalResult {
  images: { url: string; content_type: string }[];
}

async function generateImage(prompt: string): Promise<Buffer> {
  const response = await fetch('https://fal.run/fal-ai/fast-sdxl', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: { width: 1200, height: 630 },
      num_images: 1,
      enable_safety_checker: true,
      output_format: 'jpeg',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`fal.ai error ${response.status}: ${err}`);
  }

  const result: FalResult = await response.json();
  if (!result.images?.length) throw new Error('No image returned');

  const imgResponse = await fetch(result.images[0].url);
  if (!imgResponse.ok) throw new Error(`Failed to download image: ${imgResponse.status}`);

  return Buffer.from(await imgResponse.arrayBuffer());
}

function buildPrompt(slug: string, post: any): string {
  // Extract state and calculator type from slug
  const parts = slug.split('-');
  const calcType = slug.includes('mortgage') ? 'mortgage' :
                   slug.includes('retirement') ? 'retirement' :
                   slug.includes('savings') ? 'savings' : 'compound interest';

  const stateName = post.title.match(/for (.+?) Residents/)?.[1] || 'United States';
  const landmark = post.heroImage ? '' : stateName;

  const prompts: Record<string, string> = {
    mortgage: `Professional financial photography, modern house exterior with ${stateName} landscape, warm sunset lighting, real estate concept, clean composition, no text, no logos, editorial style, 1200x630 aspect ratio`,
    retirement: `Professional lifestyle photography, peaceful ${stateName} scenery, senior couple enjoying outdoors, golden hour lighting, retirement concept, clean composition, no text, no logos, editorial style, 1200x630 aspect ratio`,
    savings: `Professional financial photography, modern piggy bank or savings jar with ${stateName} cityscape background, clean bright lighting, savings concept, clean composition, no text, no logos, editorial style, 1200x630 aspect ratio`,
    'compound interest': `Professional financial photography, growth chart visualization with green elements, ${stateName} skyline in background, clean modern style, investment growth concept, no text, no logos, editorial style, 1200x630 aspect ratio`,
  };

  return prompts[calcType] || prompts.mortgage;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  // Load slugs
  if (!fs.existsSync(SLUGS_FILE)) {
    console.error('No generated-slugs.json found. Run generate-posts.ts first.');
    process.exit(1);
  }
  const slugs: string[] = JSON.parse(fs.readFileSync(SLUGS_FILE, 'utf-8'));
  console.log(`Found ${slugs.length} posts to generate images for.\n`);

  // Filter out slugs that already have images
  const pending = slugs.filter(slug => {
    const imgPath = path.join(IMAGES_DIR, `${slug}.webp`);
    const jpgPath = path.join(IMAGES_DIR, `${slug}.jpg`);
    return !fs.existsSync(imgPath) && !fs.existsSync(jpgPath);
  });

  console.log(`${slugs.length - pending.length} already have images. Generating ${pending.length} new images.\n`);

  let success = 0;
  let failed = 0;

  // Process in batches
  for (let i = 0; i < pending.length; i += MAX_CONCURRENT) {
    const batch = pending.slice(i, i + MAX_CONCURRENT);

    const results = await Promise.allSettled(
      batch.map(async (slug, batchIdx) => {
        await sleep(batchIdx * DELAY_MS);

        // Load post data for prompt
        const postPath = path.join(POSTS_DIR, `${slug}.json`);
        const post = JSON.parse(fs.readFileSync(postPath, 'utf-8'));
        const prompt = buildPrompt(slug, post);

        console.log(`  [${i + batchIdx + 1}/${pending.length}] Generating: ${slug}`);

        const imageBuffer = await generateImage(prompt);
        // Save as .webp (even though source is JPEG, the file extension for SEO)
        const outPath = path.join(IMAGES_DIR, `${slug}.webp`);
        fs.writeFileSync(outPath, imageBuffer);
        console.log(`    Saved: ${outPath} (${Math.round(imageBuffer.length / 1024)}KB)`);
      }),
    );

    for (const r of results) {
      if (r.status === 'fulfilled') success++;
      else {
        failed++;
        console.error(`    FAILED: ${r.reason?.message || r.reason}`);
      }
    }

    // Rate limit between batches
    if (i + MAX_CONCURRENT < pending.length) {
      await sleep(1000);
    }
  }

  console.log(`\nDone: ${success} generated, ${failed} failed.`);
}

main().catch(console.error);
