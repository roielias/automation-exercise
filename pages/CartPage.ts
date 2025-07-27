import { Page, expect } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";
export class CartPage {
  private clickChain: ClickHandlerChain;

  constructor(private page: Page) {
    this.clickChain = new ClickHandlerChain();
  }

  async navigate() {
    await this.page.goto("https://automationexercise.com/view_cart", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await this.page.waitForTimeout(5000);
    await this.page.waitForLoadState("load", { timeout: 30000 });
  }

  async getCartItems() {
    type CartItem = {
      title: string | null;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    };

    const emptyCartIndicators = [
      "text=Your shopping cart is empty!",
      ".cart-empty",
      "text=Cart is empty",
      "#cart_empty",
    ];

    for (const indicator of emptyCartIndicators) {
      try {
        const isVisible = await this.page
          .locator(indicator)
          .isVisible({ timeout: 2000 });
        if (isVisible) {
          return [];
        }
      } catch (e) {}
    }

    const tableExists =
      (await this.page.locator("#cart_info_table").count()) > 0;
    if (!tableExists) {
      return [];
    }

    try {
      await this.page.waitForSelector("#cart_info_table", { timeout: 15000 });
    } catch {
      return [];
    }

    const rows = this.page.locator("tr[id^='product-']");
    const count = await rows.count();

    if (count === 0) {
      return [];
    }

    const items: CartItem[] = [];

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);

      try {
        await row.waitFor({ timeout: 10000 });

        const title = await row
          .locator(".cart_description h4 a")
          .textContent({ timeout: 5000 });

        const quantityElement = row.locator(".cart_quantity button.disabled");
        await quantityElement.waitFor({ timeout: 5000 });
        const quantityText = await quantityElement.textContent();
        const quantity = parseInt(quantityText || "0", 10);

        const unitPriceElement = row.locator(".cart_price p");
        await unitPriceElement.waitFor({ timeout: 5000 });
        const unitPriceText = await unitPriceElement.innerText();
        const unitPrice = parseInt(unitPriceText.replace(/[^\d]/g, ""), 10);

        const totalPriceElement = row.locator(".cart_total_price");
        await totalPriceElement.waitFor({ timeout: 5000 });
        const totalPriceText = await totalPriceElement.innerText();
        const totalPrice = parseInt(totalPriceText.replace(/[^\d]/g, ""), 10);

        items.push({ title, quantity, unitPrice, totalPrice });
      } catch {}
    }

    return items;
  }

  async clearCart() {
    await this.navigate();

    const currentItems = await this.getCartItems();
    if (currentItems.length === 0) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const deleteButtons = this.page.locator(".cart_quantity_delete");
      const buttonCount = await deleteButtons.count();

      if (buttonCount === 0) {
        break;
      }

      try {
        const success = await this.clickChain.clickWithTimeout(
          deleteButtons.first(),
          10000
        );
        if (!success) {
          throw new Error("Failed to click delete button");
        }

        await this.page.waitForTimeout(3000);
        await this.page.waitForLoadState("load", { timeout: 10000 });
        attempts++;
      } catch {
        attempts++;
        if (attempts < maxAttempts) {
          await this.page.reload({ waitUntil: "domcontentloaded" });
          await this.page.waitForTimeout(3000);
        }
      }
    }
  }

  async placeOrder() {
    const checkoutButton = this.page.locator(
      'a.check_out, a:has-text("Proceed To Checkout")'
    );

    try {
      await expect(checkoutButton.first()).toBeVisible({ timeout: 20000 });
      await expect(checkoutButton.first()).toBeEnabled({ timeout: 10000 });
    } catch {
      await this.navigate();
      await expect(checkoutButton.first()).toBeVisible({ timeout: 20000 });
    }

    const availableButton = checkoutButton.first();

    const currentUrl = this.page.url();

    const success = await this.clickChain.clickWithTimeout(
      availableButton,
      10000
    );
    if (!success) {
      throw new Error("Failed to click checkout button");
    }

    try {
      await this.page.waitForURL(/.*checkout/, { timeout: 20000 });
    } catch {
      const newUrl = this.page.url();

      if (!newUrl.includes("checkout")) {
        await this.clickChain.clickWithTimeout(availableButton, 10000);
        await this.page.waitForURL(/.*checkout/, { timeout: 20000 });
      }
    }

    const finalUrl = this.page.url();
    if (!finalUrl.includes("checkout")) {
      throw new Error(`Expected to be on checkout page, but got: ${finalUrl}`);
    }
  }
}
