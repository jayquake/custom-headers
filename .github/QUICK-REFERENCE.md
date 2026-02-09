# GitHub Actions Quick Reference

## 🚀 Quick Setup (5 Minutes)

### 1. Add Secret
Repository → Settings → Secrets and variables → Actions
- **Name:** `ACCESSFLOW_SDK_API_KEY`
- **Value:** Your AccessFlow API key

### 2. Commit Workflows
```bash
git add .github/
git commit -m "Add accessibility testing workflows"
git push
```

### 3. Verify
Actions tab → Should see "Accessibility Tests" workflow running

## 📋 Workflows

### Main Tests (`accessibility-tests.yml`)
**Runs on:**
- Push to `main` or `develop`
- Pull requests
- Manual trigger

**What it does:**
- Runs all accessibility tests
- Uploads reports as artifacts
- Comments on PRs
- Uploads to AccessFlow dashboard

### Scheduled Audit (`scheduled-audit.yml`)
**Runs on:**
- Daily at 2 AM UTC
- Manual trigger

**What it does:**
- Comprehensive accessibility audit
- Creates issue on failure
- 90-day artifact retention

## 🎯 Common Tasks

### Manual Run
1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**
4. Choose branch
5. Click **Run workflow**

### View Results
1. Go to **Actions** tab
2. Click workflow run
3. Click job name
4. View logs

### Download Reports
1. Go to workflow run
2. Scroll to **Artifacts**
3. Download and unzip
4. Open `index.html`

### Add Status Badge
```markdown
![Tests](https://github.com/USERNAME/REPO/actions/workflows/accessibility-tests.yml/badge.svg)
```

## 🔐 Required Secret

**`ACCESSFLOW_SDK_API_KEY`**
- Get from: https://app.accessflow.com/settings/api-keys
- Scope: "CICD SDK"
- Add to: Repository Settings → Secrets → Actions

## 🛠️ Troubleshooting

### Tests Fail
- Check API key is set correctly
- Verify `baseURL` in `playwright.config.js`
- Review workflow logs

### No Artifacts
- Check `if: always()` in upload step
- Verify paths exist
- Check retention days setting

### Scheduled Audit Not Running
- Verify cron syntax
- Check Actions are enabled
- Wait for next scheduled time

## 📊 Monitoring

### GitHub
- **Actions tab** → View all runs
- **Insights** → Actions analytics
- **Issues** → Auto-created on failures

### AccessFlow
- https://app.accessflow.com
- View trends and historical data
- CI/CD metadata included

## ⚡ Common Commands

```bash
# Test workflow locally with act
act -j accessibility-tests

# Validate workflow syntax
yamllint .github/workflows/*.yml

# View workflow status via CLI
gh run list --workflow=accessibility-tests.yml

# Manually trigger workflow
gh workflow run accessibility-tests.yml

# View recent run
gh run view
```

## 🎨 Customization

### Change Schedule
Edit `scheduled-audit.yml`:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Monday 9 AM
```

### Add Slack Notifications
Add to workflow:
```yaml
- name: Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### Change Retention
```yaml
retention-days: 30  # Keep artifacts 30 days
```

## ✅ Success Indicators

- ✅ Green checkmark in Actions tab
- ✅ Artifacts uploaded
- ✅ PR comments appear
- ✅ AccessFlow dashboard updated
- ✅ No errors in logs

## 🔗 Quick Links

- **Actions Tab**: `https://github.com/YOUR_ORG/YOUR_REPO/actions`
- **Secrets**: `https://github.com/YOUR_ORG/YOUR_REPO/settings/secrets/actions`
- **AccessFlow**: `https://app.accessflow.com`
- **Full Guide**: `.github/GITHUB-ACTIONS-SETUP.md`

---

**Need more help?** See `.github/GITHUB-ACTIONS-SETUP.md` for detailed guide.
