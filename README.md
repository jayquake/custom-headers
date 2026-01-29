# Custom Headers Testing Tool

A testing tool for validating HTTP header requirements using Cloudflare Workers and GitHub Pages. This tool requires three specific headers to be present in requests before granting access.

## Overview

This project demonstrates server-side header validation for testing tools like accessFlow scanner. The worker validates that requests include three specific headers with exact values:

- **`Signature-Input`** must equal: `This`
- **`Signature`** must equal: `Should`
- **`Signature-Agent`** must equal: `Work`

**Important**: The worker validates both header presence AND values. Requests with missing or incorrect header values will receive a 403 Forbidden error.

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

## Deployment

### Step 1: Deploy to GitHub Pages

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Select **main** branch and **/ (root)** folder
   - Click **Save**

3. **Note your GitHub Pages URL**:
   - Your site will be available at: `https://jayquake.github.io/custom-headers`
   - Wait a few minutes for the initial deployment

### Step 2: Configure the Worker

1. **Verify the GitHub Pages URL** in `worker.js`:
   ```javascript
   const GITHUB_PAGES_URL = 'https://jayquake.github.io/custom-headers';
   ```
   This is already configured for your repository.

2. **Optional: Update worker name** in `wrangler.toml`:
   ```toml
   name = "custom-headers-validator"
   ```

### Step 3: Deploy the Cloudflare Worker

```bash
wrangler deploy
```

After deployment, you'll see output like:
```
Deployed custom-headers-validator
  https://custom-headers-validator.YOUR-SUBDOMAIN.workers.dev
```

Your worker is now live!

### Step 4: Configure Cloudflare Protection Settings (Optional)

To enhance security and protection for your worker:

1. **Access Cloudflare Dashboard**:
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** → **Overview**
   - Click on your worker: `custom-headers-validator`

2. **Configure Worker Settings**:
   - Click on **Settings** tab
   - Under **General**, review:
     - **Usage Model**: Leave as default (Standard)
     - **Compatibility Date**: Set to latest date
   
3. **Set Up Rate Limiting** (Recommended):
   - Go to **Security** → **WAF**
   - Create a rate limiting rule to prevent abuse:
     - Rule name: `Header validator rate limit`
     - When incoming requests match: `URI Path contains /`
     - Then: Rate limit
     - Requests: `100` requests per `1 minute`
     - Action: `Block`

4. **Enable Bot Protection** (Optional):
   - Go to **Security** → **Bots**
   - Enable **Bot Fight Mode** (free) or **Super Bot Fight Mode** (paid)
   - This adds an extra layer of protection against automated attacks

5. **Configure CORS** (if needed for browser-based tools):
   - Edit `worker.js` to add CORS headers if your scanner uses browser requests
   - See customization section below for details

## Configuring Headers for Testing Tools

### For accessFlow Scanner

To configure the accessFlow scanner or any testing tool to use the required headers:

#### Step 1: Generate Shopify Web Bot Auth Headers

If you're testing with Shopify Web Bot Auth:

1. **Log in to Shopify Admin**:
   - Go to your Shopify store admin panel
   - Navigate to **Online Store** → **Preferences**

2. **Create Web Bot Auth Signature**:
   - Scroll to **Web Bot Auth** or **Crawler Access** section
   - Click **Create signature**
   - Name: `accessFlow Scanner` (or any descriptive name)
   - Click **Save**

3. **Copy the Generated Headers**:
   Shopify will generate three values:
   - `Signature-Input`: Copy this value
   - `Signature`: Copy this value  
   - `Signature-Agent`: This should be set to `accessFlow/1.0`

   Keep these values secure as they grant access to your protected content.

#### Step 2: Configure Your Testing Tool

Depending on your tool, configure it to send the three headers:

**For accessFlow Scanner:**
1. Open accessFlow scanner settings
2. Navigate to **Custom Headers** or **HTTP Headers** section
3. Add three headers:
   - **Header 1**: 
     - Key: `Signature-Input`
     - Value: `[paste from Shopify]`
   - **Header 2**:
     - Key: `Signature`
     - Value: `[paste from Shopify]`
   - **Header 3**:
     - Key: `Signature-Agent`
     - Value: `accessFlow/1.0`
4. Save configuration
5. Point the scanner URL to: `https://custom-headers-validator.YOUR-SUBDOMAIN.workers.dev`

**For Browser Extensions (ModHeader, Requestly):**

