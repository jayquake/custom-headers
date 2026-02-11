import { AccessFlowSDK } from "@acsbe/accessflow-sdk";
import { expect, test } from "@playwright/test";

// Initialize AccessFlow SDK with API key
AccessFlowSDK.init({ apiKey: "flow-1AGHjOCaB9GYyaYtf6Q000Y1KygFymF5R4" });

test.describe("Simple Accessibility Tests", () => {
  test("should audit mock HTML page", async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);

    // Mock HTML content with common accessibility issues
    const mockHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mock Page for Accessibility Testing</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .low-contrast { color: #aaa; background: #fff; }
          .hidden-button { opacity: 0; position: absolute; }
        </style>
      </head>
      <body>
        <h1>Accessibility Test Page</h1>
        
        <!-- Missing alt text -->
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ccc' width='100' height='100'/%3E%3C/svg%3E">
        
        <!-- Low contrast text -->
        <p class="low-contrast">This text has poor contrast and may be hard to read.</p>
        
        <!-- Form without label -->
        <form>
          <input type="text" placeholder="Email">
          <button type="submit">Submit</button>
        </form>
        
        <!-- Missing navigation landmark -->
        <div>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        
        <!-- Hidden interactive element -->
        <button class="hidden-button" tabindex="0">Hidden Button</button>
        
        <!-- Proper heading structure violation -->
        <h3>Skipped h2 heading</h3>
        <h4>This should cause a heading order issue</h4>
        
        <!-- Good examples -->
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%2300f' width='100' height='100'/%3E%3C/svg%3E" alt="Blue square">
        
        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
        </nav>
        
        <form>
          <label for="name">Name:</label>
          <input type="text" id="name">
          <button type="submit">Send</button>
        </form>
      </body>
      </html>
    `;

    // Set the mock HTML content
    await page.setContent(mockHTML);
    
    // Wait a moment for the page to stabilize
    await page.waitForTimeout(500);

    // Run accessibility audit
    console.log("Running accessibility audit on mock HTML...");
    const audits = await sdk.audit();
    
    // Generate HTML report
    const summary = sdk.generateReport(audits, 'html');
    
    // Log results
    console.log("Accessibility Audit Complete!");
    console.log("Issues found by severity:");
    console.log(`  - Extreme: ${summary.numberOfIssuesFound?.extreme || 0}`);
    console.log(`  - High: ${summary.numberOfIssuesFound?.high || 0}`);
    console.log(`  - Medium: ${summary.numberOfIssuesFound?.medium || 0}`);
    console.log(`  - Low: ${summary.numberOfIssuesFound?.low || 0}`);

    // Assert that the audit completed
    expect(audits).toBeTruthy();
    expect(summary).toBeTruthy();
    expect(summary.numberOfIssuesFound).toBeDefined();
  });

  test("should audit simple valid HTML", async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);

    // Simple, mostly accessible HTML
    const simpleHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple Accessible Page</title>
      </head>
      <body>
        <header>
          <h1>Welcome</h1>
          <nav aria-label="Main navigation">
            <a href="#home">Home</a>
            <a href="#about">About</a>
          </nav>
        </header>
        
        <main>
          <h2>About Us</h2>
          <p>This is a simple, accessible page.</p>
          
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3C/svg%3E" alt="Logo">
          
          <form>
            <label for="email">Email:</label>
            <input type="email" id="email" required>
            <button type="submit">Subscribe</button>
          </form>
        </main>
        
        <footer>
          <p>&copy; 2026 Test Company</p>
        </footer>
      </body>
      </html>
    `;

    await page.setContent(simpleHTML);
    await page.waitForTimeout(500);

    console.log("Running audit on simple HTML...");
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'html');

    console.log("Simple HTML Audit Results:");
    console.log(`  - Extreme: ${summary.numberOfIssuesFound?.extreme || 0}`);
    console.log(`  - High: ${summary.numberOfIssuesFound?.high || 0}`);
    console.log(`  - Medium: ${summary.numberOfIssuesFound?.medium || 0}`);
    console.log(`  - Low: ${summary.numberOfIssuesFound?.low || 0}`);

    expect(audits).toBeTruthy();
    expect(summary).toBeTruthy();
  });
});
