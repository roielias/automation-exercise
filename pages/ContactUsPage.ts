import { Page } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";

export class ContactUsPage {
  private clickChain: ClickHandlerChain;

  constructor(private page: Page) {
    this.clickChain = new ClickHandlerChain();
  }

  async navigate() {
    await this.page.goto("https://automationexercise.com/contact_us", {
      timeout: 800000,
      waitUntil: "domcontentloaded",
    });
  }

  async fillForm(
    name: string,
    email: string,
    subject: string,
    message: string
  ) {
    await this.page.fill('[name="name"]', name);
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="subject"]', subject);
    await this.page.fill('[name="message"]', message);
  }

  async submitForm() {
    this.page.once("dialog", (dialog) => dialog.accept());

    const submitButton = this.page.locator('input[name="submit"]');
    const success = await this.clickChain.clickWithTimeout(submitButton, 10000);
    if (!success) {
      throw new Error("Failed to click submit button");
    }
  }
}
