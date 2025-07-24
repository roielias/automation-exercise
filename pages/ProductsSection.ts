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
    await this.page.waitForSelector(".single-products", { timeout: 10000 });

    const product = this.page.locator(".single-products").nth(index);

    await product.scrollIntoViewIfNeeded();
    await product.hover();

    const addToCartButton = product.locator(".product-overlay .add-to-cart");

    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    const modal = this.page.locator("#cartModal.modal.show");
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(this.page.locator("#cartModal")).toHaveText(/Added!/, {
      timeout: 5000,
    });

    await this.page.click(".close-modal");
    await expect(this.page.locator("#cartModal")).toBeHidden({ timeout: 5000 });
  }
}
