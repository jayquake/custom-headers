# AccessFlow Accessibility Tests

This directory contains Playwright tests that use the AccessFlow SDK to perform automated accessibility audits.

## Test Files

### `graphics-audit.spec.js`

Comprehensive accessibility audit test that covers multiple UI states on the graphics/background-images page:

**States Tested:**
1. Initial Failure Page load
2. Notifications Modal open
3. Sidebar collapsed
4. Sidebar expanded
5. Success Page

**What it tests:**
- WCAG compliance issues
- Color contrast problems
- Navigation tagging
- Hidden interactive elements
- Image alt text
- Form labels
- Heading structure
- And more...

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npx playwright test tests/graphics-audit.spec.js
```

### With UI Mode (Interactive)
```bash
npm run test:ui
```

### Watch Specific Test
```bash
npx playwright test tests/graphics-audit.spec.js --ui
```

### In Headed Mode (See Browser)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### Specific Browser
```bash
npx playwright test --project=chromium
```

## Test Structure

### Basic Pattern

```javascript
test("test name", async ({ page }, testInfo) => {
  // 1. Create SDK instance
  const sdk = new AccessFlowSDK(page, testInfo);
  
  // 2. Navigate to page
  await page.goto("/your-page");
  
  // 3. Run audit
  const audits = await sdk.audit();
  
  // 4. Generate report
  const summary = sdk.generateReport(audits, 'html');
  
  // 5. Log or assert results
  console.log("Issues:", summary.numberOfIssuesFound);
  expect(summary.numberOfIssuesFound.extreme).toBe(0);
});
```

### Multi-State Pattern

```javascript
test("multi-state audit", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  const results = [];
  
  // Helper function
  const performAudit = async (context) => {
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'html');
    results.push({ context, summary });
    console.log(`${context}:`, summary.numberOfIssuesFound);
  };
  
  // Test different states
  await page.goto("/");
  await performAudit("Initial Load");
  
  await page.click("#open-modal");
  await performAudit("Modal Open");
  
  // Compare results
  console.log(results);
});
```

## Understanding Test Results

### Console Output

Tests log issue summaries to console:

```
Starting audit for context: Initial Failure Page
Audit completed for Initial Failure Page
Issues found: { extreme: 5, high: 2, medium: 3, low: 0 }
```

### HTML Reports

Generated in `test-results/` directory:
- One report per audit
- Includes all violation details
- WCAG references and selectors
- Open with: `npx playwright show-report`

### JSON Structure

```javascript
summary.numberOfIssuesFound = {
  extreme: 5,  // Critical issues
  high: 2,     // Serious issues
  medium: 3,   // Moderate issues
  low: 0       // Minor issues
}
```

## Adding New Tests

### 1. Create Test File

Create a new file in this directory:

```javascript
// tests/my-page-audit.spec.js
import { AccessFlowSDK } from "@acsbe/accessflow-sdk";
import { test, expect } from "@playwright/test";

// Initialize SDK
AccessFlowSDK.init({ apiKey: process.env.ACCESSFLOW_SDK_API_KEY });

test.describe("My Page Audits", () => {
  test("audit home page", async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    
    await page.goto("/");
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'html');
    
    console.log("Home page issues:", summary.numberOfIssuesFound);
    
    // Assert no critical issues
    expect(summary.numberOfIssuesFound.extreme).toBe(0);
  });
});
```

### 2. Run New Test

```bash
npx playwright test tests/my-page-audit.spec.js
```

## Test Best Practices

### ✅ DO

- Always pass `testInfo` to SDK constructor
- Generate reports after each audit
- Use descriptive context labels
- Test multiple page states (modals, dropdowns, sidebars)
- Log issue summaries for debugging
- Assert on critical issues (extreme/high)
- Wait for page to be fully loaded before auditing

### ❌ DON'T

- Don't skip `testInfo` parameter
- Don't forget to call `generateReport()`
- Don't test only happy paths
- Don't ignore CSP issues
- Don't commit API keys
- Don't audit before page is loaded

## Common Patterns

### Test Form Pages

```javascript
test("form accessibility", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  
  await page.goto("/contact");
  
  // Initial state
  const audits1 = await sdk.audit();
  sdk.generateReport(audits1, 'html');
  
  // Fill form and check again
  await page.fill("#name", "Test");
  await page.fill("#email", "test@example.com");
  
  const audits2 = await sdk.audit();
  sdk.generateReport(audits2, 'html');
});
```

### Test Navigation

```javascript
test("navigation accessibility", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  const pages = ['/', '/about', '/contact', '/services'];
  
  for (const route of pages) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'html');
    
    console.log(`${route}:`, summary.numberOfIssuesFound);
  }
});
```

### Test Interactive Elements

```javascript
test("interactive elements", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  
  await page.goto("/");
  
  // Test dropdown
  await page.click("#menu-button");
  await sdk.audit().then(r => sdk.generateReport(r, 'html'));
  
  // Test tabs
  await page.click("#tab-2");
  await sdk.audit().then(r => sdk.generateReport(r, 'html'));
  
  // Test accordion
  await page.click("#accordion-item-1");
  await sdk.audit().then(r => sdk.generateReport(r, 'html'));
});
```

## Debugging Tests

### Enable Verbose Logging

```javascript
test("debug audit", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  
  await page.goto("/");
  
  // Log full audit results
  const audits = await sdk.audit();
  console.log(JSON.stringify(audits, null, 2));
  
  const summary = sdk.generateReport(audits, 'html');
  console.log("Summary:", summary);
});
```

### Use Playwright Inspector

```bash
npx playwright test --debug
```

### Pause in Test

```javascript
test("pause test", async ({ page }, testInfo) => {
  await page.goto("/");
  
  // Pause here
  await page.pause();
  
  // Continue with audit...
});
```

## Configuration

Tests use configuration from:

- `playwright.config.js` - Test runner settings
- `accessflow.config.json` - Threshold limits
- `.env` - API key (if using environment variable)

## Threshold Configuration

Edit `../accessflow.config.json`:

```json
{
  "issuesFoundThreshold": {
    "extreme": 0,
    "high": 5,
    "medium": 10,
    "low": 20
  },
  "localCheck": true
}
```

Tests will fail if issues exceed these thresholds (when `localCheck: true`).

## CI/CD Integration

Tests automatically detect CI environments:
- GitHub Actions
- CircleCI
- Jenkins
- GitLab CI
- Azure Pipelines
- Bitbucket Pipelines
- Bamboo

In CI:
- Results are aggregated
- Summary report generated
- Report uploaded to AccessFlow dashboard

## Viewing Reports

### Open HTML Report
```bash
npx playwright show-report
```

### List Reports
```bash
ls -la test-results/
```

### View Specific Report
```bash
open test-results/graphics-audit-test-name/report.html
```

## Troubleshooting

### Tests Timing Out

Increase timeout in test:
```javascript
test("slow test", async ({ page }, testInfo) => {
  test.setTimeout(60000); // 60 seconds
  // ... rest of test
});
```

### CSP Blocking Auditor

Add to test setup:
```javascript
test.use({ 
  bypassCSP: true 
});
```

### Reports Not Generating

Verify:
1. `testInfo` is passed to SDK constructor
2. `generateReport()` is called
3. `globalTeardown` is in `playwright.config.js`

## Additional Resources

- **Main Documentation**: `../ACCESSFLOW-SETUP.md`
- **API Reference**: `../ACCESSFLOW-QUICKREF.md`
- **Setup Guide**: `../SETUP-CHECKLIST.md`
- **Playwright Docs**: https://playwright.dev
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

## Questions?

See the main documentation in the project root or contact your team lead.
