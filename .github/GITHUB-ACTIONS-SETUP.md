# GitHub Actions Setup Guide

Complete guide to setting up and using the GitHub Actions workflows for accessibility testing.

## 📋 Table of Contents

- [Workflows Overview](#workflows-overview)
- [Setup Instructions](#setup-instructions)
- [Workflow Details](#workflow-details)
- [Adding Secrets](#adding-secrets)
- [Viewing Results](#viewing-results)
- [Status Badges](#status-badges)
- [Troubleshooting](#troubleshooting)

## 🔄 Workflows Overview

### 1. `accessibility-tests.yml`
**Main accessibility testing workflow**

**Triggers:**
- ✅ Push to `main` or `develop` branches
- ✅ Pull requests to `main` or `develop` branches
- ✅ Manual trigger from GitHub UI

**Features:**
- Runs all accessibility tests
- Uploads test results as artifacts
- Comments on PRs with results summary
- Integrates with AccessFlow dashboard

### 2. `scheduled-audit.yml`
**Daily scheduled accessibility audits**

**Triggers:**
- ✅ Daily at 2 AM UTC (cron schedule)
- ✅ Manual trigger from GitHub UI

**Features:**
- Runs comprehensive accessibility audit
- Creates GitHub issue on failure
- Retains results for 90 days
- Monitors accessibility over time

## 🚀 Setup Instructions

### Step 1: Add Repository Secret

1. **Go to your GitHub repository**
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add secret:
   - **Name:** `ACCESSFLOW_SDK_API_KEY`
   - **Value:** Your AccessFlow API key (e.g., `flow-1roexmm1vA4hOaYnisQ000or0rx7xtYID0`)
5. Click **Add secret**

### Step 2: Commit Workflow Files

The workflow files are already created:
```
.github/
└── workflows/
    ├── accessibility-tests.yml
    └── scheduled-audit.yml
```

Commit and push them:
```bash
git add .github/workflows/
git commit -m "Add GitHub Actions workflows for accessibility testing"
git push origin main
```

### Step 3: Enable Actions (if needed)

1. Go to **Settings** → **Actions** → **General**
2. Under **Actions permissions**, select:
   - ✅ "Allow all actions and reusable workflows"
3. Under **Workflow permissions**, select:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"
4. Click **Save**

### Step 4: Verify Setup

1. Go to **Actions** tab in your repository
2. You should see the workflows listed:
   - "Accessibility Tests"
   - "Scheduled Accessibility Audit"
3. Click "Run workflow" on any workflow to test manually

## 📊 Workflow Details

### Accessibility Tests Workflow

```yaml
name: Accessibility Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:
```

**What it does:**

1. **Checkout code** - Gets your repository code
2. **Setup Node.js 18** - Installs Node.js with npm caching
3. **Install dependencies** - Runs `npm install`
4. **Install AccessFlow SDK** - Installs the local SDK package
5. **Install Playwright** - Installs Chromium browser
6. **Run tests** - Executes `npm test` with API key
7. **Upload artifacts** - Saves test results and reports
8. **Comment on PR** - Adds comment to pull requests with results

**Outputs:**
- Test results in `test-results/`
- HTML report in `playwright-report/`
- Automatic upload to AccessFlow dashboard (in CI mode)

### Scheduled Audit Workflow

```yaml
name: Scheduled Accessibility Audit
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:
```

**What it does:**

1. Runs full accessibility audit daily
2. Uploads results with 90-day retention
3. Creates GitHub issue if tests fail
4. Tracks accessibility trends over time

**Issue Labels:**
- `accessibility`
- `automated-test`
- `needs-review`

## 🔐 Adding Secrets

### Required Secret

**`ACCESSFLOW_SDK_API_KEY`** (Required)
- Your AccessFlow API key
- Get from: https://app.accessflow.com/settings/api-keys
- Scope needed: "CICD SDK"

### How to Add

#### Via GitHub UI:
1. Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `ACCESSFLOW_SDK_API_KEY`
4. Value: Your API key
5. Click "Add secret"

#### Via GitHub CLI:
```bash
gh secret set ACCESSFLOW_SDK_API_KEY
# Paste your API key when prompted
```

### Optional Secrets

If you need to test against a protected environment:

**`SIGNATURE_INPUT`**, **`SIGNATURE`**, **`SIGNATURE_AGENT`**
- Custom headers for your worker validation
- Add same way as API key

## 📈 Viewing Results

### Test Results in Actions

1. Go to **Actions** tab
2. Click on a workflow run
3. Click on the job name
4. View console output for test results

### Downloading Artifacts

1. Go to **Actions** tab
2. Click on a workflow run
3. Scroll to **Artifacts** section at bottom
4. Download:
   - `playwright-report` - HTML report
   - `playwright-html-report` - Additional reports
5. Unzip and open `index.html`

### Viewing in AccessFlow Dashboard

When tests run in CI:
1. Results automatically upload to AccessFlow
2. Go to: https://app.accessflow.com
3. View your project dashboard
4. See trends, issues, and historical data

### Pull Request Comments

On pull requests, the workflow automatically comments with:
- ✅ Test completion status
- 📊 Available reports
- 💡 Instructions to download artifacts

## 🎯 Status Badges

Add status badges to your README to show test status.

### Accessibility Tests Badge

```markdown
![Accessibility Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/accessibility-tests.yml/badge.svg)
```

### Scheduled Audit Badge

```markdown
![Scheduled Audit](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/scheduled-audit.yml/badge.svg)
```

### Example

Replace `YOUR_USERNAME` and `YOUR_REPO`:

```markdown
# Custom Headers Testing Tool

![Accessibility Tests](https://github.com/jayquake/custom-headers/actions/workflows/accessibility-tests.yml/badge.svg)
![Scheduled Audit](https://github.com/jayquake/custom-headers/actions/workflows/scheduled-audit.yml/badge.svg)

A testing tool for validating HTTP header requirements...
```

## 🔧 Customization

### Change Schedule

Edit `scheduled-audit.yml`:

```yaml
on:
  schedule:
    # Run every Monday at 9 AM
    - cron: '0 9 * * 1'
```

**Cron Examples:**
- `0 * * * *` - Every hour
- `0 0 * * *` - Daily at midnight
- `0 9 * * 1-5` - Weekdays at 9 AM
- `0 0 1 * *` - First day of month

Use: https://crontab.guru/ to generate cron expressions

### Change Node.js Version

Edit workflow file:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change to desired version
```

### Add More Browsers

Edit workflow file:

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium firefox webkit
```

Then update `playwright.config.js` to use multiple projects.

### Change Branches

Edit trigger branches:

```yaml
on:
  push:
    branches:
      - main
      - staging
      - production
```

### Add Slack Notifications

Add step to workflow:

```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "❌ Accessibility tests failed on ${{ github.ref }}"
      }
```

Add `SLACK_WEBHOOK_URL` to repository secrets.

## 🛠️ Troubleshooting

### Issue: Workflow doesn't trigger

**Check:**
- [ ] Workflow file is in `.github/workflows/` directory
- [ ] YAML syntax is valid (use yamllint)
- [ ] Branch names match trigger configuration
- [ ] Actions are enabled in repository settings

### Issue: Secret not found

**Solution:**
1. Verify secret name is exactly `ACCESSFLOW_SDK_API_KEY`
2. Check secret is added at repository level (not organization)
3. Re-add secret if needed
4. Check spelling in workflow file

### Issue: npm install fails

**Solution:**
Add to workflow before install:
```yaml
- name: Clean install
  run: |
    rm -rf node_modules package-lock.json
    npm install
```

### Issue: Playwright browsers fail to install

**Solution:**
Use the `--with-deps` flag:
```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium
```

This installs system dependencies needed for browsers.

### Issue: Tests timeout

**Solution:**
Increase timeout in `playwright.config.js`:
```javascript
export default defineConfig({
  timeout: 60 * 1000,  // 60 seconds
  // ...
});
```

### Issue: SDK not found

**Solution:**
Verify the SDK file exists:
```yaml
- name: Verify SDK file
  run: ls -la acsbe-accessflow-sdk-1.0.1.tgz

- name: Install AccessFlow SDK
  run: npm install ./acsbe-accessflow-sdk-1.0.1.tgz
```

### Issue: Reports not uploading to AccessFlow

**Check:**
1. API key is correct
2. API key has "CICD SDK" scope
3. Tests are running in CI environment (GitHub Actions)
4. Check workflow logs for upload errors

### Issue: Artifacts not available

**Solution:**
Verify paths in upload step:
```yaml
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      test-results/
      playwright-report/
    retention-days: 30
```

## 📊 Monitoring & Analytics

### View Workflow Runs

1. Go to **Actions** tab
2. Filter by:
   - Workflow name
   - Branch
   - Status (success/failure)
   - Date range

### Insights

1. Go to **Insights** → **Actions**
2. View:
   - Workflow run times
   - Success/failure rates
   - Billing (for private repos)

### AccessFlow Dashboard

1. Visit: https://app.accessflow.com
2. View:
   - Accessibility trends over time
   - Issue breakdown by severity
   - Historical comparisons
   - CI/CD metadata (branch, commit, etc.)

## 🎓 Best Practices

### ✅ DO

- Use secrets for sensitive data
- Set appropriate artifact retention (30-90 days)
- Add status badges to README
- Monitor workflow run times
- Review failed runs promptly
- Keep workflows up to date

### ❌ DON'T

- Don't commit API keys to code
- Don't run on every commit (use branch filters)
- Don't ignore failed scheduled audits
- Don't set overly aggressive schedules
- Don't skip artifact uploads

## 📝 Workflow Files Reference

### Location
```
.github/
└── workflows/
    ├── accessibility-tests.yml      # Main tests (PR/push)
    └── scheduled-audit.yml          # Daily audits
```

### Key Components

**Triggers:**
- `push` - On code push
- `pull_request` - On PR creation/update
- `schedule` - Cron-based timing
- `workflow_dispatch` - Manual trigger

**Steps:**
- Checkout code
- Setup environment
- Install dependencies
- Run tests
- Upload artifacts
- Notify/comment

## 🔗 Useful Links

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Workflow Syntax**: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- **AccessFlow Dashboard**: https://app.accessflow.com
- **Playwright CI**: https://playwright.dev/docs/ci
- **Cron Expression Generator**: https://crontab.guru/

## 🆘 Getting Help

If you encounter issues:

1. Check workflow logs in Actions tab
2. Review this guide's troubleshooting section
3. Check GitHub Actions documentation
4. Review AccessFlow SDK documentation
5. Open an issue in this repository

## 🎉 Success Checklist

Your GitHub Actions setup is successful when:

- ✅ Workflows appear in Actions tab
- ✅ Tests run on push/PR
- ✅ Artifacts are uploaded
- ✅ Results appear in AccessFlow dashboard
- ✅ PR comments are added automatically
- ✅ Scheduled audits run daily
- ✅ Status badges work in README

---

**You're all set!** Your accessibility tests will now run automatically on every push and pull request. 🚀
