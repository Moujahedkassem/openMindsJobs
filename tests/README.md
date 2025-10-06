# Playwright Tests

This directory contains automated tests for the OpenMindsAI application using Playwright.

## Test Files

- **`setup.spec.ts`** - Basic setup verification and page loading tests
- **`buttons.spec.ts`** - Tests all buttons and clickable elements for functionality
- **`navigation.spec.ts`** - Tests all navigation links for validity and functionality

## Running Tests

### Prerequisites
- Make sure the development server is running: `npm run dev`
- Ensure Playwright is installed: `npm install -D @playwright/test`

### Run All Tests
```bash
npm run test
```

### Run Specific Test Files
```bash
# Run only setup tests
npx playwright test setup.spec.ts

# Run only button tests
npx playwright test buttons.spec.ts

# Run only navigation tests
npx playwright test navigation.spec.ts
```

### Run Tests in Different Viewports
The tests automatically run in both desktop and mobile viewports:
- **Desktop**: 1280x800 (Chrome)
- **Mobile**: 375x667 (iPhone 12)

### Run Tests with UI
```bash
npx playwright test --ui
```

### Run Tests in Headed Mode
```bash
npx playwright test --headed
```

## Test Coverage

### Setup Tests
- ✅ Verifies homepage loads correctly
- ✅ Checks for navigation elements
- ✅ Tests viewport responsiveness

### Button Tests
- ✅ Tests all `<button>` elements
- ✅ Tests all clickable `<a>` elements
- ✅ Tests elements with `role="button"`
- ✅ Tests elements with `tabindex="0"`
- ✅ Verifies navigation and content changes
- ✅ Reports non-functional buttons

### Navigation Tests
- ✅ Tests navbar links
- ✅ Tests footer links
- ✅ Tests logo navigation
- ✅ Tests mobile navigation
- ✅ Verifies page loading (no 404s)
- ✅ Reports broken links

## Test Output

Tests provide detailed console output including:
- 🔍 Number of elements found
- ✅ Working elements with details
- ⚠️ Non-functional elements
- ❌ Broken links/errors
- 📊 Summary statistics

## Configuration

The tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:5173`
- Web server: Automatically starts `npm run dev`
- Screenshots: On failure
- Traces: On first retry
- HTML reporter enabled

## Troubleshooting

### Common Issues

1. **Port 5173 not available**: Make sure no other dev server is running
2. **Tests fail to start**: Ensure `npm run dev` works manually first
3. **Navigation timeouts**: Increase timeout in config if needed

### Debug Mode
```bash
# Run with debug logging
DEBUG=pw:api npx playwright test

# Run single test with debug
npx playwright test --debug
```

## Adding New Tests

1. Create new `.spec.ts` files in the `tests/` directory
2. Follow the existing test structure
3. Use descriptive test names
4. Include proper error handling
5. Add to the appropriate test suite

## CI/CD Integration

Tests are configured to run in CI environments:
- Retries: 2 attempts in CI
- Workers: 1 in CI for stability
- Screenshots and traces for debugging
