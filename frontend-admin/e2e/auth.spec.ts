import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should show login page by default', async ({ page }) => {
    await expect(page).toHaveTitle(/FlipCars/)
    await expect(page.locator('h1')).toContainText('Sign In')
  })

  test('should display login form elements', async ({ page }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should show error for invalid email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Invalid email')).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=Create an account')
    
    await expect(page).toHaveURL(/.*register/)
    await expect(page.locator('h1')).toContainText('Create Account')
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'admin@flipcars.com')
    await page.fill('input[name="password"]', 'Admin123!')
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')
    const toggleButton = page.locator('button[aria-label="Toggle password visibility"]')
    
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should persist login state after refresh', async ({ page }) => {
    // Login
    await page.fill('input[name="email"]', 'admin@flipcars.com')
    await page.fill('input[name="password"]', 'Admin123!')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Refresh page
    await page.reload()
    
    // Should still be on dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.fill('input[name="email"]', 'admin@flipcars.com')
    await page.fill('input[name="password"]', 'Admin123!')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Logout
    await page.click('button[aria-label="User menu"]')
    await page.click('text=Logout')
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/)
    await expect(page.locator('h1')).toContainText('Sign In')
  })
})
