import { Page } from "@playwright/test";

export class CartPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://automationexercise.com/view_cart");
  }

  async getCartItemsTitles() {
    return await this.page
      .locator(".cart_description > h4 > a")
      .allTextContents();
  }

  async placeOrder() {
    await this.page.click('a:has-text("Proceed To Checkout")');
  }
}
