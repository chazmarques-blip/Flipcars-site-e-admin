const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting FlipCars detailed estimate form test...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console logs
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
    console.log(`  📋 [CONSOLE ${msg.type().toUpperCase()}] ${text}`);
  });
  
  // Capture errors
  page.on('pageerror', error => {
    console.log(`  ❌ [PAGE ERROR] ${error.message}`);
  });
  
  try {
    // Step 1: Navigate to homepage
    console.log('\n📍 Step 1: Loading homepage...');
    await page.goto('https://www.flipcars.us/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ Homepage loaded');
    
    // Take initial screenshot
    await page.screenshot({ path: '/home/user/webapp/screenshot-1-homepage.png' });
    console.log('📸 Screenshot saved: screenshot-1-homepage.png');
    
    // Step 2: Wait for page to be fully loaded
    console.log('\n📍 Step 2: Waiting for page to be ready...');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Step 3: Find and click Free Estimate button
    console.log('\n📍 Step 3: Looking for "Free Estimate" button...');
    
    // Try multiple selectors
    const selectors = [
      'button:has-text("Free Estimate")',
      'button:text("Free Estimate")',
      'text="Free Estimate"',
      '[class*="estimate"]',
    ];
    
    let estimateButton = null;
    for (const selector of selectors) {
      try {
        const btn = page.locator(selector).first();
        if (await btn.isVisible({ timeout: 1000 })) {
          estimateButton = btn;
          console.log(`✅ Found button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (estimateButton) {
      console.log('✅ Clicking "Free Estimate" button...');
      await estimateButton.click();
      console.log('✅ Clicked!');
      
      // Wait longer for modal to appear
      console.log('\n📍 Step 4: Waiting for modal to appear...');
      await page.waitForTimeout(3000);
      
      // Take screenshot after click
      await page.screenshot({ path: '/home/user/webapp/screenshot-2-after-click.png' });
      console.log('📸 Screenshot saved: screenshot-2-after-click.png');
      
      // Check page HTML for modal-related classes
      console.log('\n📍 Step 5: Analyzing page structure...');
      const bodyHTML = await page.locator('body').innerHTML();
      
      // Check for common modal indicators
      const hasDialog = bodyHTML.includes('role="dialog"');
      const hasModal = bodyHTML.includes('modal');
      const hasOverlay = bodyHTML.includes('overlay');
      const hasEstimateForm = bodyHTML.includes('EstimateForm') || bodyHTML.includes('estimate-form');
      
      console.log(`   Dialog role found: ${hasDialog}`);
      console.log(`   Modal class found: ${hasModal}`);
      console.log(`   Overlay found: ${hasOverlay}`);
      console.log(`   Estimate form found: ${hasEstimateForm}`);
      
      // Try to find any visible form
      console.log('\n📍 Step 6: Looking for forms...');
      const forms = await page.locator('form').all();
      console.log(`   Found ${forms.length} form(s) on page`);
      
      for (let i = 0; i < forms.length; i++) {
        const isVisible = await forms[i].isVisible();
        console.log(`   Form ${i + 1}: ${isVisible ? 'VISIBLE ✅' : 'HIDDEN ❌'}`);
      }
      
      // Check for any visible inputs
      const visibleInputs = await page.locator('input[type="text"]:visible, input[type="email"]:visible, input[type="tel"]:visible').all();
      console.log(`\n📝 Found ${visibleInputs.length} visible input field(s)`);
      
      // Summary of logs
      console.log('\n📊 Console Logs Summary:');
      console.log(`   Total logs captured: ${logs.length}`);
      
      // Check for specific log patterns
      const apiClientLog = logs.find(log => log.includes('[ApiClient]'));
      const estimateFormLog = logs.find(log => log.includes('[EstimateForm]'));
      
      if (apiClientLog) {
        console.log(`   ✅ ApiClient log found`);
      } else {
        console.log(`   ⚠️  ApiClient log NOT found`);
      }
      
      if (estimateFormLog) {
        console.log(`   ✅ EstimateForm log found`);
      } else {
        console.log(`   ⚠️  EstimateForm log NOT found`);
      }
      
      // Show first few logs
      if (logs.length > 0) {
        console.log('\n   Recent logs:');
        logs.slice(-5).forEach(log => console.log(`      ${log}`));
      }
      
    } else {
      console.log('❌ "Free Estimate" button NOT found');
      
      // Debug: Show available buttons
      const allButtons = await page.locator('button').all();
      console.log(`\n   Found ${allButtons.length} button(s) on page`);
      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        const text = await allButtons[i].textContent();
        console.log(`      Button ${i + 1}: "${text}"`);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error during test:', error.message);
    
    // Take error screenshot
    try {
      await page.screenshot({ path: '/home/user/webapp/screenshot-error.png' });
      console.log('📸 Error screenshot saved: screenshot-error.png');
    } catch (e) {
      // Ignore screenshot errors
    }
  } finally {
    await browser.close();
    console.log('\n🏁 Test completed!');
  }
})();
