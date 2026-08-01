const { join } = require('path');

/**
 * Keep Chrome inside node_modules so CI build caches (Vercel) preserve it
 * between builds instead of re-downloading ~170MB every deploy.
 * https://pptr.dev/guides/configuration
 */
module.exports = {
  cacheDirectory: join(__dirname, 'node_modules', '.cache', 'puppeteer'),
};
