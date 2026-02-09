# Project File Guide

Complete reference of all files in this project and their purposes.

## 📦 SDK Package

### `acsbe-accessflow-sdk-1.0.1.tgz`
The AccessFlow SDK package (local installation file).
- **Purpose**: Contains the AccessFlow SDK for accessibility testing
- **Installation**: `npm install ./acsbe-accessflow-sdk-1.0.1.tgz`
- **Should not be committed**: Added to `.gitignore`

## ⚙️ Configuration Files

### `package.json`
Project dependencies and scripts.
- **Contains**: Playwright dependency, AccessFlow SDK reference
- **Scripts**: test, test:ui, test:headed, test:debug, setup
- **Edit to**: Add new scripts or dependencies

### `playwright.config.js`
Playwright test runner configuration.
- **Key settings**: 
  - Test directory: `./tests`
  - Output directory: `./test-results`
  - Global teardown for AccessFlow reports
  - Browser configurations (Chromium by default)
- **Edit to**: Change test settings, add browsers, modify timeouts

### `accessflow.config.json`
AccessFlow SDK threshold configuration.
- **Purpose**: Define maximum allowed accessibility issues by severity
- **Settings**:
  - `issuesFoundThreshold`: Max issues per severity level
  - `localCheck`: Enable/disable local threshold checking
- **Edit to**: Adjust accessibility thresholds

### `.env.example`
Environment variable template.
- **Purpose**: Template for required environment variables
- **Contains**: Placeholder for `ACCESSFLOW_SDK_API_KEY`
- **Usage**: Copy to `.env` and add actual API key

### `.env` (create this)
Environment variables (not in git).
- **Purpose**: Store sensitive configuration
- **Required**: `ACCESSFLOW_SDK_API_KEY=your-key-here`
- **Security**: Never commit this file

### `.gitignore`
Git ignore rules.
- **Updated with**:
  - Playwright test results
  - Node modules
  - Environment files
  - SDK package files

## 🧪 Test Files

### `tests/graphics-audit.spec.js`
Main accessibility test suite.
- **Tests**: Multiple UI states on graphics/background-images page
- **States covered**:
  - Initial page load
  - Modal open/close
  - Sidebar collapsed/expanded
  - Success/failure pages
- **Updated with**: Proper SDK usage with testInfo

### `tests/README.md`
Documentation for test directory.
- **Contains**:
  - How to run tests
  - Test patterns and examples
  - Best practices
  - Debugging tips

## 📚 Documentation Files

### `ACCESSFLOW-SETUP.md` ⭐
**START HERE** - Complete installation and configuration guide.
- **Sections**:
  - Installation steps
  - Configuration details
  - Running tests (local and CI/CD)
  - Understanding reports
  - CI/CD integration examples
  - Troubleshooting guide
  - Best practices
- **Read this**: For detailed setup instructions

### `ACCESSFLOW-QUICKREF.md`
Quick reference guide for SDK API.
- **Contains**:
  - API method signatures
  - Code examples
  - Common patterns
  - Report structures
  - Configuration options
  - Debugging tips
- **Use this**: While writing tests

### `ACCESSFLOW-INTEGRATION-SUMMARY.md`
Overview of the AccessFlow integration.
- **Contains**:
  - What was done
  - Files created/modified
  - Project structure
  - Quick start guide
  - Next steps
- **Read this**: To understand what changed

### `SETUP-CHECKLIST.md`
Step-by-step setup checklist.
- **Purpose**: Track setup progress
- **Contains**:
  - Pre-installation checks
  - Installation steps
  - Configuration steps
  - Verification steps
  - Troubleshooting checks
- **Use this**: During initial setup

### `README.md`
Original project documentation.
- **Purpose**: Documentation for the custom headers testing tool
- **Contains**: Cloudflare Workers and GitHub Pages setup

### `NOTION-README.md`
Additional project documentation.
- **Purpose**: Extended documentation
- **Contains**: Project details and usage

## 🚀 Setup Scripts

### `setup.sh`
Automated setup script for Mac/Linux.
- **Purpose**: One-command setup
- **Does**:
  - Checks Node.js and npm
  - Installs dependencies
  - Installs AccessFlow SDK
  - Creates .env file
  - Installs Playwright browsers
- **Usage**: `./setup.sh`
- **Executable**: Already has execute permissions

### `setup.bat`
Automated setup script for Windows.
- **Purpose**: One-command setup for Windows
- **Does**: Same as setup.sh but for Windows
- **Usage**: `setup.bat`

## 🌐 Application Files

### `index.html`
Success page for the custom headers validator.
- **Purpose**: Displayed when headers are valid
- **Served by**: GitHub Pages (proxied through Cloudflare Worker)

### `403.html`
Error page for missing headers.
- **Purpose**: Displayed when headers are missing or invalid
- **Served by**: Cloudflare Worker

### `worker.js`
Cloudflare Worker for header validation.
- **Purpose**: Validates required headers before proxying to GitHub Pages
- **Headers required**:
  - `Signature-Input`
  - `Signature`
  - `Signature-Agent`

### `wrangler.toml`
Cloudflare Wrangler configuration.
- **Purpose**: Configuration for deploying the Worker
- **Contains**: Worker name and compatibility settings

