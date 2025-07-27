import { Page, expect } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";
import { HomePageSelectors } from "../selectors/home.selectors";

/**
 * Page Object Model class for the home page functionality.
 * Handles navigation, top navigation interactions, and category filtering.
 * Updated to use centralized selectors.
 */
export class HomePage {
  private clickChain: ClickHandlerChain;

  constructor(private page: Page) {
    this.clickChain = new ClickHandlerChain();
  }

  /**
   * Navigates to the home page
   */
  async navigate() {
    await this.page.goto("https://automationexercise.com/", {
      timeout: 800000,
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * Clicks on top navigation links with specific handling for certain links
   */
  async clickTopNavLink(linkText: string) {
    if (linkText === "Test Cases") {
      // Specific selector for Test Cases link
      const testCasesLink = this.page
        .locator(HomePageSelectors.navigation.testCases)
        .nth(0);
      const success = await this.clickChain.clickWithTimeout(
        testCasesLink,
        10000
      );
      if (!success) {
        throw new Error(`Failed to click ${linkText} link`);
      }
    } else if (linkText === "Contact us") {
      // Specific selector for Contact Us link
      const contactLink = this.page
        .locator(HomePageSelectors.navigation.contactUs)
        .first();
      const success = await this.clickChain.clickWithTimeout(
        contactLink,
        10000
      );
      if (!success) {
        throw new Error(`Failed to click ${linkText} link`);
      }
    } else {
      // Generic link handling using role-based selector
      const link = this.page.getByRole("link", { name: linkText });
      const success = await this.clickChain.clickWithTimeout(link, 10000);
      if (!success) {
        throw new Error(`Failed to click ${linkText} link`);
      }
    }
  }

  /**
   * Navigates through product categories using accordion-style navigation
   */
  async clickCategory(parentCategory: string, subCategory: string) {
    const parentLocator = this.page
      .locator(HomePageSelectors.categories.panels)
      .filter({ hasText: parentCategory });

    const categoryLink = parentLocator.first().locator("a").first();
    await expect(categoryLink).toBeVisible();

    // Click parent category to expand accordion
    const parentSuccess = await this.clickChain.clickWithTimeout(
      categoryLink,
      10000
    );
    if (!parentSuccess) {
      throw new Error(`Failed to click parent category: ${parentCategory}`);
    }

    // Click subcategory after parent is expanded
    const subLink = this.page.getByRole("link", { name: subCategory });
    await expect(subLink).toBeVisible();

    const subSuccess = await this.clickChain.clickWithTimeout(subLink, 10000);
    if (!subSuccess) {
      throw new Error(`Failed to click sub category: ${subCategory}`);
    }

    // Wait for products to load after category selection
    await this.page.waitForSelector(HomePageSelectors.products.titles, {
      state: "visible",
    });
  }

  /**
   * Retrieves the titles of all visible products on the page
   */
  async getVisibleProductsTitles(): Promise<string[]> {
    return await this.page
      .locator(HomePageSelectors.products.titles)
      .allTextContents();
  }
}
