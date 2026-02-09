import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for AccessFlow SDK testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  // Maximum time one test can run for
  timeout: 30 * 1000,
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['list']
  ],
  
  // Output directory for test artifacts
  outputDir: './test-results',
  
  // AccessFlow SDK global teardown
  globalTeardown: '@acsbe/accessflow-sdk/dist/src/playwright/global-teardown',
  
  // Shared settings for all projects
  use: {
    // Base URL for your application
    baseURL: 'http://localhost:8787',
    
    // Custom headers required by the Cloudflare Worker
    extraHTTPHeaders: {
      'Signature-Input': 'This',
      'Signature': 'Should',
      'Signature-Agent': 'Work'
    },
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Run your local dev server before starting the tests
  // Uncomment if you need to start a dev server
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:8787',
  //   reuseExistingServer: !process.env.CI,
  // },
});
