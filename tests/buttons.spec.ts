import { test, expect } from '@playwright/test';

test.describe('Button Functionality Tests', () => {
  test('should test all buttons and clickable elements on public pages', async ({ page }) => {
    const workingButtons: string[] = [];
    const nonFunctionalButtons: string[] = [];
    
    // Test public routes that don't require authentication
    const publicPages = ['/login', '/register', '/opportunities'];
    
    for (const pagePath of publicPages) {
      console.log(`\n🔍 Testing buttons on ${pagePath}...`);
      
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Get all buttons and clickable elements
      const buttons = await page.locator('button, a[href], [role="button"], [tabindex="0"]').all();
      
      console.log(`   Found ${buttons.length} clickable elements to test...`);
      
      // Limit testing to first 10 elements per page to avoid timeouts
      const maxElementsToTest = Math.min(buttons.length, 10);
      console.log(`   Testing first ${maxElementsToTest} elements to avoid timeouts...`);
      
      for (let i = 0; i < maxElementsToTest; i++) {
        const button = buttons[i];
        
        try {
          // Get button info before clicking
          const buttonText = await button.textContent() || 'No text';
          const buttonTag = await button.evaluate(el => el.tagName.toLowerCase());
          const buttonHref = await button.getAttribute('href') || '';
          
          // Skip hidden or disabled buttons
          const isVisible = await button.isVisible();
          const isDisabled = await button.getAttribute('disabled') !== null;
          
          if (!isVisible || isDisabled) {
            console.log(`   ⏭️  Skipping hidden/disabled: ${buttonTag} "${buttonText.trim()}"`);
            continue;
          }
          
          // Skip self-referencing links (e.g., /opportunities on /opportunities page)
          if (buttonHref === pagePath) {
            console.log(`   ⏭️  Skipping self-referencing: ${buttonTag} "${buttonText.trim()}" → ${buttonHref}`);
            continue;
          }
          
          // Get initial state
          const initialUrl = page.url();
          const initialContent = await page.content();
          
          // Try to click the button with timeout
          try {
            await button.click({ timeout: 5000 });
            
            // Wait a bit for any changes to take effect
            await page.waitForTimeout(1000);
            
            // Check for changes
            const newUrl = page.url();
            const newContent = await page.content();
            const urlChanged = newUrl !== initialUrl;
            const contentChanged = newContent !== initialContent;
            
            if (urlChanged || contentChanged) {
              workingButtons.push(`${pagePath} - ${buttonTag} "${buttonText.trim()}"`);
              console.log(`   ✅ Working: ${buttonTag} "${buttonText.trim()}"`);
              
              if (urlChanged) {
                console.log(`      → Navigated to: ${newUrl}`);
              }
              if (contentChanged) {
                console.log(`      → Content changed`);
              }
              
              // Go back if we navigated away
              if (urlChanged && newUrl !== pagePath) {
                await page.goBack();
                await page.waitForLoadState('networkidle');
              }
            } else {
              nonFunctionalButtons.push(`${pagePath} - ${buttonTag} "${buttonText.trim()}"`);
              console.log(`   ⚠️  No action: ${buttonTag} "${buttonText.trim()}"`);
            }
            
          } catch (clickError) {
            console.log(`   ⚠️  Click failed: ${buttonTag} "${buttonText.trim()}" - ${clickError}`);
            nonFunctionalButtons.push(`${pagePath} - ${buttonTag} "${buttonText.trim()}" (click failed)`);
          }
          
        } catch (error) {
          console.log(`   ❌ Error testing button ${i + 1}: ${error}`);
          nonFunctionalButtons.push(`${pagePath} - Button ${i + 1} (error)`);
        }
      }
    }
    
    // Test summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 BUTTON TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Working buttons: ${workingButtons.length}`);
    console.log(`⚠️  Non-functional buttons: ${nonFunctionalButtons.length}`);
    
    if (workingButtons.length > 0) {
      console.log('\n✅ Working buttons:');
      workingButtons.forEach(btn => console.log(`   - ${btn}`));
    }
    
    if (nonFunctionalButtons.length > 0) {
      console.log('\n⚠️  Buttons with no function:');
      nonFunctionalButtons.forEach(btn => console.log(`   - ${btn}`));
    }
    
    console.log('='.repeat(60));
    
    // Assert that we have at least some working buttons
    expect(workingButtons.length).toBeGreaterThan(0);
  });
  
  test('should test authentication flow buttons', async ({ page }) => {
    console.log('\n🔍 Testing authentication flow...');
    
    // Test login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Test register link
    const registerLink = page.locator('a[href="/register"]');
    if (await registerLink.isVisible()) {
      console.log('   🔗 Testing register link...');
      const initialUrl = page.url();
      await registerLink.click();
      await page.waitForLoadState('networkidle');
      
      const newUrl = page.url();
      if (newUrl !== initialUrl) {
        console.log('   ✅ Register link works');
        await page.goBack();
        await page.waitForLoadState('networkidle');
      } else {
        console.log('   ❌ Register link failed');
      }
    }
    
    // Test form submission (without actual submission)
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      console.log('   🔘 Submit button found and visible');
    }
  });
  
  test('should test navigation between public pages', async ({ page }) => {
    console.log('\n🔍 Testing navigation between public pages...');
    
    // Test login → register navigation
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    const registerLink = page.locator('a[href="/register"]');
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      if (currentUrl.includes('/register')) {
        console.log('   ✅ Login → Register navigation works');
        
        // Test back to login
        const loginLink = page.locator('a[href="/login"]');
        if (await loginLink.isVisible()) {
          await loginLink.click();
          await page.waitForLoadState('networkidle');
          
          const backUrl = page.url();
          if (backUrl.includes('/login')) {
            console.log('   ✅ Register → Login navigation works');
          } else {
            console.log('   ❌ Register → Login navigation failed');
          }
        }
      } else {
        console.log('   ❌ Login → Register navigation failed');
      }
    }
  });
});
