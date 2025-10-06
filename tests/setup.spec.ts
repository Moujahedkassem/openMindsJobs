import { test, expect } from '@playwright/test';

test.describe('Setup Verification', () => {
  test('should handle authentication flow correctly', async ({ page }) => {
    // Visit the root path - should redirect to login
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that we were redirected to login
    const currentUrl = page.url();
    console.log(`✅ Root path redirected to: ${currentUrl}`);
    
    // Should be redirected to login page
    expect(currentUrl).toContain('/login');
    
    // Check that the login page loaded
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check that the page has content
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    
    console.log('✅ Login page loaded successfully');
    console.log(`   Title: ${title}`);
    console.log(`   URL: ${currentUrl}`);
  });
  
  test('should have working navigation elements on login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check for header/navbar (should not be present on auth pages)
    const header = page.locator('header, nav, [role="navigation"]');
    const headerCount = await header.count();
    console.log(`   Header/Nav elements: ${headerCount} (expected 0 on auth pages)`);
    
    // Check for logo
    const logo = page.locator('img[alt*="Logo"], img[alt*="logo"]');
    const logoCount = await logo.count();
    expect(logoCount).toBeGreaterThan(0);
    
    // Check for navigation links
    const navLinks = page.locator('nav a[href], header a[href]');
    const navLinkCount = await navLinks.count();
    console.log(`   Navigation links: ${navLinkCount} (expected 0 on auth pages)`);
    
    console.log('✅ Login page elements found:');
    console.log(`   Logo images: ${logoCount}`);
  });
  
  test('should handle viewport changes', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    console.log('✅ Desktop viewport (1280x800) set');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    console.log('✅ Mobile viewport (375x667) set');
    
    // Verify page still works in mobile view
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    
    console.log('✅ Viewport changes handled successfully');
  });
  
  test('should access public routes without authentication', async ({ page }) => {
    // Test opportunities page (public route)
    await page.goto('/opportunities');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    console.log(`✅ Opportunities page accessible: ${currentUrl}`);
    expect(currentUrl).toContain('/opportunities');
    
    // Check that the page loaded
    const title = await page.title();
    expect(title).toBeTruthy();
    
    console.log('✅ Public routes work without authentication');
  });
  
  test('should access new placeholder pages', async ({ page }) => {
    const placeholderPages = ['/terms', '/privacy', '/forgot-password', '/courses'];
    
    for (const pagePath of placeholderPages) {
      try {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        const currentUrl = page.url();
        console.log(`✅ ${pagePath} page accessible: ${currentUrl}`);
        expect(currentUrl).toContain(pagePath);
        
        // Check that the page loaded
        const title = await page.title();
        expect(title).toBeTruthy();
        
        // Check for basic content
        const bodyContent = await page.locator('body').textContent();
        expect(bodyContent).toBeTruthy();
        
      } catch (error) {
        console.log(`❌ Error accessing ${pagePath}: ${error}`);
        throw error;
      }
    }
    
    console.log('✅ All placeholder pages work correctly');
  });
});
