import { Page, expect } from "@playwright/test";

export class CartPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://automationexercise.com/view_cart");
  }

  async getCartItems() {
    const rows = this.page.locator("tr[id^='product-']");
    const count = await rows.count();

    type CartItem = {
      title: string | null;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    };

    const items: CartItem[] = [];

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);

      const title = await row.locator(".cart_description h4 a").textContent();
      const quantity = parseInt(
        (await row.locator(".cart_quantity button.disabled").textContent()) ||
          "0",
        10
      );
      const unitPrice = parseInt(
        (await row.locator(".cart_price p").innerText()).replace(/[^\d]/g, ""),
        10
      );
      const totalPrice = parseInt(
        (await row.locator(".cart_total_price").innerText()).replace(
          /[^\d]/g,
          ""
        ),
        10
      );

      items.push({ title, quantity, unitPrice, totalPrice });
    }

    return items;
  }

  async clearCart() {
    await this.navigate();
    const deleteButtons = this.page.locator(".cart_quantity_delete");
    const count = await deleteButtons.count();

    for (let i = 0; i < count; i++) {
      await deleteButtons.nth(0).click();
      await this.page.waitForTimeout(500);
    }
  }

  async placeOrder() {
    await this.page.click('a:has-text("Proceed To Checkout")');
  }
}
