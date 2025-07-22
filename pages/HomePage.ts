import { Page, expect } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://automationexercise.com/", {
      timeout: 80000,
      waitUntil: "domcontentloaded",
    });
  }

  async clickTopNavLink(linkText: string) {
    if (linkText === "Test Cases") {
      await this.page.locator('a[href="/test_cases"]').nth(0).click();
    } else {
      await this.page.getByRole("link", { name: linkText }).click();
    }
  }

  async clickCategory(parentCategory: string, subCategory: string) {
    const parentLocator = this.page
      .locator("#accordian > .panel")
      .filter({ hasText: parentCategory });

    const categoryLink = parentLocator.first().locator("a").first();
    await expect(categoryLink).toBeVisible();
    await categoryLink.click();

    const subLink = this.page.getByRole("link", { name: subCategory });
    await expect(subLink).toBeVisible();
    await subLink.click();

    await this.page.waitForSelector(".productinfo > p", { state: "visible" });
  }

  async getVisibleProductsTitles() {
    return await this.page.locator(".productinfo > p").allTextContents();
  }
}
