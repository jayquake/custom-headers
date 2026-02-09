# GitHub Actions Integration Summary

## ✅ What Was Created

### Workflow Files (2 files)

1. **`.github/workflows/accessibility-tests.yml`**
   - Main workflow for accessibility testing
   - Triggers on push and pull requests
   - Comments on PRs with results
   - Uploads reports as artifacts

2. **`.github/workflows/scheduled-audit.yml`**
   - Daily scheduled accessibility audits
   - Runs at 2 AM UTC every day
   - Creates GitHub issues on failure
   - 90-day artifact retention

### Documentation Files (3 files)

3. **`.github/GITHUB-ACTIONS-SETUP.md`**
   - Complete setup guide
   - Workflow details
   - Customization options
   - Troubleshooting guide

4. **`.github/QUICK-REFERENCE.md`**
   - Quick reference card
   - Common commands
   - Quick troubleshooting

5. **`README-NEW.md`**
   - Updated README with accessibility section
   - Status badges
   - Quick links to documentation

## 📁 Directory Structure

```
.github/
├── workflows/
│   ├── accessibility-tests.yml      # Main test workflow
│   └── scheduled-audit.yml          # Daily audit workflow
├── GITHUB-ACTIONS-SETUP.md          # Complete guide
└── QUICK-REFERENCE.md               # Quick reference
```

## 🚀 Quick Setup Steps

### 1. Add Repository Secret

**Required:** `ACCESSFLOW_SDK_API_KEY`

```bash
# Via GitHub UI:
Repository → Settings → Secrets → Actions → New repository secret
Name: ACCESSFLOW_SDK_API_KEY
Value: your-api-key

# Via GitHub CLI:
gh secret set ACCESSFLOW_SDK_API_KEY
```

### 2. Commit and Push Workflows

```bash
git add .github/
git commit -m "Add GitHub Actions workflows for accessibility testing"
git push origin main
```

### 3. Enable Actions (if needed)

```
Settings → Actions → General
✅ Allow all actions and reusable workflows
✅ Read and write permissions
✅ Allow GitHub Actions to create and approve pull requests
```

### 4. Verify

Go to **Actions** tab → Should see workflows running

## 🔄 Workflows Overview

### Accessibility Tests Workflow

**File:** `.github/workflows/accessibility-tests.yml`

**Triggers:**
- ✅ Push to `main` or `develop` branches
- ✅ Pull requests to `main` or `develop`
- ✅ Manual trigger via "Run workflow" button

**What It Does:**
1. Checks out code
2. Sets up Node.js 18
3. Installs dependencies
4. Installs AccessFlow SDK
5. Installs Playwright browsers
6. Runs accessibility tests
7. Uploads test results as artifacts
8. Comments on PRs with summary
9. Uploads results to AccessFlow dashboard

**Artifacts Generated:**
- `playwright-report` - Main test reports
- `playwright-html-report` - HTML reports

**Retention:** 30 days

### Scheduled Audit Workflow

**File:** `.github/workflows/scheduled-audit.yml`

**Triggers:**
- ✅ Daily at 2 AM UTC (cron: `0 2 * * *`)
- ✅ Manual trigger via "Run workflow" button

**What It Does:**
1. Runs complete accessibility audit
2. Uploads results with extended retention
3. Creates GitHub issue if tests fail
4. Tracks accessibility trends over time

**Artifacts Generated:**
- `scheduled-audit-{run_number}` - Complete audit results

**Retention:** 90 days

**Issue Creation:**
- Title: "🚨 Scheduled Accessibility Audit Failed"
- Labels: `accessibility`, `automated-test`, `needs-review`
- Links to workflow run and artifacts

## 📊 Features

### ✅ Automated Testing
- Runs on every push and PR
- No manual intervention needed
- Immediate feedback on accessibility issues

### ✅ Pull Request Integration
- Automatic comments on PRs
- Links to detailed reports
- Status checks for branch protection

### ✅ Artifact Management
- Test results preserved
- HTML reports downloadable
- Extended retention for scheduled audits

### ✅ Issue Tracking
- Auto-creates issues on failures
- Proper labels for organization
- Links to relevant workflow runs

### ✅ AccessFlow Integration
- Automatic upload in CI environment
- Historical trends tracking
- CI metadata included (branch, commit, etc.)

### ✅ Manual Triggers
- Run workflows on-demand
- Test before merging
- Investigate specific issues

## 🎯 Usage Examples

### View Workflow Status

