import { test, expect } from '@playwright/test'

test.describe('Leads Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to leads page
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@flipcars.com')
    await page.fill('input[name="password"]', 'Admin123!')
    await page.click('button[type="submit"]')
    await page.goto('/dashboard/leads')
  })

  test('should display leads list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Leads')
    await expect(page.locator('table')).toBeVisible()
  })

  test('should display leads table headers', async ({ page }) => {
    await expect(page.locator('th:has-text("Name")')).toBeVisible()
    await expect(page.locator('th:has-text("Email")')).toBeVisible()
    await expect(page.locator('th:has-text("Phone")')).toBeVisible()
    await expect(page.locator('th:has-text("Status")')).toBeVisible()
    await expect(page.locator('th:has-text("Actions")')).toBeVisible()
  })

  test('should open create lead dialog', async ({ page }) => {
    await page.click('button:has-text("Create Lead")')
    
    await expect(page.locator('text=Create New Lead')).toBeVisible()
    await expect(page.locator('input[name="firstName"]')).toBeVisible()
    await expect(page.locator('input[name="lastName"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })

  test('should create a new lead', async ({ page }) => {
    await page.click('button:has-text("Create Lead")')
    
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="phone"]', '(555) 123-4567')
    await page.selectOption('select[name="source"]', 'website')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Lead created successfully')).toBeVisible()
    await expect(page.locator('text=John Doe')).toBeVisible()
  })

  test('should search leads', async ({ page }) => {
    await page.fill('input[placeholder="Search leads..."]', 'John')
    
    // Wait for search results
    await page.waitForTimeout(500)
    
    await expect(page.locator('text=John')).toBeVisible()
  })

  test('should filter leads by status', async ({ page }) => {
    await page.click('button:has-text("Filter")')
    await page.click('text=New')
    
    // Should show only new leads
    await expect(page.locator('text=Status: New')).toBeVisible()
  })

  test('should view lead details', async ({ page }) => {
    await page.click('button[aria-label="View lead details"]').first()
    
    await expect(page.locator('text=Lead Details')).toBeVisible()
    await expect(page.locator('text=Contact Information')).toBeVisible()
    await expect(page.locator('text=Source')).toBeVisible()
  })

  test('should edit lead', async ({ page }) => {
    await page.click('button[aria-label="Edit lead"]').first()
    
    await expect(page.locator('text=Edit Lead')).toBeVisible()
    
    await page.fill('input[name="phone"]', '(555) 987-6543')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Lead updated successfully')).toBeVisible()
  })

  test('should convert lead to customer', async ({ page }) => {
    await page.click('button[aria-label="More actions"]').first()
    await page.click('text=Convert to Customer')
    
    await expect(page.locator('text=Convert Lead to Customer')).toBeVisible()
    await page.click('button:has-text("Confirm")')
    
    await expect(page.locator('text=Lead converted successfully')).toBeVisible()
  })

  test('should delete lead', async ({ page }) => {
    await page.click('button[aria-label="More actions"]').first()
    await page.click('text=Delete')
    
    await expect(page.locator('text=Delete Lead')).toBeVisible()
    await page.click('button:has-text("Confirm")')
    
    await expect(page.locator('text=Lead deleted successfully')).toBeVisible()
  })

  test('should paginate leads', async ({ page }) => {
    await expect(page.locator('button:has-text("Next")')).toBeVisible()
    
    await page.click('button:has-text("Next")')
    
    // URL should update with page parameter
    await expect(page).toHaveURL(/.*page=2/)
  })

  test('should export leads', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export")')
    
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('leads')
  })
})
