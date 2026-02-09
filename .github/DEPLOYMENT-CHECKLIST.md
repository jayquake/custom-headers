# GitHub Actions Deployment Checklist

Use this checklist to deploy your GitHub Actions workflows step-by-step.

## ☐ Pre-Deployment

### Environment Setup
- [ ] Node.js installed locally (for testing)
- [ ] Git repository initialized
- [ ] GitHub repository created
- [ ] AccessFlow API key obtained

### Local Testing
- [ ] Run `./setup.sh` or `setup.bat`
- [ ] Tests pass locally: `npm test`
- [ ] Reports generate correctly
- [ ] Review `test-results/` directory

## ☐ GitHub Repository Setup

### Repository Settings
- [ ] Repository is public or private (both work)
- [ ] Actions are enabled
  - Go to: Settings → Actions → General
  - Select: "Allow all actions and reusable workflows"
- [ ] Workflow permissions set correctly
  - Settings → Actions → General → Workflow permissions
  - Select: "Read and write permissions"
  - Check: "Allow GitHub Actions to create and approve pull requests"

### Branch Protection (Optional but Recommended)
- [ ] Go to: Settings → Branches
- [ ] Add rule for `main` branch:
  - [ ] Require a pull request before merging
  - [ ] Require status checks to pass
  - [ ] Add status check: "Run AccessFlow Accessibility Tests"
  - [ ] Require branches to be up to date

## ☐ Secrets Configuration

### Add Repository Secret
- [ ] Go to: Settings → Secrets and variables → Actions
- [ ] Click: "New repository secret"
- [ ] Name: `ACCESSFLOW_SDK_API_KEY`
- [ ] Value: Your AccessFlow API key
- [ ] Click: "Add secret"
- [ ] Verify secret appears in list (value will be hidden)

### Optional Secrets (if needed)
- [ ] `SLACK_WEBHOOK_URL` (for notifications)
- [ ] `SIGNATURE_INPUT` (for custom headers testing)
- [ ] `SIGNATURE` (for custom headers testing)
- [ ] `SIGNATURE_AGENT` (for custom headers testing)

## ☐ Workflow Files

### Verify Files Exist
- [ ] `.github/workflows/accessibility-tests.yml`
- [ ] `.github/workflows/scheduled-audit.yml`
- [ ] `.github/GITHUB-ACTIONS-SETUP.md`
- [ ] `.github/QUICK-REFERENCE.md`
- [ ] `.github/INTEGRATION-SUMMARY.md`

### Review Configuration
- [ ] Check branch names in triggers match your setup
- [ ] Review cron schedule for scheduled-audit
- [ ] Verify Node.js version is correct
- [ ] Check artifact retention days are appropriate

## ☐ Commit and Push

### Stage Files
```bash
git add .github/
git add package.json
git add playwright.config.js
git add accessflow.config.json
git add tests/
git status  # Verify files are staged
```

### Commit
```bash
git commit -m "Add GitHub Actions workflows for accessibility testing

- Add accessibility-tests workflow for PR/push events
- Add scheduled-audit workflow for daily audits
- Include comprehensive documentation
- Configure AccessFlow SDK integration"
```

### Push to Main
```bash
git push origin main
```

Or create a feature branch:
```bash
git checkout -b feat/add-github-actions
git push origin feat/add-github-actions
# Create PR in GitHub UI
```

## ☐ Verify Deployment

### Check Actions Tab
- [ ] Go to repository → Actions tab
- [ ] Workflows should appear:
  - "Accessibility Tests"
  - "Scheduled Accessibility Audit"
- [ ] Initial run should be triggered by push

### Monitor First Run
- [ ] Click on the running workflow
- [ ] Click on job: "Run AccessFlow Accessibility Tests"
- [ ] Watch live logs
- [ ] Verify all steps complete successfully:
  - [ ] Checkout code ✓
  - [ ] Setup Node.js ✓
  - [ ] Install dependencies ✓
  - [ ] Install AccessFlow SDK ✓
  - [ ] Install Playwright browsers ✓
  - [ ] Run accessibility tests ✓
  - [ ] Upload test results ✓

### Check Results
- [ ] Green checkmark appears on workflow
- [ ] Scroll to Artifacts section
- [ ] Artifacts are present:
  - `playwright-report`
  - `playwright-html-report`
- [ ] Download and verify artifacts

### Verify AccessFlow Integration
- [ ] Go to: https://app.accessflow.com
- [ ] Log in to your account
- [ ] Navigate to your project
- [ ] Verify results appear in dashboard
- [ ] Check CI metadata is included

## ☐ Test Pull Request Workflow

### Create Test PR
```bash
git checkout -b test/pr-workflow
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "Test PR workflow"
git push origin test/pr-workflow
```

### Verify PR Workflow
- [ ] Create PR in GitHub UI
- [ ] Workflow runs automatically
- [ ] Status check appears on PR
- [ ] Comment is added to PR with results
- [ ] Artifacts are uploaded

### Clean Up Test
- [ ] Close or merge test PR
- [ ] Delete test branch

## ☐ Test Manual Trigger

