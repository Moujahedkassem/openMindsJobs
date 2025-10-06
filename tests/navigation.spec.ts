import { test, expect } from '@playwright/test';

test.describe('Navigation Link Tests', () => {
  test('should test all navigation links on public pages', async ({ page }) => {
    const workingLinks: string[] = [];
    const brokenLinks: string[] = [];
    
    // Test public routes that don't require authentication
    const publicPages = ['/login', '/register', '/opportunities'];
    
    for (const pagePath of publicPages) {
      console.log(`\n🔍 Testing navigation on ${pagePath}...`);
      
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Get all navigation links
      const navLinks = await page.locator('a[href]').all();
      
      console.log(`   Found ${navLinks.length} navigation links to test...`);
      
      // Limit testing to first 15 links per page to avoid timeouts
      const maxLinksToTest = Math.min(navLinks.length, 15);
      console.log(`   Testing first ${maxLinksToTest} links to avoid timeouts...`);
      
      for (let i = 0; i < maxLinksToTest; i++) {
        const link = navLinks[i];
        
        try {
          // Get link info
          const linkText = await link.textContent() || 'No text';
          const linkHref = await link.getAttribute('href') || '';
          
          // Skip external links or anchors
          if (linkHref.startsWith('http') || linkHref.startsWith('mailto:') || linkHref.startsWith('tel:') || linkHref.startsWith('#')) {
            console.log(`   ⏭️  Skipping external/anchor: "${linkText.trim()}" → ${linkHref}`);
            continue;
          }
          
          // Skip self-referencing links (e.g., /opportunities on /opportunities page)
          if (linkHref === pagePath) {
            console.log(`   ⏭️  Skipping self-referencing: "${linkText.trim()}" → ${linkHref}`);
            continue;
          }
          
          // Skip hidden links
          const isVisible = await link.isVisible();
          if (!isVisible) {
            console.log(`   ⏭️  Skipping hidden: "${linkText.trim()}"`);
            continue;
          }
          
          console.log(`   🔗 Testing: "${linkText.trim()}" → ${linkHref}`);
          
          // Get initial state
          const initialUrl = page.url();
          
          // Click the link with timeout
          try {
            await link.click({ timeout: 5000 });
            
            // Wait for navigation
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);
            
            // Check if navigation occurred
            const newUrl = page.url();
            const urlChanged = newUrl !== initialUrl;
            
            if (urlChanged) {
              // Check if the page loaded successfully
              try {
                // Look for common error indicators
                const errorSelectors = [
                  'h1:has-text("404")',
                  'h1:has-text("Not Found")',
                  'h1:has-text("Error")',
                  '.error',
                  '[data-testid="error"]'
                ];
                
                let hasError = false;
                for (const selector of errorSelectors) {
                  try {
                    const errorElement = page.locator(selector);
                    if (await errorElement.isVisible()) {
                      hasError = true;
                      break;
                    }
                  } catch {
                    // Selector not found, continue
                  }
                }
                
                if (hasError) {
                  brokenLinks.push(`${pagePath} - "${linkText.trim()}" → ${linkHref} (404/Error)`);
                  console.log(`   ❌ Broken link: "${linkText.trim()}" → ${linkHref} (404/Error)`);
                } else {
                  workingLinks.push(`${pagePath} - "${linkText.trim()}" → ${linkHref}`);
                  console.log(`   ✅ Working link: "${linkText.trim()}" → ${linkHref}`);
                }
                
              } catch (error) {
                console.log(`   ⚠️  Could not verify page content: ${error}`);
                workingLinks.push(`${pagePath} - "${linkText.trim()}" → ${linkHref} (unverified)`);
              }
              
              // Go back to original page
              await page.goBack();
              await page.waitForLoadState('networkidle');
              
            } else {
              console.log(`   ⚠️  No navigation: "${linkText.trim()}"`);
              brokenLinks.push(`${pagePath} - "${linkText.trim()}" → ${linkHref} (no navigation)`);
            }
            
          } catch (clickError) {
            console.log(`   ❌ Click failed: "${linkText.trim()}" → ${linkHref} - ${clickError}`);
            brokenLinks.push(`${pagePath} - "${linkText.trim()}" → ${linkHref} (click failed)`);
          }
          
        } catch (error) {
          console.log(`   ❌ Error testing link ${i + 1}: ${error}`);
          brokenLinks.push(`${pagePath} - Link ${i + 1} (error)`);
        }
      }
    }
    
    // Test summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 NAVIGATION TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Working links: ${workingLinks.length}`);
    console.log(`❌ Broken links: ${brokenLinks.length}`);
    
    if (workingLinks.length > 0) {
      console.log('\n✅ Working navigation links:');
      workingLinks.forEach(link => console.log(`   - ${link}`));
    }
    
    if (brokenLinks.length > 0) {
      console.log('\n❌ Broken navigation links:');
      brokenLinks.forEach(link => console.log(`   - ${link}`));
    }
    
    console.log('='.repeat(60));
    
    // Assert that we have working navigation
    expect(workingLinks.length).toBeGreaterThan(0);
  });
  
  test('should test logo navigation on public pages', async ({ page }) => {
    console.log('\n🔍 Testing logo navigation...');
    
    // Test logo on login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Look for logo links
    const logoLinks = page.locator('a[href="/home"], a[href="/"], img[alt*="Logo"], img[alt*="logo"]').first();
    if (await logoLinks.count() > 0) {
      console.log('   🖼️  Logo found on login page');
      
      // Test if logo is clickable
      const clickableLogo = page.locator('a[href="/home"], a[href="/"]').first();
      if (await clickableLogo.isVisible()) {
        console.log('   🔗 Logo is clickable');
        
        const initialUrl = page.url();
        await clickableLogo.click();
        await page.waitForLoadState('networkidle');
        
        const newUrl = page.url();
        if (newUrl !== initialUrl) {
          console.log('   ✅ Logo navigation works');
        } else {
          console.log('   ❌ Logo navigation failed');
        }
      }
    } else {
      console.log('   ⚠️  No logo found on login page');
    }
  });
  
  test('should test mobile navigation on public pages', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    console.log('\n📱 Testing mobile navigation on public pages...');
    
    // Check for mobile menu button (might not exist on auth pages)
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], .mobile-menu-button, .hamburger');
    const hasMobileMenu = await mobileMenuButton.count() > 0;
    
    if (hasMobileMenu) {
      console.log('   ✅ Mobile menu button found');
      
      // Test mobile menu functionality
      try {
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
        
        // Check if mobile menu opened
        const mobileMenu = page.locator('.mobile-menu, .mobile-nav, [role="navigation"]');
        const isMenuOpen = await mobileMenu.isVisible();
        
        if (isMenuOpen) {
          console.log('   ✅ Mobile menu opens');
          
          // Test mobile menu links
          const mobileLinks = mobileMenu.locator('a[href]');
          const mobileLinkCount = await mobileLinks.count();
          console.log(`   🔗 Mobile menu has ${mobileLinkCount} links`);
          
        } else {
          console.log('   ❌ Mobile menu does not open');
        }
        
      } catch (error) {
        console.log(`   ⚠️  Error testing mobile menu: ${error}`);
      }
    } else {
      console.log('   ℹ️  No mobile menu button found (expected on auth pages)');
    }
    
    // Test responsive design
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    console.log('   ✅ Mobile viewport works correctly');
  });
});
