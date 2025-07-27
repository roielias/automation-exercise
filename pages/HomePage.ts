import { Page, expect } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";

export class HomePage {
  private clickChain: ClickHandlerChain;

  constructor(private page: Page) {
    this.clickChain = new ClickHandlerChain();
  }

  async navigate() {
    await this.page.goto("https://automationexercise.com/", {
      timeout: 800000,
      waitUntil: "domcontentloaded",
    });
  }

  async clickTopNavLink(linkText: string) {
    if (linkText === "Test Cases") {
      const testCasesLink = this.page.locator('a[href="/test_cases"]').nth(0);
      const success = await this.clickChain.clickWithTimeout(
        testCasesLink,
        10000
      );
      if (!success) {
        throw new Error(`Failed to click ${linkText} link`);
      }
    } else if (linkText === "Contact us") {
      const contactLink = this.page.locator('a[href="/contact_us"]').first();
      const success = await this.clickChain.clickWithTimeout(
        contactLink,
        10000
      );
      if (!success) {
        throw new Error(`Failed to click ${linkText} link`);
      }
    } else {
      const link = this.page.getByRole("link", { name: linkText });
      const success = await this.clickChain.clickWithTimeout(link, 10000);
      if (!success) {
        throw new Error(`Failed to click ${linkText} link`);
      }
    }
  }

  async clickCategory(parentCategory: string, subCategory: string) {
    const parentLocator = this.page
      .locator("#accordian > .panel")
      .filter({ hasText: parentCategory });

    const categoryLink = parentLocator.first().locator("a").first();
    await expect(categoryLink).toBeVisible();

    const parentSuccess = await this.clickChain.clickWithTimeout(
      categoryLink,
      10000
    );
    if (!parentSuccess) {
      throw new Error(`Failed to click parent category: ${parentCategory}`);
    }

    const subLink = this.page.getByRole("link", { name: subCategory });
    await expect(subLink).toBeVisible();

    const subSuccess = await this.clickChain.clickWithTimeout(subLink, 10000);
    if (!subSuccess) {
      throw new Error(`Failed to click sub category: ${subCategory}`);
    }

    await this.page.waitForSelector(".productinfo > p", { state: "visible" });
  }

  async getVisibleProductsTitles() {
    return await this.page.locator(".productinfo > p").allTextContents();
  }
}
