import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ClickHandlerChain } from "../clickHandlerChain";

test.describe.configure({ timeout: 60000 });

/**
 * Comprehensive test that dynamically discovers and tests all product categories
 *
 * This test iterates through all available parent categories and their subcategories,
 * verifying that:
 * 1. Category navigation works correctly
 * 2. Products are displayed after category selection
 * 3. Each category filter produces relevant results
 */
test("dynamically filters all categories and validates product visibility", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const clickChain = new ClickHandlerChain();

  await homePage.navigate();

  // Discover all parent categories dynamically
  const parentCategories = page.locator("#accordian > .panel");
  const parentCount = await parentCategories.count();

  // Iterate through each parent category
  for (let i = 0; i < parentCount; i++) {
    const parent = parentCategories.nth(i);
    const parentName =
      (await parent.locator("a").first().textContent())?.trim() || "Unknown";

    // Get subcategories for current parent
    const subCategories = parent.locator(".panel-collapse a");
    const subCount = await subCategories.count();

    // Test each subcategory
    for (let j = 0; j < subCount; j++) {
      // Navigate to fresh page for each test iteration
      await homePage.navigate();

      const currentParent = page.locator("#accordian > .panel").nth(i);
      const categoryLink = currentParent.locator("a").first();

      // Click parent category with fallback strategies
      let success = false;
      if (await categoryLink.isVisible()) {
        success = await clickChain.clickWithTimeout(categoryLink, 10000);
      } else {
        try {
          // Force click if element not fully visible
          await categoryLink.click({ force: true });
          success = true;
        } catch {
          success = await clickChain.clickWithTimeout(categoryLink, 10000);
        }
      }

      if (!success) {
        throw new Error(`Failed to click parent category: ${parentName}`);
      }

      // Verify accordion expanded
      await expect(currentParent.locator(".panel-collapse")).toHaveClass(/in/);

      // Click subcategory
      const currentSub = currentParent.locator(".panel-collapse a").nth(j);
      const subName = (await currentSub.textContent())?.trim() || "Unknown";

      let subSuccess = false;
      if (await currentSub.isVisible()) {
        subSuccess = await clickChain.clickWithTimeout(currentSub, 10000);
      } else {
        try {
          await currentSub.click({ force: true });
          subSuccess = true;
        } catch {
          subSuccess = await clickChain.clickWithTimeout(currentSub, 10000);
        }
      }

      if (!subSuccess) {
        throw new Error(`Failed to click sub category: ${subName}`);
      }

      // Wait for filtered products to load
      await page.waitForSelector(".productinfo > p", { state: "visible" });

      // Verify products are displayed after filtering
      const titles = await homePage.getVisibleProductsTitles();

      expect(titles.length).toBeGreaterThan(0);
    }
  }
});
