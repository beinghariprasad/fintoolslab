/**
 * Pings IndexNow (Bing, Yandex, etc.) with the URLs from the latest batch
 * release so new pages get crawled quickly. Google ignores IndexNow but picks
 * up the refreshed sitemap. No-op when last-release.json is empty.
 *
 * Usage: node scripts/seo-bot/ping-indexnow.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib.mjs';

const RELEASE_FILE = path.join(ROOT, 'scripts', 'seo-bot', 'last-release.json');
const KEY_FILE = path.join(ROOT, 'scripts', 'seo-bot', 'indexnow.json');

if (!fs.existsSync(RELEASE_FILE) || !fs.existsSync(KEY_FILE)) {
  console.log('No release or IndexNow key found — skipping ping.');
  process.exit(0);
}

const { released } = JSON.parse(fs.readFileSync(RELEASE_FILE, 'utf-8'));
const { key } = JSON.parse(fs.readFileSync(KEY_FILE, 'utf-8'));

if (!released || released.length === 0) {
  console.log('Nothing was released — skipping ping.');
  process.exit(0);
}

const body = {
  host: 'fintoolslab.com',
  key,
  keyLocation: `https://fintoolslab.com/${key}.txt`,
  urlList: released,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log(`IndexNow ping for ${released.length} URLs → HTTP ${res.status}`);
// 200/202 are success; anything else is logged but non-fatal (best-effort)
