import { Page } from "@playwright/test";

export class ContactUsPage {
  constructor(private page: Page) {}

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
    await this.page.click('input[name="submit"]');
  }
}
