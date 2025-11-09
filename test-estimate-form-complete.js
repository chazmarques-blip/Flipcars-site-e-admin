const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting FlipCars estimate form test...\n');
  
  const browser = await chromium.launch();
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
  
  try {
    // Step 1: Navigate to homepage
    console.log('\n📍 Step 1: Loading homepage...');
    await page.goto('https://www.flipcars.us/', { waitUntil: 'networkidle' });
    console.log('✅ Homepage loaded');
    
    // Step 2: Wait for page to be ready
    console.log('\n📍 Step 2: Waiting for page to be ready...');
    await page.waitForTimeout(2000);
    
    // Step 3: Click Free Estimate button
    console.log('\n📍 Step 3: Looking for "Free Estimate" button...');
    const estimateButton = await page.locator('button:has-text("Free Estimate")').first();
    
    if (await estimateButton.isVisible()) {
      console.log('✅ Found "Free Estimate" button');
      await estimateButton.click();
      console.log('✅ Clicked "Free Estimate" button');
      
      // Wait for modal to open
      await page.waitForTimeout(1000);
      
      // Step 4: Check if modal opened
      console.log('\n📍 Step 4: Checking if modal opened...');
      const modal = await page.locator('[role="dialog"], .modal, [class*="modal"]').first();
      
      if (await modal.isVisible()) {
        console.log('✅ Modal is visible!');
        
        // Take screenshot
        await page.screenshot({ path: '/home/user/webapp/modal-opened.png', fullPage: true });
        console.log('📸 Screenshot saved: modal-opened.png');
        
        // Check for form fields
        console.log('\n📍 Step 5: Checking for form fields...');
        const form = await page.locator('form').first();
        
        if (await form.isVisible()) {
          console.log('✅ Form is visible in modal!');
          
          // Log all input fields found
          const inputs = await page.locator('input[type="text"], input[type="email"], input[type="tel"]').all();
          console.log(`📝 Found ${inputs.length} input fields`);
          
          // Summary of logs captured
          console.log('\n📊 Console Logs Summary:');
          console.log(`   Total logs captured: ${logs.length}`);
          
          // Check for ApiClient initialization log
          const apiClientLog = logs.find(log => log.includes('[ApiClient]') && log.includes('Initializing'));
          if (apiClientLog) {
            console.log(`   ✅ ApiClient initialized: ${apiClientLog}`);
          } else {
            console.log('   ⚠️  ApiClient initialization log NOT found');
          }
          
        } else {
          console.log('❌ Form NOT visible in modal');
        }
        
      } else {
        console.log('❌ Modal did NOT open');
      }
      
    } else {
      console.log('❌ "Free Estimate" button NOT found');
    }
    
  } catch (error) {
    console.error('\n❌ Error during test:', error.message);
  } finally {
    await browser.close();
    console.log('\n🏁 Test completed!');
  }
})();
