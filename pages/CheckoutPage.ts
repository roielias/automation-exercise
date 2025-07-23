import { Page } from "@playwright/test";

export class CheckoutPage {
  constructor(private page: Page) {}

  async expectOnCheckoutPage() {
    await this.page.waitForURL(/.*\/checkout/, { timeout: 5000 });
  }

  async getTotalOrderAmount(): Promise<number> {
    const totalText = await this.page
      .locator("td:has-text('Total Amount') + td")
      .innerText();
    const numeric = parseInt(totalText.replace(/[^\d]/g, ""), 10);
    return numeric;
  }

  async fillOrderForm({ name, card }: { name: string; card: string }) {
    await this.page.fill('[data-qa="name-on-card"]', name);
    await this.page.fill('[data-qa="card-number"]', card);
  }

  async submitOrder() {
    await this.page.click('[data-qa="pay-button"]');
  }

  async expectSuccessMessage() {
    await this.page.waitForSelector(".alert-success", { timeout: 5000 });
    await this.page.locator(".alert-success").waitFor({ state: "visible" });
  }
}
