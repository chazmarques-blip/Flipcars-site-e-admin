# Testing Documentation

## Overview

This document provides comprehensive information about the testing infrastructure and best practices for FlipCars 2.0 Admin Frontend.

## Testing Stack

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **TypeScript**: Type-safe test development

## Test Structure

```
frontend-admin/
├── src/
│   └── __tests__/
│       ├── utils/           # Utility function tests
│       ├── lib/             # Library and service tests
│       └── components/      # React component tests
├── e2e/                     # End-to-end tests
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Jest setup and mocks
└── playwright.config.ts     # Playwright configuration
```

## Running Tests

### Unit and Component Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- format.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="formatCurrency"
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode (interactive)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test auth.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium
```

### Run All Tests

```bash
# Run unit, component, and E2E tests
npm run test:all
```

## Test Categories

### 1. Unit Tests (`src/__tests__/utils/`)

Test individual functions and utilities in isolation.

**Example**: `format.test.ts`
```typescript
describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00')
  })
})
```

**Coverage Areas**:
- Format utilities (currency, dates, phone numbers)
- Validation utilities (email, phone, VIN, passwords)
- Helper functions
- Data transformations

### 2. Component Tests (`src/__tests__/components/`)

Test React components rendering, props, and interactions.

**Example**: `Button.test.tsx`
```typescript
describe('Button Component', () => {
  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

**Coverage Areas**:
- UI components (Button, Card, Input, Modal)
- Form components
- Layout components
- Custom hooks

### 3. Integration Tests (`src/__tests__/lib/`)

Test API services and state management.

**Example**: `auth.service.test.ts`
```typescript
describe('AuthService', () => {
  it('should login successfully', async () => {
    const result = await authService.login('user@example.com', 'password')
    expect(result.token).toBeDefined()
  })
})
```

**Coverage Areas**:
- API service methods
- Zustand store actions
- Error handling
- Token management

### 4. End-to-End Tests (`e2e/`)

Test complete user workflows in a real browser.

**Example**: `auth.spec.ts`
```typescript
test('should successfully login with valid credentials', async ({ page }) => {
  await page.fill('input[name="email"]', 'admin@flipcars.com')
  await page.fill('input[name="password"]', 'Admin123!')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL(/.*dashboard/)
})
```

**Coverage Areas**:
- Authentication flow
- Dashboard navigation
- CRUD operations (Leads, Customers, Claims)
- AI Chat functionality
- Form submissions
- Error scenarios

## Test Configuration

### Jest Configuration (`jest.config.js`)

- Uses Next.js Jest preset
- Configures path aliases (`@/`)
- Sets up jsdom environment
- Excludes E2E tests from unit test runs

### Jest Setup (`jest.setup.js`)

Provides global mocks:
- `localStorage`
- `matchMedia`
- `IntersectionObserver`
- Environment variables

### Playwright Configuration (`playwright.config.ts`)

- Tests across Chromium, Firefox, WebKit
- Mobile viewports (Pixel 5, iPhone 12)
- Automatic dev server startup
- Screenshots on failure
- Trace on retry

## Writing Tests

### Best Practices

1. **Use descriptive test names**
   ```typescript
   it('should display error when email is invalid', () => {})
   ```

2. **Arrange-Act-Assert pattern**
   ```typescript
   it('should format currency correctly', () => {
     // Arrange
     const amount = 1000
     
     // Act
     const result = formatCurrency(amount)
     
     // Assert
     expect(result).toBe('$1,000.00')
   })
   ```

3. **Test user behavior, not implementation**
   ```typescript
   // Good ✅
   it('should show error message when form is invalid', () => {
     render(<LoginForm />)
     fireEvent.click(screen.getByText('Submit'))
     expect(screen.getByText('Email is required')).toBeInTheDocument()
   })
   
   // Bad ❌
   it('should set error state to true', () => {
     const { result } = renderHook(() => useForm())
     result.current.submit()
     expect(result.current.errors).toBeTruthy()
   })
   ```

4. **Use data-testid sparingly**
   - Prefer accessible queries: `getByRole`, `getByLabelText`, `getByText`
   - Use `data-testid` only when necessary

5. **Mock external dependencies**
   ```typescript
   jest.mock('@/lib/api/auth.service', () => ({
     login: jest.fn().mockResolvedValue({ token: 'abc123' })
   }))
   ```

### Component Testing Guidelines

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

### E2E Testing Guidelines

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login, navigate, etc.
    await page.goto('/login')
  })
  
  test('should perform user action', async ({ page }) => {
    // Navigate and interact
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    
    // Assert expected outcome
    await expect(page).toHaveURL(/.*success/)
  })
})
```

## Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Component Tests**: All UI components tested
- **Integration Tests**: Critical user paths covered
- **E2E Tests**: Happy paths + key error scenarios

## Continuous Integration

Tests are run automatically on:
- Pull request creation
- Push to main branch
- Scheduled nightly runs

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
```

## Debugging Tests

### Jest

```bash
# Run in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Use VS Code debugger
# Add breakpoint in test, press F5
```

### Playwright

```bash
# Run with headed browser
npm run test:e2e:headed

# Run with UI mode (step through tests)
npm run test:e2e:ui

# Generate trace viewer
npx playwright test --trace on
npx playwright show-report
```

## Common Issues

### Issue: Tests fail with "Cannot find module"
**Solution**: Check path aliases in `jest.config.js` and `tsconfig.json`

### Issue: Component tests timeout
**Solution**: Use `waitFor` for async operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### Issue: E2E tests fail to start dev server
**Solution**: Ensure dev server port is not in use, check `playwright.config.ts`

### Issue: Mock localStorage not working
**Solution**: Verify `jest.setup.js` is loaded, check `setupFilesAfterEnv` in config

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass before committing
3. Maintain or improve code coverage
4. Update this documentation if adding new test patterns
