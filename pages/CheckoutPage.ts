import { Page } from "@playwright/test";

export class CheckoutPage {
  constructor(private page: Page) {}

  async expectOnCheckoutPage() {
    await this.page.waitForURL(/.*\/checkout/, { timeout: 5000 });
  }

  async getTotalOrderAmount() {
    await this.page.waitForSelector(
      "tr:has(h4:has-text('Total Amount')) .cart_total_price",
      { timeout: 10000 }
    );
    const totalText = await this.page
      .locator("tr:has(h4:has-text('Total Amount')) .cart_total_price")
      .innerText();
    const numeric = parseInt(totalText.replace(/[^\d]/g, ""), 10);
    return numeric;
  }

  async fillOrderForm({ name, card }: { name: string; card: string }) {
    await this.page.locator('[data-qa="name-on-card"]').fill(name);
    await this.page.locator('[data-qa="card-number"]').fill(card);
  }

  async submitOrder() {
    await this.page.click('[data-qa="pay-button"]');
  }

  async expectSuccessMessage() {
    await this.page.waitForSelector(".alert-success", { timeout: 5000 });
    await this.page.locator(".alert-success").waitFor({ state: "visible" });
  }
}
