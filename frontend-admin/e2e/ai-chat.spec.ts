import { test, expect } from '@playwright/test'

test.describe('AI Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to AI chat page
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@flipcars.com')
    await page.fill('input[name="password"]', 'Admin123!')
    await page.click('button[type="submit"]')
    await page.goto('/dashboard/ai-chat')
  })

  test('should display AI chat interface', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('AI Chat')
    await expect(page.locator('text=Conversations')).toBeVisible()
  })

  test('should display empty state when no conversation selected', async ({ page }) => {
    await expect(page.locator('text=No conversation selected')).toBeVisible()
    await expect(page.locator('button:has-text("Start New Chat")')).toBeVisible()
  })

  test('should create a new conversation', async ({ page }) => {
    await page.click('button:has-text("New Chat")')
    
    await expect(page.locator('text=New Chat')).toBeVisible()
    await expect(page.locator('textarea[placeholder*="Type your message"]')).toBeVisible()
  })

  test('should send a message', async ({ page }) => {
    // Create new conversation
    await page.click('button:has-text("New Chat")')
    
    // Type and send message
    const textarea = page.locator('textarea[placeholder*="Type your message"]')
    await textarea.fill('Hello, I need help with a lead qualification.')
    await page.keyboard.press('Enter')
    
    // Should display user message
    await expect(page.locator('text=Hello, I need help with a lead qualification.')).toBeVisible()
    
    // Should show AI response (streaming)
    await expect(page.locator('[data-testid="ai-message"]')).toBeVisible({ timeout: 10000 })
  })

  test('should display streaming indicator while AI is responding', async ({ page }) => {
    await page.click('button:has-text("New Chat")')
    
    const textarea = page.locator('textarea[placeholder*="Type your message"]')
    await textarea.fill('What is lead qualification?')
    await page.keyboard.press('Enter')
    
    // Should show streaming indicator
    await expect(page.locator('[data-testid="streaming-indicator"]')).toBeVisible()
    
    // Should hide after completion
    await expect(page.locator('[data-testid="streaming-indicator"]')).not.toBeVisible({ timeout: 10000 })
  })

  test('should list conversations in sidebar', async ({ page }) => {
    await expect(page.locator('[data-testid="conversation-list"]')).toBeVisible()
  })

  test('should search conversations', async ({ page }) => {
    await page.fill('input[placeholder*="Search conversations"]', 'lead')
    
    // Wait for search results
    await page.waitForTimeout(500)
    
    // Should filter conversations
    const conversations = page.locator('[data-testid="conversation-item"]')
    await expect(conversations.first()).toBeVisible()
  })

  test('should select a conversation', async ({ page }) => {
    const firstConversation = page.locator('[data-testid="conversation-item"]').first()
    await firstConversation.click()
    
    // Should load conversation messages
    await expect(page.locator('[data-testid="message"]')).toBeVisible()
  })

  test('should display conversation metadata', async ({ page }) => {
    const firstConversation = page.locator('[data-testid="conversation-item"]').first()
    await firstConversation.click()
    
    // Should show conversation details
    await expect(page.locator('text=Message Count')).toBeVisible()
    await expect(page.locator('text=Last Updated')).toBeVisible()
  })

  test('should display AI insights', async ({ page }) => {
    const firstConversation = page.locator('[data-testid="conversation-item"]').first()
    await firstConversation.click()
    
    // Should show AI insights badges
    await expect(page.locator('[data-testid="sentiment-badge"]')).toBeVisible()
    await expect(page.locator('[data-testid="urgency-badge"]')).toBeVisible()
  })

  test('should archive conversation', async ({ page }) => {
    const firstConversation = page.locator('[data-testid="conversation-item"]').first()
    await firstConversation.click()
    
    await page.click('button[aria-label="Archive conversation"]')
    
    await expect(page.locator('text=Conversation archived')).toBeVisible()
  })

  test('should resolve conversation', async ({ page }) => {
    const firstConversation = page.locator('[data-testid="conversation-item"]').first()
    await firstConversation.click()
    
    await page.click('button[aria-label="Resolve conversation"]')
    
    await expect(page.locator('text=Conversation resolved')).toBeVisible()
  })

  test('should handle multiline messages with Shift+Enter', async ({ page }) => {
    await page.click('button:has-text("New Chat")')
    
    const textarea = page.locator('textarea[placeholder*="Type your message"]')
    await textarea.fill('Line 1')
    await page.keyboard.press('Shift+Enter')
    await textarea.type('Line 2')
    
    // Should not send the message
    await expect(page.locator('text=Line 1')).not.toBeVisible()
    
    // Should have multiline content
    const content = await textarea.inputValue()
    expect(content).toContain('Line 1')
    expect(content).toContain('Line 2')
  })

  test('should disable input while sending', async ({ page }) => {
    await page.click('button:has-text("New Chat")')
    
    const textarea = page.locator('textarea[placeholder*="Type your message"]')
    await textarea.fill('Test message')
    await page.keyboard.press('Enter')
    
    // Input should be disabled while sending
    await expect(textarea).toBeDisabled()
    
    // Should be enabled after response
    await expect(textarea).toBeEnabled({ timeout: 10000 })
  })

  test('should auto-scroll to latest message', async ({ page }) => {
    await page.click('button:has-text("New Chat")')
    
    // Send multiple messages
    for (let i = 1; i <= 5; i++) {
      const textarea = page.locator('textarea[placeholder*="Type your message"]')
      await textarea.fill(`Message ${i}`)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(1000)
    }
    
    // Last message should be visible
    await expect(page.locator('text=Message 5')).toBeInViewport()
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Simulate network error by going offline
    await page.context().setOffline(true)
    
    await page.click('button:has-text("New Chat")')
    
    const textarea = page.locator('textarea[placeholder*="Type your message"]')
    await textarea.fill('Test message')
    await page.keyboard.press('Enter')
    
    // Should show error message
    await expect(page.locator('text=Failed to send message')).toBeVisible()
  })
})
