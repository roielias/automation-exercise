import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

/**
 * Navigation test suite for top navigation functionality
 *
 * Validates that all primary navigation links work correctly
 * and lead to their expected destination pages with proper content
 */
test("top nav buttons navigate correctly", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();

  /**
   * Configuration array defining navigation links and their expected page indicators
   * Each entry contains:
   * - name: The link text to click
   * - selector: CSS selector to verify correct page load
   */
  const topNavLinks = [
    { name: "Home", selector: "#slider" },
    { name: "Products", selector: "h2:has-text('All Products')" },
    { name: "Cart", selector: "li.active:has-text('Shopping Cart')" },
    {
      name: "Signup / Login",
      selector: "h2:has-text('Login to your account')",
    },
    { name: "Test Cases", selector: 'a[href="/test_cases"]' },
    { name: "Contact us", selector: "h2:has-text('Get In Touch')" },
  ];

  // Test each navigation link
  for (const { name, selector } of topNavLinks) {
    // Click navigation link
    await homePage.clickTopNavLink(name);

    // Verify correct page loaded by checking for expected content
    await expect(page.locator(selector).first()).toBeVisible({
      timeout: 10000,
    });

    // Return to home page for next iteration
    await homePage.navigate();
  }
});
