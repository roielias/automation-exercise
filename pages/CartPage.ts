import { Page, expect } from "@playwright/test";

export class CartPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://automationexercise.com/view_cart");
  }

  async getCartItems() {
    const rows = this.page.locator("tr.cart_item");
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
        (await row.locator(".cart_quantity_input").getAttribute("value")) ||
          "0",
        10
      );
      const unitPrice = parseInt(
        (await row.locator(".cart_price").innerText()).replace(/[^\d]/g, ""),
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

  async verifyItemTotals() {
    const itemCount = await this.page.locator(".cart_total_price").count();

    for (let i = 0; i < itemCount; i++) {
      const priceText = await this.page
        .locator(".cart_price")
        .nth(i)
        .innerText();
      const quantityText = await this.page
        .locator(".cart_quantity_input")
        .nth(i)
        .inputValue();
      const totalText = await this.page
        .locator(".cart_total_price")
        .nth(i)
        .innerText();

      const unitPrice = parseInt(priceText.replace(/[^\d]/g, ""));
      const quantity = parseInt(quantityText);
      const total = parseInt(totalText.replace(/[^\d]/g, ""));

      expect(unitPrice * quantity).toBe(total);
    }
  }

  async placeOrder() {
    await this.page.click('a:has-text("Proceed To Checkout")');
  }
}
