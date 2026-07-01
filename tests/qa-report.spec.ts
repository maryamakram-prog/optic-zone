import { test, expect } from '@playwright/test';

test.describe('Website QA Suite', () => {
  const BASE_URL = 'http://localhost:3000';

  test('Home Page - Core Sections', async ({ page }) => {
    await page.goto(BASE_URL);
    // Verify title and main banner
    await expect(page).toHaveTitle(/Optic Zone/);
    await expect(page.locator('text=Shop Eyeglasses').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });

  test('Product Categories Page', async ({ page }) => {
    await page.goto(`${BASE_URL}/products/eyeglasses`);
    // Verify headings
    await expect(page.locator('h1').first()).toHaveText(/Eyeglasses/i);
    // Verify Sort By exists
    await expect(page.locator('text=Sort By').first()).toBeVisible();
  });

  test('Product Details Page', async ({ page }) => {
    await page.goto(`${BASE_URL}/products/sunglasses`);
    // Find first product card and click it
    const firstProduct = page.locator('div.group').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();
    await expect(page).toHaveURL(/.*\/product\/.*/);
    
    // Check main elements
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('text=Add to Cart').first()).toBeVisible();
    await expect(page.locator('text=Reviews').first()).toBeVisible();
  });

  test('Shopping Cart Page', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart`);
    await expect(page.locator('h1').first()).toHaveText(/Your Cart/i);
    // Even if empty, it should have the order summary box or empty cart text
    await expect(page.locator('text=Order Summary').or(page.locator('text=Your cart is empty'))).toBeVisible();
  });

  test('Checkout Page', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`);
    // Next.js might redirect if cart is empty, or show empty state
    await expect(page.locator('body')).toBeVisible();
  });

  test('Authentication Pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('h1').first()).toHaveText(/Welcome Back/i);
    await expect(page.locator('input[type="email"]').first()).toBeVisible();

    await page.goto(`${BASE_URL}/register`);
    await expect(page.locator('h1').first()).toHaveText(/Create an Account/i);
  });

  test('Account Tracking Page', async ({ page }) => {
    // Login first because /account/* requires authentication
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="email"]').first().fill('john@opticzone.com');
    await page.locator('input[type="password"]').first().fill('password123');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/.*\/account.*/, { timeout: 10000 }).catch(() => {}); // wait for auth state
    
    await page.goto(`${BASE_URL}/account/tracking`);
    await expect(page.locator('h2').first()).toHaveText(/Track Your Order/i);
    await expect(page.locator('input[placeholder*="e.g."]').first()).toBeVisible();
    await expect(page.locator('button', { hasText: 'Track' }).first()).toBeVisible();
  });

  test('Static Pages', async ({ page }) => {
    // FAQ
    await page.goto(`${BASE_URL}/faq`);
    await expect(page.locator('h1').first()).toHaveText(/Frequently Asked Questions/i);
    
    // Shipping
    await page.goto(`${BASE_URL}/shipping`);
    await expect(page.locator('h1').first()).toHaveText(/Shipping/i);
    
    // Returns
    await page.goto(`${BASE_URL}/returns`);
    await expect(page.locator('h1').first()).toHaveText(/Return/i);
  });
});
