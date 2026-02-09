# AccessFlow SDK Quick Reference

## Basic Usage

### 1. Initialize SDK

```javascript
import { AccessFlowSDK } from "@acsbe/accessflow-sdk";

// Initialize with API key (optional if using env var)
AccessFlowSDK.init({ apiKey: "your-api-key" });
```

### 2. Create SDK Instance

```javascript
test("accessibility test", async ({ page }, testInfo) => {
  // Pass both page and testInfo
  const sdk = new AccessFlowSDK(page, testInfo);
});
```

### 3. Run Audit

```javascript
// Navigate to page
await page.goto("https://example.com");

// Run audit
const audits = await sdk.audit();
```

### 4. Generate Report

```javascript
// Generate HTML report (attached to test results)
const summary = sdk.generateReport(audits, 'html');

// Or JSON report
const summary = sdk.generateReport(audits, 'json');

// Or just get summary (no export)
const summary = sdk.generateReport(audits);
```

## Report Structure

### Summary Object

```javascript
{
  numberOfIssuesFound: {
    extreme: 5,
    high: 2,
    medium: 3,
    low: 0
  }
}
```

### Audit Results

```javascript
{
  "https://example.com": {
    "ruleViolations": {
      "colorContrast": {
        "name": "Color Contrast",
        "severity": "medium",
        "numberOfOccurrences": 3,
        "WCAGLevel": "AA",
        "WCAGLink": "https://www.w3.org/WAI/WCAG21/quickref/...",
        "description": "Description of the issue...",
        "selectors": [".element1", ".element2"]
      }
    }
  }
}
```

## Testing Patterns

### Single Page Audit

```javascript
test("single page audit", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  
  await page.goto("/");
  const audits = await sdk.audit();
  const summary = sdk.generateReport(audits, 'html');
  
  // Assert no critical issues
  expect(summary.numberOfIssuesFound.extreme).toBe(0);
});
```

### Multiple States Audit

```javascript
test("multiple states audit", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  const results = [];
  
  // Initial state
  await page.goto("/");
  let audits = await sdk.audit();
  results.push(sdk.generateReport(audits, 'html'));
  
  // Modal open state
  await page.click('[data-testid="open-modal"]');
  audits = await sdk.audit();
  results.push(sdk.generateReport(audits, 'html'));
  
  // Compare results
  console.log(results.map(r => r.numberOfIssuesFound));
});
```

### Multi-Page Audit

```javascript
test("multi-page audit", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  const pages = ['/', '/about', '/contact'];
  
  for (const route of pages) {
    await page.goto(route);
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'html');
    
    console.log(`${route}: ${JSON.stringify(summary.numberOfIssuesFound)}`);
  }
});
```

## Configuration

### Thresholds (accessflow.config.json)

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

- **extreme**: Maximum extreme severity issues allowed
- **high**: Maximum high severity issues allowed
- **medium**: Maximum medium severity issues allowed
- **low**: Maximum low severity issues allowed
- **localCheck**: Enable/disable threshold checking locally

### Playwright Config

```javascript
export default defineConfig({
  // Required: Global teardown for report generation
  globalTeardown: '@acsbe/accessflow-sdk/dist/src/playwright/global-teardown',
  
  // Output directory for reports
  outputDir: './test-results',
});
```

## Environment Variables

```bash
# API Key (required)
ACCESSFLOW_SDK_API_KEY=your-api-key-here
```

## API Reference

### AccessFlowSDK.init(config)

Initialize SDK with configuration.

```javascript
AccessFlowSDK.init({ 
  apiKey: 'xxx-xxx-xxx' 
});
```

### new AccessFlowSDK(page, testInfo)

Create new SDK instance.

- **page** (required): Playwright Page object
- **testInfo** (optional): Playwright TestInfo object (enables report attachment)

### sdk.audit()

Run accessibility audit on current page.

**Returns**: Promise<IAudits> - Raw audit results

```javascript
const audits = await sdk.audit();
```

### sdk.generateReport(auditorResults, exportType)

Generate report from audit results.

- **auditorResults** (required): Results from `sdk.audit()`
- **exportType** (optional): `'html'` | `'json'` | undefined

**Returns**: AuditReport - Summary object with issue counts

```javascript
const summary = sdk.generateReport(audits, 'html');
```

## Severity Levels

| Level | Description | WCAG Impact |
|-------|-------------|-------------|
| **extreme** | Critical accessibility barriers | Prevents access for many users |
| **high** | Serious issues | Significant difficulty for users |
| **medium** | Moderate issues | Some difficulty for users |
| **low** | Minor issues | Minimal impact on users |

## WCAG Levels

- **Level A**: Minimum accessibility requirements
- **Level AA**: Recommended target for most sites (mid-level)
- **Level AAA**: Enhanced accessibility (highest level)

## Common Audit Rules

| Rule | Severity | WCAG Level | Description |
|------|----------|------------|-------------|
| Color Contrast | medium | AA | Text contrast ratio requirements |
| Navigation Tagging | high | A | Proper landmark elements |
| Fake Hidden Interactive | extreme | A | Hidden focusable elements |
| Image Alt Text | high | A | Images must have alt attributes |
| Form Labels | high | A | Form inputs must have labels |
| Heading Structure | medium | A | Proper heading hierarchy |

## Debugging

### View Console Logs

```javascript
test("debug audit", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  
  await page.goto("/");
  const audits = await sdk.audit();
  
  // Log full audit results
  console.log(JSON.stringify(audits, null, 2));
  
  const summary = sdk.generateReport(audits, 'html');
  console.log("Issues:", summary.numberOfIssuesFound);
});
```

### View Reports

```bash
# Open Playwright HTML report
npx playwright show-report

# List generated reports
ls -la test-results/
```

### Troubleshoot CSP Issues

If auditor script is blocked:

```javascript
test("bypass CSP", async ({ page, context }, testInfo) => {
  // Set bypass CSP context option
  const context = await browser.newContext({ 
    bypassCSP: true 
  });
  const page = await context.newPage();
  
  const sdk = new AccessFlowSDK(page, testInfo);
  // ... rest of test
});
```

## Best Practices

### ✅ DO

- Always pass `testInfo` to SDK constructor
- Generate reports after each audit
- Use descriptive context labels for multi-state tests
- Store API key in environment variables
- Test multiple page states (modals, dropdowns, etc.)
- Log issue summaries for quick debugging

### ❌ DON'T

- Don't commit API keys to version control
- Don't skip `testInfo` parameter (reports won't attach)
- Don't forget to call `generateReport()` after `audit()`
- Don't set unrealistic thresholds (start conservative)
- Don't test only one page state
- Don't ignore CSP issues in your application

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run accessibility tests
  env:
    ACCESSFLOW_SDK_API_KEY: ${{ secrets.ACCESSFLOW_SDK_API_KEY }}
  run: npm test
```

### CircleCI

```yaml
- run:
    name: Run accessibility tests
    command: npm test
    environment:
      ACCESSFLOW_SDK_API_KEY: ${ACCESSFLOW_SDK_API_KEY}
```

## Support

- **Documentation**: See ACCESSFLOW-SETUP.md
- **Test Example**: See tests/graphics-audit.spec.js
- **Playwright Docs**: https://playwright.dev
