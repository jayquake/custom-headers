# Custom Headers Testing Tool - Setup Guide

## Overview

This is a custom headers validation tool built to test the **accessFlow scanner** configuration. The tool validates that incoming HTTP requests contain three specific headers with exact values before granting access to the protected page.

**Website URL:** `https://custom-headers-validator.custom-headers-validator.workers.dev`

---

## How It Works

### ✅ Correct Headers → Access Granted

When you send a request with the **correct header values**, you'll see a beautiful success page with:
- Green gradient background
- "Access Granted!" message
- List of validated headers
- Confirmation that all required headers were verified

### ❌ Incorrect Headers → Access Denied

When you send a request with **incorrect or missing headers**, you'll see a 403 error page with:
- Red gradient background
- "403 Forbidden" message
- List of required headers
- Information about what's missing or invalid

---

## Required Headers

The tool requires these **exact** header key-value pairs:

| Header Name | Required Value |
|-------------|----------------|
| `Signature-Input` | `This` |
| `Signature` | `Should` |
| `Signature-Agent` | `Work` |

> **Important:** Both the header names AND values must match exactly (case-sensitive for values).

---

## Testing the Tool

### Method 1: Using cURL

**Test with correct values (should succeed):**

```bash
curl https://custom-headers-validator.custom-headers-validator.workers.dev \
  -H "Signature-Input: This" \
  -H "Signature: Should" \
  -H "Signature-Agent: Work"
```

**Expected result:** You'll see HTML content with "Access Granted!" message.

---

**Test with incorrect values (should fail):**

```bash
curl https://custom-headers-validator.custom-headers-validator.workers.dev \
  -H "Signature-Input: wrong" \
  -H "Signature: values" \
  -H "Signature-Agent: here"
```

**Expected result:** You'll see a 403 error page explaining the headers are invalid.

---

**Test without headers (should fail):**

```bash
curl https://custom-headers-validator.custom-headers-validator.workers.dev
```

**Expected result:** You'll see a 403 error page explaining the headers are missing.

---

### Method 2: Using Browser Extension

#### Step 1: Install a Header Extension