## 📁 Directory Structure

```
custom-headers-main/
│
├── 📦 SDK Package
│   └── acsbe-accessflow-sdk-1.0.1.tgz
│
├── ⚙️ Configuration
│   ├── .env.example
│   ├── .gitignore
│   ├── accessflow.config.json
│   ├── package.json
│   ├── playwright.config.js
│   └── wrangler.toml
│
├── 🧪 Tests
│   └── tests/
│       ├── graphics-audit.spec.js
│       └── README.md
│
├── 📚 Documentation
│   ├── ACCESSFLOW-INTEGRATION-SUMMARY.md
│   ├── ACCESSFLOW-QUICKREF.md
│   ├── ACCESSFLOW-SETUP.md
│   ├── NOTION-README.md
│   ├── README.md
│   └── SETUP-CHECKLIST.md
│
├── 🚀 Setup Scripts
│   ├── setup.bat
│   └── setup.sh
│
└── 🌐 Application
    ├── 403.html
    ├── index.html
    └── worker.js
```

## 📖 Reading Order

For first-time setup, read in this order:

1. **`SETUP-CHECKLIST.md`** - Follow the checklist
2. **`ACCESSFLOW-SETUP.md`** - Detailed setup guide
3. **`ACCESSFLOW-INTEGRATION-SUMMARY.md`** - Understand what was added
4. **`ACCESSFLOW-QUICKREF.md`** - Reference while coding
5. **`tests/README.md`** - When writing tests

## 🎯 Quick Actions

### Initial Setup
```bash
./setup.sh                          # Mac/Linux
setup.bat                           # Windows
```

### Running Tests
```bash
npm test                            # Run all tests
npm run test:ui                     # Interactive mode
```

### Viewing Results
```bash
npx playwright show-report          # Open HTML report
```

## 📝 File Usage by Task

### Setting Up Project
- ✅ Run: `setup.sh` or `setup.bat`
- ✅ Edit: `.env` (add API key)
- ✅ Review: `SETUP-CHECKLIST.md`

### Writing Tests
- ✅ Edit: `tests/*.spec.js`
- ✅ Reference: `ACCESSFLOW-QUICKREF.md`
- ✅ Reference: `tests/README.md`

### Configuring Behavior
- ✅ Edit: `accessflow.config.json` (thresholds)
- ✅ Edit: `playwright.config.js` (test settings)

### Deploying to CI
- ✅ Reference: `ACCESSFLOW-SETUP.md` (CI/CD Integration section)
- ✅ Set: Environment variable `ACCESSFLOW_SDK_API_KEY`

### Troubleshooting
- ✅ Check: `ACCESSFLOW-SETUP.md` (Troubleshooting section)
- ✅ Check: `SETUP-CHECKLIST.md` (Troubleshooting Checklist)
- ✅ Review: Console logs from `npm test`

## 🔄 Generated Files (Not in Git)

These files are created when you run tests:

### `node_modules/`
Installed dependencies.
- **Created by**: `npm install`
- **Size**: Large (~100MB+)
- **Ignored**: Yes (in .gitignore)

### `test-results/`
Test artifacts and reports.
- **Created by**: Running tests
- **Contains**: HTML reports, screenshots, videos
- **Ignored**: Yes (in .gitignore)

### `playwright-report/`
Playwright HTML report.
- **Created by**: Playwright reporter
- **View with**: `npx playwright show-report`
- **Ignored**: Yes (in .gitignore)

### `.env`
Your API key (created from .env.example).
- **Create by**: `cp .env.example .env`
- **Edit to**: Add your actual API key
- **Ignored**: Yes (in .gitignore)

## 🔒 Sensitive Files (Never Commit)

These files should NEVER be committed to git:

- ❌ `.env` - Contains API key
- ❌ `test-results/` - May contain sensitive data
- ❌ `node_modules/` - Too large, regenerate with npm install

Already protected by `.gitignore`.

## 🎓 Learning Resources

By file purpose:

### Learn Setup
- `SETUP-CHECKLIST.md`
- `ACCESSFLOW-SETUP.md`

### Learn API
- `ACCESSFLOW-QUICKREF.md`
- `tests/README.md`

### Learn Architecture
- `ACCESSFLOW-INTEGRATION-SUMMARY.md`
- `playwright.config.js` (commented)

### Example Code
- `tests/graphics-audit.spec.js`
- Code samples in `ACCESSFLOW-QUICKREF.md`

## 🆘 Getting Help

Can't find what you need? Check:

1. **Search documentation**: Use Ctrl+F in markdown files
2. **Check quickref**: `ACCESSFLOW-QUICKREF.md`
3. **Review examples**: `tests/graphics-audit.spec.js`
4. **Read setup guide**: `ACCESSFLOW-SETUP.md`
5. **Check checklist**: `SETUP-CHECKLIST.md`

## ✨ Summary

- **7 configuration files** - Set up your environment
- **2 test files** - Write and run accessibility tests
- **6 documentation files** - Learn and reference
- **2 setup scripts** - Automate installation
- **4 application files** - Original project files

**Total: 21 tracked files + generated files**

Everything you need to run accessibility tests with AccessFlow SDK! 🚀
