import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
test.describe.configure({ timeout: 60000 });
test("dynamically filters all categories and validates product visibility", async ({
  page,
}) => {
  const homePage = new HomePage(page);
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

      console.log(`🧪 Testing parent category: ${parentName}`);

      if (await categoryLink.isVisible()) {
        await categoryLink.click();
      } else {
        await categoryLink.click({ force: true });
      }

      await expect(currentParent.locator(".panel-collapse")).toHaveClass(/in/);

      const currentSub = currentParent.locator(".panel-collapse a").nth(j);
      const subName = (await currentSub.textContent())?.trim() || "Unknown";

      console.log(`🔹 Checking subcategory: ${parentName} → ${subName}`);

      if (await currentSub.isVisible()) {
        await currentSub.click();
      } else {
        await currentSub.click({ force: true });
      }

      await page.waitForSelector(".productinfo > p", { state: "visible" });

      const titles = await homePage.getVisibleProductsTitles();
      console.log(
        `📦 Found ${titles.length} products for ${parentName} > ${subName}`
      );
      console.log(
        `📦 ${parentName} > ${subName} → ${
          titles.length
        } products: [${titles.join(", ")}]`
      );

      expect(titles.length).toBeGreaterThan(0);
    }
  }
});
