# Custom Headers Testing Tool

![Accessibility Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/accessibility-tests.yml/badge.svg)

A testing tool for validating HTTP header requirements using Cloudflare Workers and GitHub Pages. This tool requires three specific headers to be present in requests before granting access.

**New:** This project now includes automated accessibility testing with AccessFlow SDK and GitHub Actions! ♿

## Quick Links

- 🚀 **[Getting Started with AccessFlow](GETTING-STARTED.md)** - 5-minute setup
- 🔄 **[GitHub Actions Setup](.github/GITHUB-ACTIONS-SETUP.md)** - CI/CD pipeline
- 📖 **[AccessFlow Setup Guide](ACCESSFLOW-SETUP.md)** - Complete documentation
- 🔍 **[API Reference](ACCESSFLOW-QUICKREF.md)** - Quick reference
- ✅ **[Setup Checklist](SETUP-CHECKLIST.md)** - Step-by-step guide

## Overview

This project demonstrates server-side header validation for testing tools like accessFlow scanner. The worker validates that requests include three specific headers with exact values:

- **`Signature-Input`** must equal: `This`
- **`Signature`** must equal: `Should`
- **`Signature-Agent`** must equal: `Work`

**Important**: The worker validates both header presence AND values. Requests with missing or incorrect header values will receive a 403 Forbidden error.

## Accessibility Testing 🆕

This project includes comprehensive accessibility testing using the AccessFlow SDK and automated GitHub Actions workflows.

### Features

- ✅ **Automated Testing**: Tests run on every push and pull request
- ✅ **Daily Audits**: Scheduled accessibility audits every day
- ✅ **Detailed Reports**: HTML/JSON reports with WCAG compliance data
- ✅ **CI/CD Integration**: Automatic upload to AccessFlow dashboard
- ✅ **Threshold Monitoring**: Configurable limits for accessibility issues
- ✅ **Multi-State Testing**: Tests different UI states (modals, sidebars, etc.)

### Quick Start

1. **Install dependencies:**
   ```bash
   ./setup.sh  # Mac/Linux
   # or
   setup.bat   # Windows
   ```

2. **Add API key to `.env`:**
   ```bash
   ACCESSFLOW_SDK_API_KEY=your-key-here
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

4. **View reports:**
   ```bash
   npx playwright show-report
   ```

### GitHub Actions Setup

Set up automated testing in CI/CD:

1. **Add repository secret:**
   - Go to Settings → Secrets and variables → Actions
   - Add secret: `ACCESSFLOW_SDK_API_KEY`

2. **Push workflows:**
   ```bash
   git add .github/workflows/
   git commit -m "Add accessibility workflows"
   git push
   ```

3. **View results:**
   - Go to Actions tab in GitHub
   - Download artifacts for detailed reports

See **[GitHub Actions Setup Guide](.github/GITHUB-ACTIONS-SETUP.md)** for details.

## Architecture

```
Request → Cloudflare Worker → Validate Headers → GitHub Pages
                                      ↓
                                  403 Error
```

The Cloudflare Worker acts as a protective layer in front of GitHub Pages, validating all incoming requests before proxying them through.

## Prerequisites

- Node.js (v16 or higher)
- A GitHub account
- A Cloudflare account (free tier works)
- Git
- (Optional) AccessFlow API key for accessibility testing

## Installation

### 1. Clone the Repository

```bash
gh repo clone jayquake/custom-headers
cd custom-headers
```

### 2. Install Wrangler CLI

Wrangler is Cloudflare's command-line tool for managing Workers:

```bash
npm install -g wrangler
```

### 3. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window for authentication.

### 4. (Optional) Set Up Accessibility Testing

```bash
./setup.sh  # Mac/Linux
# or
setup.bat   # Windows
```

This installs:
- Playwright for browser automation
- AccessFlow SDK for accessibility testing
- All required dependencies

