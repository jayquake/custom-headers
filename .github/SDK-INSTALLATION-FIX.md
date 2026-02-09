# GitHub Actions SDK Installation Fix

## Issue
The SDK package file (`acsbe-accessflow-sdk-1.0.1.tgz`) is not available in GitHub Actions because it's either:
1. Being ignored by `.gitignore`
2. Not committed to the repository
3. Too large for GitHub

## Solutions

### Option 1: Use npm Registry (Recommended)

If the AccessFlow SDK is available on npm, install it directly:

**Update both workflow files:**

Replace:
```yaml
- name: Install AccessFlow SDK
  run: npm install ./acsbe-accessflow-sdk-1.0.1.tgz
```

With:
```yaml
- name: Install AccessFlow SDK
  run: npm install @acsbe/accessflow-sdk@1.0.1
```

**Update `package.json`:**
```json
"devDependencies": {
  "@playwright/test": "^1.48.0",
  "@acsbe/accessflow-sdk": "^1.0.1"
}
```

Then just run `npm install` in the workflow.

### Option 2: Use GitHub Releases

Upload the SDK package as a release asset and download it in the workflow:

```yaml
- name: Download AccessFlow SDK
  run: |
    curl -L -o acsbe-accessflow-sdk-1.0.1.tgz \
      https://github.com/YOUR_ORG/YOUR_REPO/releases/download/v1.0.0/acsbe-accessflow-sdk-1.0.1.tgz

- name: Install AccessFlow SDK
  run: npm install ./acsbe-accessflow-sdk-1.0.1.tgz
```

### Option 3: Use Private npm Registry

If you have a private npm registry:

```yaml
- name: Setup npm registry
  run: |
    echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc

- name: Install AccessFlow SDK
  run: npm install @acsbe/accessflow-sdk@1.0.1
```

### Option 4: Store in Artifacts

Store the SDK in GitHub Actions artifacts (not recommended for dependencies):

1. Create a setup workflow that uploads the SDK
2. Download it in test workflows

### Option 5: Use Git LFS (Large File Storage)

If the file is large:

```bash
git lfs track "*.tgz"
git add .gitattributes
git add acsbe-accessflow-sdk-1.0.1.tgz
git commit -m "Add SDK via Git LFS"
git push
```

## Recommended Quick Fix

**For now, just install from npm if available:**

Edit `.github/workflows/accessibility-tests.yml` and `.github/workflows/scheduled-audit.yml`:

```yaml
- name: Install dependencies
  run: npm install

- name: Install AccessFlow SDK from npm
  run: npm install @acsbe/accessflow-sdk@1.0.1
```

Or if you need to use the local package, commit it properly:

```bash
# Update .gitignore to allow the SDK
git add -f acsbe-accessflow-sdk-1.0.1.tgz
git commit -m "Add AccessFlow SDK package"
git push
```

## Test Locally

Before pushing, test the SDK installation:

```bash
# Remove node_modules
rm -rf node_modules package-lock.json

# Install from npm (if available)
npm install @acsbe/accessflow-sdk@1.0.1

# Or from local file
npm install ./acsbe-accessflow-sdk-1.0.1.tgz

# Run tests
npm test
```

## Which Option Should You Use?

- **Use Option 1** if SDK is on npm (easiest)
- **Use Option 5** if file is large and must be in repo
- **Use Option 2** if you want version control without repo bloat
- **Use Option 3** if you have private npm registry access

Choose the option that best fits your workflow!
