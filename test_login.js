const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  try {
    console.log('1. Navegando para login...');
    await page.goto('https://3001-i0s90jm77mc76ydqc5fpz-02b9cc79.sandbox.novita.ai/auth/login', { waitUntil: 'networkidle' });
    
    console.log('2. Preenchendo formulário...');
    await page.fill('input[type="email"]', 'sarah@flipcars.us');
    await page.fill('input[type="password"]', 'Admin123!');
    
    console.log('3. Clicando em Sign In...');
    await page.click('button[type="submit"]');
    
    console.log('4. Aguardando navegação...');
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log('5. URL atual:', currentUrl);
    
    // Check localStorage
    const authStorage = await page.evaluate(() => localStorage.getItem('auth-storage'));
    console.log('6. Auth storage:', authStorage ? 'EXISTE' : 'NÃO EXISTE');
    if (authStorage) {
      console.log('   Conteúdo:', authStorage.substring(0, 100) + '...');
    }
    
    // Try to access dashboard
    console.log('7. Tentando acessar dashboard...');
    await page.goto('https://3001-i0s90jm77mc76ydqc5fpz-02b9cc79.sandbox.novita.ai/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const finalUrl = page.url();
    console.log('8. URL final:', finalUrl);
    
    // Take screenshot
    await page.screenshot({ path: '/home/user/webapp/screenshot.png', fullPage: true });
    console.log('9. Screenshot salvo em /home/user/webapp/screenshot.png');
    
  } catch (error) {
    console.error('ERRO:', error.message);
  } finally {
    await browser.close();
  }
})();
