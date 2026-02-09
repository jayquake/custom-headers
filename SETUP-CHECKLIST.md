# AccessFlow SDK Setup Checklist

## Pre-Installation Checklist

- [ ] Node.js installed (v16 or higher)
  - Check: `node --version`
- [ ] npm installed
  - Check: `npm --version`
- [ ] AccessFlow API key obtained
  - Get from: https://app.accessflow.com/settings/api-keys

## Installation Steps

### Option A: Automated Setup (Recommended)

**Mac/Linux:**
- [ ] Run setup script: `./setup.sh`
- [ ] Review setup output for any errors

**Windows:**
- [ ] Run setup script: `setup.bat`
- [ ] Review setup output for any errors

### Option B: Manual Setup

- [ ] Install project dependencies: `npm install`
- [ ] Install AccessFlow SDK: `npm install ./acsbe-accessflow-sdk-1.0.1.tgz`
- [ ] Install Playwright browsers: `npx playwright install chromium`
- [ ] Create `.env` file: `cp .env.example .env`

## Configuration Steps

- [ ] Edit `.env` file
- [ ] Add your AccessFlow API key to `ACCESSFLOW_SDK_API_KEY`
- [ ] Review `accessflow.config.json` thresholds
- [ ] Adjust thresholds if needed for your project
- [ ] Review `playwright.config.js` settings
- [ ] Update `baseURL` if testing a different application

## Verification Steps

- [ ] Verify SDK installation: `npm list @acsbe/accessflow-sdk`
- [ ] Check for `@acsbe/accessflow-sdk@1.0.1` in output
- [ ] Verify Playwright installation: `npx playwright --version`
- [ ] Review test file: `tests/graphics-audit.spec.js`

## First Test Run

- [ ] Start your application (if needed)
  - Example: `wrangler dev` for Cloudflare Workers
  - Or update `baseURL` in `playwright.config.js` to your app URL
- [ ] Run tests: `npm test`
- [ ] Wait for tests to complete
- [ ] Check console output for audit results
- [ ] Review test-results directory: `ls -la test-results/`

## Review Results

- [ ] Open HTML report: `npx playwright show-report`
- [ ] Review accessibility issues found
- [ ] Check severity levels (extreme, high, medium, low)
- [ ] Identify specific selectors with issues
- [ ] Review WCAG guidelines for each issue

## Next Steps

- [ ] Document baseline accessibility issues
- [ ] Create plan to address critical issues (extreme/high)
- [ ] Set realistic threshold goals
- [ ] Add more test coverage for other pages
- [ ] Set up CI/CD integration (optional)

## Documentation Review

- [ ] Read ACCESSFLOW-SETUP.md for detailed guide
- [ ] Review ACCESSFLOW-QUICKREF.md for API reference
- [ ] Check ACCESSFLOW-INTEGRATION-SUMMARY.md for overview
- [ ] Bookmark for future reference

## CI/CD Setup (Optional)

If setting up continuous integration:

### GitHub Actions
- [ ] Create `.github/workflows/accessibility.yml`
- [ ] Add workflow configuration
- [ ] Add `ACCESSFLOW_SDK_API_KEY` to repository secrets
- [ ] Test workflow with a push
- [ ] Verify reports upload to AccessFlow dashboard

### CircleCI
- [ ] Create `.circleci/config.yml`
- [ ] Add job configuration
- [ ] Add `ACCESSFLOW_SDK_API_KEY` to project environment variables
- [ ] Test pipeline
- [ ] Verify reports upload to AccessFlow dashboard

### Other CI Platforms
- [ ] See ACCESSFLOW-SETUP.md for other examples
- [ ] Configure environment variables
- [ ] Test pipeline

## Troubleshooting Checklist

If you encounter issues:

### SDK Not Found
- [ ] Run: `npm install ./acsbe-accessflow-sdk-1.0.1.tgz`
- [ ] Check: `npm list @acsbe/accessflow-sdk`
- [ ] Verify `package.json` has SDK in devDependencies

### Tests Failing
- [ ] Check API key is set correctly
- [ ] Verify application is running
- [ ] Check `baseURL` in `playwright.config.js`
- [ ] Review console errors
- [ ] Check CSP headers aren't blocking auditor script

### Threshold Violations
- [ ] Review actual issue counts in reports
- [ ] Adjust thresholds in `accessflow.config.json`
- [ ] Or set `localCheck: false` to monitor only
- [ ] Or fix accessibility issues

### Reports Not Generating
- [ ] Verify `testInfo` is passed to SDK constructor
- [ ] Check `generateReport()` is called after `audit()`
- [ ] Ensure `globalTeardown` is in `playwright.config.js`
- [ ] Check `outputDir` path is correct

### CSP Issues
- [ ] Review CSP headers on your site
- [ ] Add `'unsafe-inline'` to script-src (development only)
- [ ] Or configure Playwright with `bypassCSP: true`

## Success Criteria

You'll know the setup is successful when:

- ✅ Tests run without errors
- ✅ HTML reports are generated in test-results/
- ✅ Console shows audit summaries
- ✅ Reports display accessibility issues with details
- ✅ WCAG links and selectors are included
- ✅ Severity levels are categorized correctly

## Maintenance Checklist

Regular tasks:

### Weekly
- [ ] Run accessibility tests
- [ ] Review new issues
- [ ] Track progress on fixing issues

### Monthly
- [ ] Review threshold settings
- [ ] Update thresholds based on progress
- [ ] Add tests for new features/pages
- [ ] Review AccessFlow dashboard trends

### Quarterly
- [ ] Update dependencies: `npm update`
- [ ] Update Playwright: `npm install -D @playwright/test@latest`
- [ ] Review WCAG guideline updates
- [ ] Update team on accessibility goals/progress

## Support Resources

If you need help:

- [ ] Check ACCESSFLOW-SETUP.md documentation
- [ ] Review ACCESSFLOW-QUICKREF.md for examples
- [ ] Visit Playwright documentation: https://playwright.dev
- [ ] Check WCAG guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- [ ] Contact AccessFlow support via dashboard

## Quick Commands Reference

```bash
# Installation
npm install
npm install ./acsbe-accessflow-sdk-1.0.1.tgz
npx playwright install chromium

# Running Tests
npm test                    # Run all tests
npm run test:ui             # Interactive UI mode
npm run test:headed         # See browser
npm run test:debug          # Debug mode

# Viewing Results
npx playwright show-report  # Open HTML report
ls -la test-results/        # List generated files

# Maintenance
npm update                  # Update dependencies
npm list @acsbe/accessflow-sdk  # Check SDK version
```

## Sign-off

Once you've completed all steps and verified the setup:

- [ ] Setup completed successfully
- [ ] First test run successful
- [ ] Reports reviewed and understood
- [ ] Team briefed on new accessibility testing
- [ ] Documentation bookmarked for reference

**Date Completed:** _______________

**Completed By:** _______________

**Notes:**
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

---

**Congratulations! Your AccessFlow SDK integration is complete!** 🎉

You're now ready to maintain and improve your application's accessibility.
