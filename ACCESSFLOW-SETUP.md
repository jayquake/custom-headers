# AccessFlow SDK Integration Guide

This guide covers the integration of the AccessFlow Playwright SDK for automated accessibility testing in this project.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Understanding Reports](#understanding-reports)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Installation

### 1. Install Dependencies

First, install the project dependencies:

```bash
npm install
```

### 2. Install the AccessFlow SDK

The SDK is provided as a local package (`acsbe-accessflow-sdk-1.0.1.tgz`). Install it:

```bash
npm install ./acsbe-accessflow-sdk-1.0.1.tgz
```

This will add the SDK to your `node_modules` and update your `package.json`.

### 3. Verify Installation

Check that the SDK is installed correctly:

```bash
npm list @acsbe/accessflow-sdk
```

You should see: `@acsbe/accessflow-sdk@1.0.1`

## Configuration

### 1. API Key Setup

The AccessFlow SDK requires an API key. You have two options:

**Option A: Environment Variable (Recommended)**

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your API key:

```
ACCESSFLOW_SDK_API_KEY=your-actual-api-key-here
```

**Option B: Programmatic Initialization**

The test file already includes initialization:

```javascript
AccessFlowSDK.init({ apiKey: "flow-1roexmm1vA4hOaYnisQ000or0rx7xtYID0" });
```

Note: For security, it's better to use environment variables in CI/CD environments.

### 2. Threshold Configuration

The `accessflow.config.json` file defines thresholds for accessibility issues:

```json
{
  "issuesFoundThreshold": {
    "extreme": 0,    // No extreme issues allowed
    "high": 5,       // Max 5 high severity issues
    "medium": 10,    // Max 10 medium severity issues
    "low": 20        // Max 20 low severity issues
  },
  "localCheck": true  // Enable threshold checking locally
}
```

**Customization:**
- Set thresholds based on your project's accessibility goals
- Set `localCheck: false` to disable local threshold checking (monitoring only)
- Thresholds are always included in reports regardless of `localCheck` setting

### 3. Playwright Configuration

The `playwright.config.js` includes:

- **Global Teardown**: Automatically generates summary reports after all tests
- **Output Directory**: `./test-results` for all test artifacts
- **Reporters**: HTML and list reporters for detailed results
- **Browser Configuration**: Chromium by default (uncomment for Firefox/WebKit)

## Running Tests

### Local Development

**Run all tests:**
```bash
npm test
```

**Run with UI mode (interactive):**
```bash
npm run test:ui
```

**Run in headed mode (see browser):**
```bash
npm run test:headed
```

**Debug mode:**
```bash
npm run test:debug
```

### Test Workflow

When tests run locally:

1. ✅ Each test performs audits using `sdk.audit()`
2. ✅ Reports are generated with `sdk.generateReport(audits, 'html')`
3. ✅ HTML reports are attached to test results in `test-results/`
4. ✅ Individual test reports are generated per test
5. ❌ No final summary report (local mode)
6. ❌ No automatic upload to AccessFlow dashboard

### CI/CD Workflow

When tests run in CI environments (GitHub Actions, CircleCI, Jenkins, etc.):

1. ✅ Individual audits are performed
2. ✅ Results are aggregated across all test workers
3. ✅ Final summary report is generated with CI metadata
4. ✅ Report is automatically uploaded to AccessFlow dashboard
5. ✅ Thresholds are checked (if configured)
6. ✅ Build fails if thresholds are exceeded

## Understanding Reports

### HTML Reports

HTML reports are generated for each audit and saved to `test-results/`. They include:

- **Rule Violations**: Grouped by rule type with severity levels
- **Number of Occurrences**: Count of each violation type
- **WCAG References**: Links to WCAG guidelines
- **CSS Selectors**: Specific elements with issues
- **Severity Breakdown**: Count by extreme/high/medium/low

### JSON Reports

JSON reports provide programmatic access to audit data:

```json
{
  "https://example.com": {
    "ruleViolations": {
      "colorContrast": {
        "name": "Color Contrast",
        "severity": "medium",
        "numberOfOccurrences": 3,
        "WCAGLevel": "AA",
        "WCAGLink": "https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=143#contrast-minimum",
        "description": "The color contrast ratio...",
        "selectors": [".header .logo", ".sidebar .menu-item"]
      }
    },
    "numberOfIssuesFound": {
      "extreme": 5,
      "high": 2,
      "medium": 3,
      "low": 0
    }
  }
}
```

### Viewing Reports

After running tests:

```bash
# Open Playwright HTML report
npx playwright show-report

# View test results directory
ls -la test-results/
```

## CI/CD Integration

### Supported Platforms

The SDK automatically detects and integrates with:

- ✅ GitHub Actions
- ✅ GitLab CI
- ✅ CircleCI
- ✅ Jenkins
- ✅ Azure Pipelines
- ✅ Bitbucket Pipelines
- ✅ Atlassian Bamboo

### GitHub Actions Example

Create `.github/workflows/accessibility-tests.yml`:

```yaml
name: Accessibility Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        npm install
        npm install ./acsbe-accessflow-sdk-1.0.1.tgz
    
    - name: Run accessibility tests
      env:
        ACCESSFLOW_SDK_API_KEY: ${{ secrets.ACCESSFLOW_SDK_API_KEY }}
      run: npm test
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: test-results/
        retention-days: 30
```

**Required Secrets:**
- Add `ACCESSFLOW_SDK_API_KEY` to your repository secrets
- Go to: Repository Settings → Secrets and variables → Actions → New repository secret

### CircleCI Example

Create `.circleci/config.yml`:

```yaml
version: 2.1

jobs:
  accessibility-tests:
    docker:
      - image: mcr.microsoft.com/playwright:v1.48.0-jammy
    
    steps:
      - checkout
      
      - run:
          name: Install dependencies
          command: |
            npm install
            npm install ./acsbe-accessflow-sdk-1.0.1.tgz
      
      - run:
          name: Run accessibility tests
          command: npm test
          environment:
            ACCESSFLOW_SDK_API_KEY: ${ACCESSFLOW_SDK_API_KEY}
      
      - store_artifacts:
          path: test-results
      
      - store_test_results:
          path: test-results

workflows:
  test:
    jobs:
      - accessibility-tests
```

## Troubleshooting

### Content Security Policy (CSP) Issues

**Problem**: Auditor script is blocked by CSP headers

**Solution**:
- For local testing, modify CSP to allow `'unsafe-inline'` scripts
- Or add the auditor script to your CSP policy: `script-src 'self' 'unsafe-inline'`

### Reports Not Uploading

**Symptoms**: No reports appear in AccessFlow dashboard

**Checklist**:
1. ✅ Verify you're running in a supported CI environment
2. ✅ Check `ACCESSFLOW_SDK_API_KEY` is set correctly
3. ✅ Ensure API key has "CICD SDK" scope permissions
4. ✅ Review console logs for error messages
5. ✅ Confirm tests are completing successfully

### Threshold Violations

**Problem**: Tests fail due to threshold violations

**Solutions**:

**Option 1: Fix accessibility issues**
```bash
# Review the report to identify issues
npx playwright show-report

# Fix the issues in your code
# Re-run tests
npm test
```

**Option 2: Adjust thresholds**
```json
// accessflow.config.json
{
  "issuesFoundThreshold": {
    "extreme": 0,
    "high": 10,    // Increased from 5
    "medium": 20,  // Increased from 10
    "low": 30      // Increased from 20
  }
}
```

**Option 3: Disable local checking**
```json
// accessflow.config.json
{
  "issuesFoundThreshold": {
    "extreme": 0,
    "high": 5,
    "medium": 10,
    "low": 20
  },
  "localCheck": false  // Monitor only, don't fail builds
}
```

### Missing Dependencies

**Problem**: Cannot find module '@acsbe/accessflow-sdk'

**Solution**:
```bash
# Re-install the SDK
npm install ./acsbe-accessflow-sdk-1.0.1.tgz

# Verify installation
npm list @acsbe/accessflow-sdk
```

### Custom Output Directory

If you've customized `outputDir` in `playwright.config.js`, the SDK will automatically use it. Verify by checking the logs during teardown.

## Best Practices

### 1. Test Multiple States

The current test demonstrates best practices by auditing:
- Initial page load
- Modal open state
- Sidebar collapsed/expanded
- Different routes (success/failure pages)

### 2. Use Descriptive Context Labels

```javascript
await performAudit("Initial Failure Page");
await performAudit("Notifications Modal Open");
await performAudit("Sidebar Collapsed");
```

This makes it easier to identify which state has issues.

### 3. Generate Reports After Each Audit

```javascript
const audits = await sdk.audit();
const summary = sdk.generateReport(audits, 'html');
```

This creates individual reports for each state, making debugging easier.

### 4. Log Issue Summaries

```javascript
console.log(`Issues found:`, summary.numberOfIssuesFound);
```

Provides quick visibility into accessibility issues during test runs.

### 5. Use Environment Variables for Secrets

Never commit API keys. Always use `.env` files or CI secrets.

## Additional Resources

- **AccessFlow Dashboard**: View detailed reports and trends
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Playwright Docs**: https://playwright.dev
- **Supported Browsers**: Chrome, Firefox, Safari (WebKit)

## Support

For issues with:
- **AccessFlow SDK**: Contact AccessFlow support
- **This integration**: Open an issue in this repository
- **Playwright**: Visit https://playwright.dev/docs/intro
