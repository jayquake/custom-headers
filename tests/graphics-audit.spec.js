import { AccessFlowSDK } from "@acsbe/accessflow-sdk";
import { expect, test } from "@playwright/test";

// Initialize AccessFlow SDK with API key
AccessFlowSDK.init({ apiKey: "flow-1roexmm1vA4hOaYnisQ000or0rx7xtYID0" });

test.describe("Graphics Audit Tests with SDK", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app home page before each test
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Allow React to fully render
    await page.waitForTimeout(1000);
  });

  test("should perform audits across multiple states on background images page", async ({
    page,
  }, testInfo) => {
    const auditResults = [];
    const sdk = new AccessFlowSDK(page, testInfo);

    // Helper to perform audit and store result
    const performAudit = async (context) => {
      console.log(`Starting audit for context: ${context}`);
      const audits = await sdk.audit();
      const summary = sdk.generateReport(audits, 'html');
      auditResults.push({ context, audits, summary });
      expect(audits).toBeTruthy();
      console.log(`Audit completed for ${context}`);
      console.log(`Issues found:`, summary.numberOfIssuesFound);
    }; // 1. Navigate to Graphics page
    const graphicsLink = page.locator('a[href="#/graphics"]').first();
    await expect(graphicsLink).toBeVisible();
    await graphicsLink.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // 2. Navigate to Background Images details
    const backgroundImagesLink = page.locator(
      'a[href="#/graphics/background-images"]',
    );
    await expect(backgroundImagesLink).toBeVisible();
    await backgroundImagesLink.dispatchEvent("click");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // 3. Navigate to Failure Examples
    const failureLink = page.locator(
      'a[href="#/graphics/background-images_failure"]',
    );
    await expect(failureLink).toBeVisible();
    await failureLink.dispatchEvent("click");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*graphics\/background-images_failure/);

    // State 1: Initial Load (Failure Page)
    await performAudit("Initial Failure Page");

    // State 2: Open Modal (Notifications)
    // Finding the notification button by the icon.
    // Assuming standard MUI structure where icons often have data-testid or are SVG paths.
    // We'll look for the button containing the specific icon.
    const notificationButton = page
      .locator("button")
      .filter({ has: page.locator('svg[data-testid="NotificationsIcon"]') })
      .first();
    if (await notificationButton.isVisible()) {
      await notificationButton.click();
      await page.waitForTimeout(500); // Wait for modal to appear
      await performAudit("Notifications Modal Open");

      // Close modal by pressing escape
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    } else {
      console.log("Notification button not found, skipping modal audit");
    }

    // State 3: Expand/Collapse Elements (Sidebar)
    // The sidebar is initially open. We look for the ChevronLeftIcon which closes it.
    const closeSidebarButton = page
      .locator("button")
      .filter({ has: page.locator('svg[data-testid="ChevronLeftIcon"]') })
      .first();

    if (await closeSidebarButton.isVisible()) {
      // Collapse Sidebar
      await closeSidebarButton.click();
      await page.waitForTimeout(500); // Wait for animation
      await performAudit("Sidebar Collapsed");

      // Re-expand Sidebar
      // The button icon changes to MenuIcon when collapsed
      const openSidebarButton = page
        .locator("button")
        .filter({ has: page.locator('svg[data-testid="MenuIcon"]') })
        .first();
      if (await openSidebarButton.isVisible()) {
        await openSidebarButton.click();
        await page.waitForTimeout(500);
        await performAudit("Sidebar Expanded");
      }
    } else {
      console.log("Sidebar toggle not found, skipping sidebar audit");
    }

    // State 4: Navigate Routes (Go to Success Page)
    // We need to navigate to the sibling route.
    // We can try to find the link on the parent page or use direct navigation if links aren't visible in current view.
    // Going back to parent listing usually exposes the links.
    await page.goto("#/graphics/background-images");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const successLink = page.locator(
      'a[href="#/graphics/background-images_success"]',
    );
    if (await successLink.isVisible()) {
      await successLink.dispatchEvent("click");
    } else {
      console.log("Success link not visible, trying direct navigation");
      await page.goto("#/graphics/background-images_success");
    }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*graphics\/background-images_success/);

    await performAudit("Success Page");

    // Verification
    console.log("Total audits performed:", auditResults.length);
    expect(auditResults.length).toBeGreaterThan(1);

    // Optional: Compare results if needed
    // For example, check if violations count differs between states
    const issueSummary = auditResults.map((r) => ({
      context: r.context,
      extreme: r.summary?.numberOfIssuesFound?.extreme || 0,
      high: r.summary?.numberOfIssuesFound?.high || 0,
      medium: r.summary?.numberOfIssuesFound?.medium || 0,
      low: r.summary?.numberOfIssuesFound?.low || 0,
    }));
    console.log(
      "Issues by context:",
      JSON.stringify(issueSummary, null, 2),
    );
  });
});