1. **Install Extension**:
   - [ModHeader](https://modheader.com/) (Chrome/Firefox)
   - [Requestly](https://requestly.io/) (Chrome/Firefox)

2. **Configure Headers**:
   - Open extension settings
   - Add three request headers:
     ```
     Signature-Input: [your-value]
     Signature: [your-value]
     Signature-Agent: accessFlow/1.0
     ```

3. **Enable and Test**:
   - Enable the headers
   - Visit your worker URL
   - You should see the success page

**For cURL Testing:**

```bash
curl -i https://custom-headers-validator.YOUR-SUBDOMAIN.workers.dev \
  -H "Signature-Input: YOUR_SIGNATURE_INPUT_VALUE" \
  -H "Signature: YOUR_SIGNATURE_VALUE" \
  -H "Signature-Agent: accessFlow/1.0"
```

**For Postman:**

1. Open Postman
2. Create a new request
3. Set URL: `https://custom-headers-validator.YOUR-SUBDOMAIN.workers.dev`
4. Go to **Headers** tab
5. Add three headers:
   - `Signature-Input`: `[your-value]`
   - `Signature`: `[your-value]`
   - `Signature-Agent`: `accessFlow/1.0`
6. Click **Send**

#### Step 3: Verify Configuration

After configuring headers:

1. **Test without headers first**:
   - Should return 403 error
   - Confirms worker is active and validating

2. **Test with headers**:
   - Should return 200 success
   - Should display the success page
   - Confirms headers are configured correctly

3. **Check response headers**:
   - Look for `X-Custom-Headers-Validated: true`
   - Look for `X-Validated-Headers: signature-input, signature, signature-agent`
   - These confirm the worker validated your headers

## Testing

### Test Without Headers (Should Fail)

```bash
curl -i https://custom-headers-validator.YOUR-SUBDOMAIN.workers.dev
```

Expected: **403 Forbidden** with error page explaining missing headers.

### Test With Headers (Should Succeed)

```bash
curl -i https://custom-headers-validator.YOUR-SUBDOMAIN.workers.dev \
  -H "Signature-Input: sig1=(\"@request-target\" \"host\" \"date\");created=1234567890" \
  -H "Signature: sig1=:base64encodedvalue:" \
  -H "Signature-Agent: accessFlow/1.0"
```

Expected: **200 OK** with the success page from GitHub Pages.

### Test in Browser

1. **Without headers**: Visit your worker URL directly
   - You should see the 403 error page

2. **With headers**: Use a browser extension like [ModHeader](https://modheader.com/) or [Requestly](https://requestly.io/):
   - Add the three required headers
   - Visit your worker URL
   - You should see the success page

## Quick Start Guide for accessFlow Scanner

Here's a step-by-step guide to test the accessFlow scanner:

### 1. Generate Shopify Headers

In your Shopify admin:
- **Online Store** → **Preferences** → **Web Bot Auth**
- Click **Create signature** → Name it "accessFlow Scanner"
- Copy the three generated values

### 2. Configure accessFlow

In accessFlow scanner settings:
- Add custom headers with the three values from Shopify
- Set target URL to your worker: `https://custom-headers-validator.YOUR-SUBDOMAIN.workers.dev`

### 3. Run Test Scan

- Start the accessFlow scan
- Monitor results:
  - ✅ **Success**: Scanner reaches the page and can crawl content
  - ❌ **Failure**: Check header configuration, ensure all three are present

### 4. Verify Results

Check the scan output:
- Should show 200 status code
- Should crawl the success page content
- No 403 errors in the log

## Project Structure

```
custom-headers/
├── index.html       # Success page (served by GitHub Pages)
├── 403.html         # Error page template (reference only)
├── worker.js        # Cloudflare Worker with header validation
├── wrangler.toml    # Cloudflare Worker configuration
└── README.md        # This file
```

## How It Works

1. **Request arrives** at the Cloudflare Worker
2. **Worker validates** that all three headers are present:
   - `Signature-Input`
   - `Signature`
   - `Signature-Agent`
3. **If headers are missing**:
   - Returns 403 Forbidden
   - Shows error page with missing header details
4. **If all headers are present**:
   - Proxies request to GitHub Pages
   - Returns the success page
   - Adds custom headers indicating validation passed

## Customization

### Change Required Headers

Edit the `REQUIRED_HEADERS` array in `worker.js`:

```javascript
const REQUIRED_HEADERS = [
  'your-custom-header-1',
  'your-custom-header-2',
  'your-custom-header-3'
];
```

### Add Header Value Validation

To validate specific header values (not just presence), modify the `handleRequest` function:

```javascript
// Example: Validate Signature-Agent must equal specific value
const signatureAgent = request.headers.get('signature-agent');
if (signatureAgent !== 'accessFlow/1.0') {
  return create403Response(['signature-agent (invalid value)']);
}
```

### Add CORS Support

If your testing tool makes browser-based requests, add CORS headers in `worker.js`:

```javascript
// Add this to the proxyToGitHubPages function
newResponse.headers.set('Access-Control-Allow-Origin', '*');
newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
newResponse.headers.set('Access-Control-Allow-Headers', 'Signature-Input, Signature, Signature-Agent');
```

### Custom Domain

To use a custom domain:

1. Add your domain to Cloudflare
2. Update `wrangler.toml`:
   ```toml
   routes = [
     { pattern = "headers.example.com/*", zone_name = "example.com" }
   ]
   ```
3. Redeploy: `wrangler deploy`

### Environment Variables for Headers

To make header configuration easier, use Wrangler secrets:

```bash
# Set expected header values as secrets
wrangler secret put EXPECTED_SIGNATURE_AGENT
# Enter: accessFlow/1.0 when prompted

# Then update worker.js to use:
const expectedAgent = env.EXPECTED_SIGNATURE_AGENT || 'accessFlow/1.0';
```

## Troubleshooting

### Worker returns "Error proxying to GitHub Pages"

- Verify your `GITHUB_PAGES_URL` in `worker.js` is correct
- Ensure GitHub Pages is fully deployed (check repository Settings → Pages)
- Try accessing the GitHub Pages URL directly in a browser

### "Account ID required" error when deploying

Run `wrangler whoami` to see your account details, then add to `wrangler.toml`:
```toml
account_id = "your-account-id-here"
```

### Changes not reflecting after deployment

- Clear browser cache or test in incognito mode
- Cloudflare Workers have edge caching; wait a few seconds
- Check you're accessing the correct worker URL

## Monitoring and Debugging

### View Worker Logs

To see real-time logs from your worker:

```bash
wrangler tail
```

This shows:
- Incoming requests
- Header validation results
- Errors or issues
- Response status codes

### Cloudflare Dashboard Analytics

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → Your worker
3. Click **Metrics** tab to see:
   - Request count
   - Error rate
   - Response times
   - Geographic distribution

### Debug Failed Requests

If requests are failing:

1. **Check Worker Logs**:
   ```bash
   wrangler tail --format pretty
   ```

2. **Verify Headers Are Sent**:
   ```bash
   curl -v https://custom-headers-validator.YOUR-SUBDOMAIN.workers.dev \
     -H "Signature-Input: test" \
     -H "Signature: test" \
     -H "Signature-Agent: test"
   ```
   
   Look for the headers in the verbose output (lines starting with `>`)

3. **Check Response Headers**:
   ```bash
   curl -I https://custom-headers-validator.YOUR-SUBDOMAIN.workers.dev
   ```
   
   Look for `X-Custom-Headers-Required` header in 403 responses

### Enable Detailed Logging

Add console logs to `worker.js` for debugging:

```javascript
async function handleRequest(request) {
  // Log all incoming headers
  console.log('Incoming headers:', Object.fromEntries(request.headers));
  
  // Validate required headers
  const missingHeaders = [];
  for (const header of REQUIRED_HEADERS) {
    const value = request.headers.get(header);
    console.log(`Checking header ${header}:`, value ? 'Present' : 'Missing');
    if (!value) {
      missingHeaders.push(header);
    }
  }
  
  // ... rest of function
}
```

Then watch logs with `wrangler tail` while testing.

## Development

To test the worker locally:

```bash
wrangler dev
```

This starts a local development server at `http://localhost:8787`. 

**Note**: You'll need to update the GitHub Pages URL or use the local HTML files to test the full proxy flow.

To test with local HTML files:

```bash
# Serve the HTML files locally
npx serve . -p 3000

# Update worker.js temporarily
const GITHUB_PAGES_URL = 'http://localhost:3000';

# Run worker in dev mode
wrangler dev
```

## Security Note

This tool is designed for **testing purposes** to validate that scanners and tools can properly send required headers. It validates header *presence* but does not validate cryptographic signatures or implement full security measures.

For production use with actual authentication:
- Validate header values and signatures
- Implement rate limiting
- Add logging and monitoring
- Use environment variables for sensitive configuration

## License

MIT License - Feel free to use and modify for your needs.

## Support

For issues or questions:
- Check Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
- GitHub Pages documentation: https://docs.github.com/pages
- Open an issue in this repository

## Related Resources

- [Shopify Web Bot Auth Documentation](https://help.shopify.com/en/manual/promoting-marketing/seo/crawling-your-store)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
