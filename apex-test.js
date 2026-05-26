const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const OUT = '/tmp/apex-screenshots';
fs.mkdirSync(OUT, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  console.log(`✓ ${name}`);
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // Home
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await shot(page, '01-home');

  // Roadmap
  await page.goto(`${BASE}/roadmap`, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1');
  await shot(page, '02-roadmap');

  // Check a topic
  const checkbox = page.locator('input[type="checkbox"]').first();
  if (await checkbox.count()) {
    await checkbox.click();
    await page.waitForTimeout(400);
    await shot(page, '03-roadmap-checked');
  }

  // Resources
  await page.goto(`${BASE}/resources`, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1');
  await shot(page, '04-resources');

  // Community
  await page.goto(`${BASE}/community`, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1');
  await shot(page, '05-community');

  // New post (auth guard)
  await page.goto(`${BASE}/community/new`, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1');
  await shot(page, '06-community-new');

  // About
  await page.goto(`${BASE}/about`, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1');
  await shot(page, '07-about');

  // Console errors
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  if (errors.length) console.error('Console errors:', errors);
  else console.log('✓ No console errors');

  await browser.close();
  console.log(`\nScreenshots saved to ${OUT}`);
})().catch(e => { console.error(e); process.exit(1); });