```bash
# List recent runs
gh run list --workflow=accessibility-tests.yml

# View specific run
gh run view <run-id>

# Watch live run
gh run watch
```

### Manual Trigger

```bash
# Via GitHub CLI
gh workflow run accessibility-tests.yml --ref main

# Via GitHub UI
Actions → Select Workflow → Run workflow → Choose branch → Run
```

### Download Artifacts

```bash
# Via GitHub CLI
gh run download <run-id>

# Via GitHub UI
Actions → Workflow run → Artifacts section → Download
```

## 📈 Monitoring

### GitHub Actions Tab
- View all workflow runs
- Filter by status, branch, workflow
- See run duration and costs

### GitHub Insights
- Go to Insights → Actions
- View success/failure rates
- Monitor workflow performance
- Track billing (private repos)

### AccessFlow Dashboard
- Visit: https://app.accessflow.com
- View trends over time
- Compare results across runs
- See CI/CD metadata

## 🎨 Customization Options

### Change Schedule

Edit `scheduled-audit.yml`:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Monday 9 AM
  - cron: '0 18 * * 5'  # Friday 6 PM
```

### Add More Branches

Edit `accessibility-tests.yml`:
```yaml
on:
  push:
    branches:
      - main
      - develop
      - staging
      - production
```

### Change Node.js Version

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'  # or '16', '18', etc.
```

### Add Slack Notifications

Add to workflow:
```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Change Artifact Retention

```yaml
- uses: actions/upload-artifact@v4
  with:
    retention-days: 60  # Keep for 60 days
```

## 🔐 Security

### Secrets Management
- ✅ API keys stored as encrypted secrets
- ✅ Never exposed in logs
- ✅ Only accessible during workflow runs
- ✅ Can be rotated without code changes

### Permissions
- ✅ Read/write for creating issues and comments
- ✅ Minimal required permissions
- ✅ No access to sensitive repository settings

### Best Practices
- ✅ Use secrets for all sensitive data
- ✅ Enable branch protection rules
- ✅ Require status checks before merging
- ✅ Review workflow changes in PRs

## 📋 Status Badges

Add to your README:

```markdown
![Accessibility Tests](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/accessibility-tests.yml/badge.svg)

![Scheduled Audit](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/scheduled-audit.yml/badge.svg)
```

Replace `YOUR_ORG` and `YOUR_REPO` with your values.

## 🛠️ Troubleshooting

### Common Issues

**Issue:** Workflow doesn't start
- Check Actions are enabled
- Verify branch names match
- Check workflow syntax (use yamllint)

**Issue:** Secret not found
- Verify name is `ACCESSFLOW_SDK_API_KEY`
- Check it's a repository secret
- Re-add if needed

**Issue:** Tests timeout
- Increase timeout in `playwright.config.js`
- Check application is accessible
- Review test complexity

**Issue:** No artifacts
- Verify `if: always()` is set
- Check paths are correct
- Ensure tests generated files

## 📚 Documentation

### Setup Guides
- **Quick Start:** `.github/QUICK-REFERENCE.md`
- **Complete Guide:** `.github/GITHUB-ACTIONS-SETUP.md`
- **AccessFlow Setup:** `ACCESSFLOW-SETUP.md`
- **Getting Started:** `GETTING-STARTED.md`

### Reference
- **API Reference:** `ACCESSFLOW-QUICKREF.md`
- **File Guide:** `FILE-GUIDE.md`
- **Setup Checklist:** `SETUP-CHECKLIST.md`

## ✅ Success Criteria

Your GitHub Actions integration is successful when:

- ✅ Workflows appear in Actions tab
- ✅ Tests run on push/PR automatically
- ✅ Artifacts are uploaded and downloadable
- ✅ PR comments appear correctly
- ✅ Results upload to AccessFlow dashboard
- ✅ Scheduled audits run daily
- ✅ Issues created on failures
- ✅ Status badges display correctly

## 🎉 Next Steps

1. **Add status badges** to README
2. **Set up branch protection** requiring status checks
3. **Configure notifications** (Slack, email, etc.)
4. **Review first audit results** in AccessFlow
5. **Address critical issues** (extreme/high severity)
6. **Customize schedule** if needed
7. **Share with team** and document processes

## 📞 Support

Need help?
1. Check `.github/GITHUB-ACTIONS-SETUP.md`
2. Review GitHub Actions documentation
3. Check AccessFlow documentation
4. Open an issue in the repository

---

**Your GitHub Actions workflows are ready to use!** 🚀

Push your code and watch the magic happen in the Actions tab.
