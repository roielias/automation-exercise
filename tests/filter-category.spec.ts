import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ClickHandlerChain } from "../clickHandlerChain";

test.describe.configure({ timeout: 60000 });

test("dynamically filters all categories and validates product visibility", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const clickChain = new ClickHandlerChain();

  await homePage.navigate();

  const parentCategories = page.locator("#accordian > .panel");
  const parentCount = await parentCategories.count();

  for (let i = 0; i < parentCount; i++) {
    const parent = parentCategories.nth(i);
    const parentName =
      (await parent.locator("a").first().textContent())?.trim() || "Unknown";

    const subCategories = parent.locator(".panel-collapse a");
    const subCount = await subCategories.count();

    for (let j = 0; j < subCount; j++) {
      await homePage.navigate();

      const currentParent = page.locator("#accordian > .panel").nth(i);
      const categoryLink = currentParent.locator("a").first();

      let success = false;
      if (await categoryLink.isVisible()) {
        success = await clickChain.clickWithTimeout(categoryLink, 10000);
      } else {
        try {
          await categoryLink.click({ force: true });
          success = true;
        } catch {
          success = await clickChain.clickWithTimeout(categoryLink, 10000);
        }
      }

      if (!success) {
        throw new Error(`Failed to click parent category: ${parentName}`);
      }

      await expect(currentParent.locator(".panel-collapse")).toHaveClass(/in/);

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

      await page.waitForSelector(".productinfo > p", { state: "visible" });

      const titles = await homePage.getVisibleProductsTitles();

      expect(titles.length).toBeGreaterThan(0);
    }
  }
});
