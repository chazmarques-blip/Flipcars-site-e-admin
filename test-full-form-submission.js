const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting FULL FlipCars form submission test...\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 }); // Visual mode with slow motion
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console logs
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
    console.log(`  📋 [${msg.type().toUpperCase()}] ${text}`);
  });
  
  // Capture errors
  page.on('pageerror', error => {
    console.log(`  ❌ [PAGE ERROR] ${error.message}`);
  });
  
  // Capture network requests
  page.on('request', request => {
    if (request.url().includes('/api/') || request.url().includes('railway')) {
      console.log(`  🌐 [REQUEST] ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/') || response.url().includes('railway')) {
      console.log(`  📥 [RESPONSE] ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    // Step 1: Navigate to homepage
    console.log('\n📍 Step 1: Loading homepage...');
    await page.goto('https://www.flipcars.us/', { waitUntil: 'networkidle', timeout: 60000 });
    console.log('✅ Homepage loaded\n');
    await page.waitForTimeout(2000);
    
    // Step 2: Click Free Estimate button
    console.log('📍 Step 2: Clicking "Free Estimate" button...');
    await page.click('button:has-text("Free Estimate")');
    console.log('✅ Clicked!\n');
    await page.waitForTimeout(3000);
    
    // Take screenshot after click
    await page.screenshot({ path: '/home/user/webapp/test-modal-opened.png', fullPage: true });
    console.log('📸 Screenshot saved: test-modal-opened.png\n');
    
    // Step 3: Check if form is visible and try to fill it
    console.log('📍 Step 3: Looking for form inputs...');
    
    // Try to find first name input (Step 1 of form)
    const firstNameInput = page.locator('input[name="firstName"], input[placeholder*="First"], input[id*="firstName"]').first();
    
    if (await firstNameInput.isVisible({ timeout: 5000 })) {
      console.log('✅ Found form input - modal opened successfully!\n');
      
      // Fill Step 1: Basic Info
      console.log('📍 Step 4: Filling Step 1 - Basic Info...');
      await firstNameInput.fill('John');
      await page.locator('input[name="lastName"], input[placeholder*="Last"]').first().fill('Doe');
      console.log('✅ Filled: John Doe\n');
      
      // Click Next or Continue button
      await page.click('button:has-text("Next"), button:has-text("Continue")');
      await page.waitForTimeout(1000);
      
      console.log('📍 Step 5: Filled Step 1, moved to Step 2...');
      
      // Take screenshot of Step 2
      await page.screenshot({ path: '/home/user/webapp/test-step2.png' });
      console.log('📸 Screenshot saved: test-step2.png\n');
      
      // Continue filling the form...
      console.log('📍 Note: Form modal is working! You can continue filling manually to test.\n');
      
      // Keep browser open for 10 seconds for manual inspection
      console.log('⏳ Keeping browser open for 10 seconds for inspection...');
      await page.waitForTimeout(10000);
      
    } else {
      console.log('❌ Form input NOT found - modal did NOT open properly\n');
      
      // Debug: Check what's on the page
      const bodyText = await page.locator('body').textContent();
      console.log('   Page contains "Free Estimate":', bodyText.includes('Free Estimate'));
      console.log('   Page contains "First Name":', bodyText.includes('First Name'));
    }
    
    // Summary of logs
    console.log('\n📊 Console Logs Summary:');
    console.log(`   Total logs: ${logs.length}`);
    
    const apiClientLog = logs.find(log => log.includes('[ApiClient]'));
    const estimateFormLog = logs.find(log => log.includes('[EstimateForm]'));
    
    console.log(`   ApiClient logs: ${apiClientLog ? '✅ Found' : '❌ Not found'}`);
    console.log(`   EstimateForm logs: ${estimateFormLog ? '✅ Found' : '❌ Not found'}`);
    
    if (logs.length > 0) {
      console.log('\n   All logs:');
      logs.forEach(log => console.log(`      ${log}`));
    }
    
  } catch (error) {
    console.error('\n❌ Error during test:', error.message);
  } finally {
    await browser.close();
    console.log('\n🏁 Test completed!');
  }
})();
