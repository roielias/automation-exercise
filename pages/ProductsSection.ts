import { Page, expect } from "@playwright/test";

export class ProductsSection {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://automationexercise.com/", {
      timeout: 800000,
      waitUntil: "domcontentloaded",
    });
  }

  async addProductToCart(index: number) {
    const product = this.page.locator(".single-products").nth(index);

    await product.hover();

    const addToCartButton = product.locator(".product-overlay .add-to-cart");

    await expect(addToCartButton).toBeVisible({ timeout: 5000 });

    await addToCartButton.click({ force: true });

    await this.page.waitForSelector("#cartModal", {
      state: "visible",
      timeout: 5000,
    });

    await this.page.click('button:has-text("Continue Shopping")');

    await this.page.waitForSelector("#cartModal", {
      state: "hidden",
      timeout: 5000,
    });
  }
}
