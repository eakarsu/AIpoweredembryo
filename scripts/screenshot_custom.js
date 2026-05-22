const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', msg => console.log('[browser:' + msg.type() + ']', msg.text()));
  page.on('pageerror', err => console.log('[pageerror]', err.message));

  try {
    console.log('Go to /login');
    await page.goto('http://localhost:3100/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });
    await page.fill('input[type="email"]', 'admin@ivfclinic.com');
    await page.fill('input[type="password"]', 'admin123');
    await Promise.all([
      page.waitForURL(/\/$|\/custom-views/, { timeout: 15000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForTimeout(1500);

    console.log('Go to /custom-views');
    await page.goto('http://localhost:3100/custom-views', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    await page.screenshot({ path: '/tmp/custom_AIpoweredembryo.png', fullPage: true });
    console.log('SCREENSHOT_OK /tmp/custom_AIpoweredembryo.png');
  } catch (e) {
    console.error('ERR', e.message);
    try { await page.screenshot({ path: '/tmp/custom_AIpoweredembryo.png', fullPage: true }); } catch (_) {}
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
