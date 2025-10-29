import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@flipcars.com')
    await page.fill('input[name="password"]', 'Admin123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should display dashboard overview', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard')
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })

  test('should display key metrics cards', async ({ page }) => {
    await expect(page.locator('text=Total Leads')).toBeVisible()
    await expect(page.locator('text=Active Customers')).toBeVisible()
    await expect(page.locator('text=Pending Claims')).toBeVisible()
    await expect(page.locator('text=Revenue')).toBeVisible()
  })

  test('should display charts', async ({ page }) => {
    await expect(page.locator('text=Leads Overview')).toBeVisible()
    await expect(page.locator('text=Sales Performance')).toBeVisible()
  })

  test('should navigate to leads page', async ({ page }) => {
    await page.click('text=Leads')
    await expect(page).toHaveURL(/.*leads/)
    await expect(page.locator('h1')).toContainText('Leads')
  })

  test('should navigate to customers page', async ({ page }) => {
    await page.click('text=Customers')
    await expect(page).toHaveURL(/.*customers/)
    await expect(page.locator('h1')).toContainText('Customers')
  })

  test('should navigate to claims page', async ({ page }) => {
    await page.click('text=Claims')
    await expect(page).toHaveURL(/.*claims/)
    await expect(page.locator('h1')).toContainText('Claims')
  })

  test('should navigate to AI chat page', async ({ page }) => {
    await page.click('text=AI Chat')
    await expect(page).toHaveURL(/.*ai-chat/)
    await expect(page.locator('h1')).toContainText('AI Chat')
  })

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator('text=Recent Activity')).toBeVisible()
  })

  test('should have responsive sidebar', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]')
    await expect(sidebar).toBeVisible()
    
    // Test mobile menu toggle
    await page.setViewportSize({ width: 375, height: 667 })
    const menuToggle = page.locator('button[aria-label="Toggle menu"]')
    await expect(menuToggle).toBeVisible()
  })
})

test.describe('Dashboard - Data Refresh', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@flipcars.com')
    await page.fill('input[name="password"]', 'Admin123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should refresh data when clicking refresh button', async ({ page }) => {
    const refreshButton = page.locator('button[aria-label="Refresh data"]')
    await refreshButton.click()
    
    // Should show loading state briefly
    await expect(page.locator('text=Refreshing...')).toBeVisible()
    
    // Data should be refreshed
    await expect(page.locator('text=Refreshing...')).not.toBeVisible()
  })
})
