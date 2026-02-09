# Getting Started with AccessFlow SDK

Quick start guide to get accessibility testing up and running in 5 minutes.

## Prerequisites

- ✅ Node.js installed (check: `node --version`)
- ✅ npm installed (check: `npm --version`)
- ✅ AccessFlow API key ready

## Step 1: Run Setup (Choose One)

### Mac/Linux
```bash
./setup.sh
```

### Windows
```bash
setup.bat
```

### Manual
```bash
npm install
npm install ./acsbe-accessflow-sdk-1.0.1.tgz
npx playwright install chromium
cp .env.example .env
```

## Step 2: Add API Key

Edit `.env`:
```
ACCESSFLOW_SDK_API_KEY=your-api-key-here
```

## Step 3: Run Tests

```bash
npm test
```

## Step 4: View Results

```bash
npx playwright show-report
```

## That's It! 🎉

You now have:
- ✅ AccessFlow SDK installed
- ✅ Tests configured and running
- ✅ Reports being generated
- ✅ Accessibility issues identified

## What's Next?

### Review Results
1. Open the HTML report
2. Identify critical issues (extreme/high severity)
3. Note the CSS selectors for each issue
4. Review WCAG guidelines linked in reports

### Fix Issues
1. Address extreme severity issues first
2. Move to high severity issues
3. Gradually work through medium/low issues
4. Re-run tests after each fix

### Adjust Thresholds
Edit `accessflow.config.json`:
```json
{
  "issuesFoundThreshold": {
    "extreme": 0,
    "high": 5,
    "medium": 10,
    "low": 20
  }
}
```

### Add More Tests
Create new test files in `tests/`:
```javascript
import { AccessFlowSDK } from "@acsbe/accessflow-sdk";
import { test } from "@playwright/test";

AccessFlowSDK.init({ apiKey: process.env.ACCESSFLOW_SDK_API_KEY });

test("my page", async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  await page.goto("/my-page");
  const audits = await sdk.audit();
  sdk.generateReport(audits, 'html');
});
```

## Need Help?

📖 **Detailed Guide**: See `ACCESSFLOW-SETUP.md`  
🔍 **API Reference**: See `ACCESSFLOW-QUICKREF.md`  
✅ **Setup Checklist**: See `SETUP-CHECKLIST.md`  
📁 **File Guide**: See `FILE-GUIDE.md`

## Common Commands

```bash
# Run tests
npm test                    # All tests
npm run test:ui             # Interactive UI
npm run test:headed         # Show browser
npm run test:debug          # Debug mode

# View results
npx playwright show-report  # Open report
ls -la test-results/        # List files

# Specific test
npx playwright test tests/graphics-audit.spec.js
```

## Troubleshooting

### "Cannot find module '@acsbe/accessflow-sdk'"
```bash
npm install ./acsbe-accessflow-sdk-1.0.1.tgz
```

### "Tests failing"
1. Check `.env` has correct API key
2. Verify app is running (if testing local app)
3. Check `baseURL` in `playwright.config.js`

### "Threshold violations"
- Review reports: `npx playwright show-report`
- Fix issues or adjust thresholds in `accessflow.config.json`
- Or set `localCheck: false` to monitor only

## Project Structure

```
custom-headers-main/
├── tests/                   # Your test files
│   └── graphics-audit.spec.js
├── test-results/            # Generated reports (ignored by git)
├── .env                     # Your API key (ignored by git)
├── accessflow.config.json   # Threshold settings
├── playwright.config.js     # Test settings
└── ACCESSFLOW-SETUP.md     # Full documentation
```

## Success Checklist

You're all set when:
- ✅ `npm test` runs without errors
- ✅ Reports appear in `test-results/`
- ✅ `npx playwright show-report` shows results
- ✅ Console shows issue summaries

## Ready to Go Deeper?

1. **Read full docs**: `ACCESSFLOW-SETUP.md`
2. **Learn API**: `ACCESSFLOW-QUICKREF.md`
3. **Review test patterns**: `tests/README.md`
4. **Set up CI/CD**: See `ACCESSFLOW-SETUP.md` CI/CD section

---

**You're all set!** Start improving your app's accessibility. 🚀