Install one of these browser extensions:
- **ModHeader** (Chrome/Firefox): [https://modheader.com/](https://modheader.com/)
- **Requestly** (Chrome/Firefox): [https://requestly.io/](https://requestly.io/)

#### Step 2: Configure Headers

Open the extension and add three request headers:

```
Signature-Input: This
Signature: Should
Signature-Agent: Work
```

#### Step 3: Visit the Site

1. Enable the headers in the extension
2. Visit: `https://custom-headers-validator.custom-headers-validator.workers.dev`
3. You should see the green success page

#### Step 4: Test Invalid Headers

1. Change one of the header values to something else
2. Refresh the page
3. You should see the red 403 error page

---

### Method 3: Using Postman

#### Step 1: Create New Request

1. Open Postman
2. Create a new **GET** request
3. Set URL to: `https://custom-headers-validator.custom-headers-validator.workers.dev`

#### Step 2: Add Headers

Go to the **Headers** tab and add:

| Key | Value |
|-----|-------|
| `Signature-Input` | `This` |
| `Signature` | `Should` |
| `Signature-Agent` | `Work` |

#### Step 3: Send Request

Click **Send** button

**Expected result:** Status 200 OK with success page HTML

#### Step 4: Test with Wrong Values

Change any header value and send again

**Expected result:** Status 403 Forbidden with error page

---

## Configuring accessFlow Scanner

### Step 1: Access Scanner Settings

1. Log into your **accessFlow** account
2. Navigate to your project/website settings
3. Look for **Custom Headers** or **HTTP Headers** configuration

### Step 2: Add Custom Headers

In the custom headers section, add the three required headers:

| Header Name | Header Value |
|-------------|-------------|
| `Signature-Input` | `This` |
| `Signature` | `Should` |
| `Signature-Agent` | `Work` |

### Step 3: Set Target URL

Set the scan target URL to:

```
https://custom-headers-validator.custom-headers-validator.workers.dev
```

### Step 4: Run Scan

1. Save your configuration
2. Start a new accessibility scan
3. Monitor the results

**Expected outcome:**
- ✅ Scanner should successfully access the page
- ✅ Scan should complete without 403 errors
- ✅ Scanner should crawl the success page content

**If scan fails:**
- ❌ Check that all three headers are configured
- ❌ Verify header values match exactly (case-sensitive)
- ❌ Confirm URL is correct

---

## Shopify Web Bot Auth Setup Guide

If you want to use **real Shopify Web Bot Auth** headers instead of the test values, follow this guide:

### What is Shopify Web Bot Auth?

Shopify's Web Bot Auth allows trusted automated tools (like accessibility scanners) to access your storefront content without being blocked by bot protection. When configured, Shopify generates three HTTP headers that must be included in scanner requests.

---

### Step 1: Access Shopify Admin

1. Log into your **Shopify store admin panel**
2. Navigate to **Online Store** in the left sidebar
3. Click on **Preferences**

---

### Step 2: Find Web Bot Auth Section

1. Scroll down to the **Web Bot Auth** or **Crawler Access** section
2. This section allows you to create signatures for trusted bots and scanners

> **Note:** If you don't see this section, your Shopify plan may not include this feature. Contact Shopify support for more information.

---

### Step 3: Create New Signature

1. Click the **"Create signature"** button
2. In the **Name** field, enter: `Accessibility Scanner` (or any descriptive name)
3. Click **Save** or **Create**

---

### Step 4: Copy Generated Headers

Shopify will generate three header values. Copy each one:

#### Generated Headers:

1. **Signature-Input**
   - Copy the long string value
   - Example format: `sig1=("@request-target" "host" "date");created=1234567890`

2. **Signature**
   - Copy the base64-encoded signature
   - Example format: `sig1=:AbCdEfGhIjKlMnOpQrStUvWxYz1234567890==:`

3. **Signature-Agent**
   - This should be set to: `accessFlow/1.0`
   - Or the name of your scanning tool

> **Security Note:** Keep these values secure! They grant access to your protected storefront content.

---

### Step 5: Update Your Worker Configuration

To use Shopify's real headers in your custom headers tool:

1. Open the `worker.js` file in your code editor
2. Find the `REQUIRED_HEADERS` section (around line 14)
3. Update the values to match your Shopify-generated headers:

```javascript
// Required headers with expected values
const REQUIRED_HEADERS = {
  'signature-input': 'YOUR_SHOPIFY_SIGNATURE_INPUT_VALUE',
  'signature': 'YOUR_SHOPIFY_SIGNATURE_VALUE',
  'signature-agent': 'accessFlow/1.0'
};
```

4. Save the file
5. Redeploy the worker:

```bash
wrangler deploy
```

---

### Step 6: Configure accessFlow with Shopify Headers

1. In **accessFlow scanner settings**, go to Custom Headers
2. Add the three headers with the values from Shopify:

| Header Name | Header Value |
|-------------|-------------|
| `Signature-Input` | *[paste from Shopify]* |
| `Signature` | *[paste from Shopify]* |
| `Signature-Agent` | `accessFlow/1.0` |

3. Set the target URL to your Cloudflare Worker
4. Run the scan

---

### Step 7: Test the Configuration

**Test 1: Without headers (should fail)**
```bash
curl https://custom-headers-validator.custom-headers-validator.workers.dev
```

**Test 2: With correct Shopify headers (should succeed)**
```bash
curl https://custom-headers-validator.custom-headers-validator.workers.dev \
  -H "Signature-Input: [YOUR_VALUE]" \
  -H "Signature: [YOUR_VALUE]" \
  -H "Signature-Agent: accessFlow/1.0"
```

---

### Shopify Web Bot Auth Resources

- **Official Documentation:** [https://help.shopify.com/en/manual/promoting-marketing/seo/crawling-your-store](https://help.shopify.com/en/manual/promoting-marketing/seo/crawling-your-store)
- **API Reference:** Shopify Admin API documentation
- **Support:** Contact Shopify Support for plan-specific questions

---

## Troubleshooting

### Issue: Getting 403 Error Even with Correct Headers

**Possible causes:**
1. Header values have extra spaces or special characters
2. Case sensitivity - values must match exactly
3. Headers not being sent by the tool/extension

**Solution:**
- Use `curl -v` to see exact headers being sent
- Copy-paste values directly (don't retype)
- Check for invisible characters

---

### Issue: accessFlow Scan Fails

**Possible causes:**
1. Custom headers not configured in accessFlow
2. Wrong URL in accessFlow settings
3. Headers not matching worker expectations

**Solution:**
- Review accessFlow custom headers configuration
- Verify URL is correct
- Test with cURL first to confirm headers work

---

### Issue: Worker Returns 500 Error

**Possible causes:**
1. Worker code has syntax error
2. GitHub Pages not accessible
3. Cloudflare Worker issue

**Solution:**
- Check worker logs: `wrangler tail`
- Verify GitHub Pages is live: visit directly
- Redeploy worker: `wrangler deploy`

---

## Technical Architecture

### Components

1. **GitHub Pages** (`https://jayquake.github.io/custom-headers`)
   - Hosts the HTML success page (`index.html`)
   - Static file hosting
   - No server-side logic

2. **Cloudflare Worker** (`https://custom-headers-validator.custom-headers-validator.workers.dev`)
   - Validates incoming request headers
   - Checks header presence AND values
   - Proxies valid requests to GitHub Pages
   - Returns 403 error for invalid requests

### Request Flow

```
User/Scanner Request
        ↓
Cloudflare Worker
        ↓
   [Validate Headers]
        ↓
    ┌───┴───┐
    ↓       ↓
Valid?   Invalid?
    ↓       ↓
GitHub   403
Pages    Error
```

---

## Repository Information

- **GitHub Repository:** [https://github.com/jayquake/custom-headers](https://github.com/jayquake/custom-headers)
- **Worker URL:** `https://custom-headers-validator.custom-headers-validator.workers.dev`
- **GitHub Pages:** `https://jayquake.github.io/custom-headers`

### Files Structure

```
custom-headers/
├── index.html       # Success page (green design)
├── 403.html         # Error page template (red design)
├── worker.js        # Cloudflare Worker with validation logic
├── wrangler.toml    # Cloudflare configuration
└── README.md        # Technical documentation
```

---

## Support & Contact

For issues or questions:
- **GitHub Issues:** [https://github.com/jayquake/custom-headers/issues](https://github.com/jayquake/custom-headers/issues)
- **Cloudflare Workers Docs:** [https://developers.cloudflare.com/workers/](https://developers.cloudflare.com/workers/)
- **accessFlow Support:** Contact your accessFlow account representative

---

## Quick Reference Card

### Current Configuration

| Setting | Value |
|---------|-------|
| **Worker URL** | `https://custom-headers-validator.custom-headers-validator.workers.dev` |
| **Header 1** | `Signature-Input: This` |
| **Header 2** | `Signature: Should` |
| **Header 3** | `Signature-Agent: Work` |
| **Success Status** | `200 OK` |
| **Failure Status** | `403 Forbidden` |

### Quick Test Command

```bash
# Copy and paste this to test:
curl https://custom-headers-validator.custom-headers-validator.workers.dev \
  -H "Signature-Input: This" \
  -H "Signature: Should" \
  -H "Signature-Agent: Work"
```

---

*Last updated: January 29, 2026*