### Run Workflow Manually
- [ ] Go to: Actions → Accessibility Tests
- [ ] Click: "Run workflow"
- [ ] Select branch: `main`
- [ ] Click: "Run workflow"
- [ ] Verify it runs successfully

## ☐ Test Scheduled Workflow

### Option 1: Wait for Scheduled Run
- [ ] Note current time and UTC offset
- [ ] Wait for 2 AM UTC next day
- [ ] Check Actions tab for scheduled run

### Option 2: Manual Trigger
- [ ] Go to: Actions → Scheduled Accessibility Audit
- [ ] Click: "Run workflow"
- [ ] Select branch: `main`
- [ ] Click: "Run workflow"
- [ ] Verify it runs successfully
- [ ] Check for issue creation if tests fail

### Verify Scheduled Workflow
- [ ] Artifacts have 90-day retention
- [ ] Issue is created on failure (if applicable)
- [ ] Issue has correct labels

## ☐ Add Status Badges

### Update README
- [ ] Open `README.md` or create new one
- [ ] Add status badges at top:

```markdown
![Accessibility Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/accessibility-tests.yml/badge.svg)
![Scheduled Audit](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/scheduled-audit.yml/badge.svg)
```

- [ ] Replace `YOUR_USERNAME` and `YOUR_REPO`
- [ ] Commit and push changes
- [ ] Verify badges display correctly

## ☐ Configure Notifications (Optional)

### Email Notifications
- [ ] Go to: https://github.com/settings/notifications
- [ ] Configure "Actions" notifications
- [ ] Select notification preferences

### Slack Notifications (Optional)
- [ ] Create Slack webhook
- [ ] Add `SLACK_WEBHOOK_URL` secret
- [ ] Add Slack notification step to workflow
- [ ] Test notification

### GitHub Mobile
- [ ] Install GitHub mobile app
- [ ] Enable push notifications
- [ ] Test workflow run notification

## ☐ Team Setup

### Documentation
- [ ] Share `.github/GITHUB-ACTIONS-SETUP.md` with team
- [ ] Document secret management process
- [ ] Create team guide for interpreting results

### Access Control
- [ ] Add team members to repository
- [ ] Configure appropriate permissions
- [ ] Document who can trigger manual runs
- [ ] Set up code owners (optional)

### Training
- [ ] Walk through workflow with team
- [ ] Show how to view results
- [ ] Explain how to download artifacts
- [ ] Demonstrate manual triggers

## ☐ Monitoring Setup

### Create Monitoring Plan
- [ ] Define who monitors workflow failures
- [ ] Set up on-call rotation (if needed)
- [ ] Document escalation process
- [ ] Create runbook for common issues

### Set Up Alerts
- [ ] Configure failure notifications
- [ ] Set up dashboard monitoring
- [ ] Create metrics tracking (optional)

## ☐ Optimization

### Review Performance
- [ ] Check workflow run times
- [ ] Identify slow steps
- [ ] Consider parallelization
- [ ] Optimize artifact sizes

### Cost Management (Private Repos)
- [ ] Review Actions usage in Settings → Billing
- [ ] Monitor minutes consumed
- [ ] Adjust schedules if needed
- [ ] Consider artifact retention

## ☐ Post-Deployment

### First Week
- [ ] Monitor all workflow runs
- [ ] Address any failures immediately
- [ ] Collect team feedback
- [ ] Document any issues

### First Month
- [ ] Review AccessFlow dashboard trends
- [ ] Analyze common issues
- [ ] Adjust thresholds if needed
- [ ] Update documentation as needed

### Ongoing
- [ ] Regular review of accessibility reports
- [ ] Update workflows as needed
- [ ] Keep dependencies updated
- [ ] Share insights with team

## ☐ Troubleshooting

If something goes wrong:

### Workflow Doesn't Run
- [ ] Check Actions are enabled
- [ ] Verify branch names match triggers
- [ ] Check workflow syntax (yamllint)
- [ ] Review repository permissions

### Secret Not Found
- [ ] Verify secret name spelling
- [ ] Check secret is at repository level
- [ ] Re-add secret if needed
- [ ] Check workflow references correct name

### Tests Fail
- [ ] Review workflow logs
- [ ] Check API key is correct
- [ ] Verify SDK installation step
- [ ] Test locally to reproduce

### Artifacts Not Available
- [ ] Check `if: always()` is set
- [ ] Verify paths are correct
- [ ] Check retention days
- [ ] Review step logs for errors

## ✅ Deployment Complete!

Check all items above before considering deployment complete.

### Success Indicators

You're fully deployed when:
- ✅ Workflows run on push/PR
- ✅ Status checks appear on PRs
- ✅ Artifacts are uploaded
- ✅ Comments appear on PRs
- ✅ AccessFlow dashboard updates
- ✅ Scheduled audits run daily
- ✅ Team can access and understand results
- ✅ Status badges display correctly

### Next Steps

1. **Monitor first few runs closely**
2. **Address any issues immediately**
3. **Collect team feedback**
4. **Iterate on configuration**
5. **Document learnings**

---

**Congratulations!** 🎉 Your GitHub Actions workflows are deployed and running!

**Date Deployed:** _______________

**Deployed By:** _______________

**Notes:**
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
