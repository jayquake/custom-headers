/**
 * Cloudflare Worker - Custom Headers Validator
 * 
 * This worker validates that incoming requests contain the required
 * Shopify Web Bot Auth headers before proxying to GitHub Pages.
 * 
 * Required Headers:
 * - Signature-Input
 * - Signature
 * - Signature-Agent
 */

// Configuration
const GITHUB_PAGES_URL = 'https://jayquake.github.io/custom-headers';

// Required headers (case-insensitive)
const REQUIRED_HEADERS = [
  'signature-input',
  'signature',
  'signature-agent'
];

/**
 * Main request handler
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Handle incoming requests
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to send back
 */
async function handleRequest(request) {
  // Validate required headers
  const missingHeaders = [];
  
  for (const header of REQUIRED_HEADERS) {
    if (!request.headers.get(header)) {
      missingHeaders.push(header);
    }
  }
  
  // If any headers are missing, return 403
  if (missingHeaders.length > 0) {
    return create403Response(missingHeaders);
  }
  
  // All headers present - proxy to GitHub Pages
  return proxyToGitHubPages(request);
}

/**
 * Create a 403 Forbidden response
 * @param {Array<string>} missingHeaders - List of missing headers
 * @returns {Response} - 403 response with error page
 */
function create403Response(missingHeaders) {
  const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 Forbidden - Custom Headers Required</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 48px;
            max-width: 600px;
            width: 100%;
            text-align: center;
        }
        
        .error-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: shake 0.5s ease-out;
        }
        
        .error-icon svg {
            width: 48px;
            height: 48px;
            stroke: white;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        h1 {
            color: #1f2937;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .error-code {
            color: #ef4444;
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 16px;
        }
        
        .subtitle {
            color: #6b7280;
            font-size: 18px;
            margin-bottom: 32px;
            line-height: 1.6;
        }
        
        .info-box {
            background: #fef2f2;
            border: 2px solid #fecaca;
            border-radius: 8px;
            padding: 24px;
            margin-top: 32px;
            text-align: left;
        }
        
        .info-box h2 {
            color: #991b1b;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        
        .header-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #fecaca;
        }
        
        .header-item:last-child {
            border-bottom: none;
        }
        
        .header-name {
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
            font-family: 'Courier New', monospace;
        }
        
        .header-status {
            color: #dc2626;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .x-mark {
            width: 16px;
            height: 16px;
            background: #dc2626;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .x-mark::after {
            content: '✕';
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        
        .code-box {
            background: #1f2937;
            color: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            margin-top: 24px;
            text-align: left;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.8;
            overflow-x: auto;
        }
        
        .code-box .comment {
            color: #9ca3af;
        }
        
        .footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 14px;
        }
        
        .badge {
            display: inline-block;
            background: #fee2e2;
            color: #991b1b;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 16px;
        }
        
        .missing {
            color: #dc2626;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        </div>
        
        <div class="error-code">403</div>
        <h1>Access Denied</h1>
        <p class="subtitle">
            This page requires specific HTTP headers to access. Your request is missing <span class="missing">${missingHeaders.length}</span> required ${missingHeaders.length === 1 ? 'header' : 'headers'}.
        </p>
        
        <div class="info-box">
            <h2>Missing Headers</h2>
            ${REQUIRED_HEADERS.map(header => {
              const isMissing = missingHeaders.includes(header);
              return `
              <div class="header-item">
                  <span class="header-name">${header}</span>
                  <span class="header-status">
                      ${isMissing ? '<span class="x-mark"></span> Missing' : 'Present'}
                  </span>
              </div>`;
            }).join('')}
        </div>
        
        <div class="code-box">
            <span class="comment"># Example request with required headers:</span><br>
            curl https://${new URL(request.url).host} \\<br>
            &nbsp;&nbsp;-H "Signature-Input: your-value" \\<br>
            &nbsp;&nbsp;-H "Signature: your-signature" \\<br>
            &nbsp;&nbsp;-H "Signature-Agent: your-agent"
        </div>
        
        <div class="badge">
            Custom Headers Testing Tool
        </div>
        
        <div class="footer">
            This page is protected by Cloudflare Workers header validation.<br>
            Please ensure all required headers are included in your request.
        </div>
    </div>
</body>
</html>`;

  return new Response(errorHtml, {
    status: 403,
    statusText: 'Forbidden',
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'X-Custom-Headers-Required': REQUIRED_HEADERS.join(', '),
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

/**
 * Proxy request to GitHub Pages
 * @param {Request} request - The original request
 * @returns {Response} - The proxied response from GitHub Pages
 */
async function proxyToGitHubPages(request) {
  try {
    // Build the GitHub Pages URL
    const url = new URL(request.url);
    const githubUrl = new URL(GITHUB_PAGES_URL);
    
    // Preserve the path and query string
    githubUrl.pathname = url.pathname;
    githubUrl.search = url.search;
    
    // Fetch from GitHub Pages
    const response = await fetch(githubUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    
    // Create new response with modified headers
    const newResponse = new Response(response.body, response);
    
    // Add custom header to indicate validation passed
    newResponse.headers.set('X-Custom-Headers-Validated', 'true');
    newResponse.headers.set('X-Validated-Headers', REQUIRED_HEADERS.join(', '));
    
    return newResponse;
    
  } catch (error) {
    // If GitHub Pages is unreachable, return error
    return new Response(
      `Error proxying to GitHub Pages: ${error.message}`,
      {
        status: 502,
        statusText: 'Bad Gateway',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8'
        }
      }
    );
  }
}
