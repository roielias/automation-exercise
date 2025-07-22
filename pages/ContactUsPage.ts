import { Page } from "@playwright/test";

export class ContactUsPage {
  constructor(private page: Page) {}

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
    const [dialog] = await Promise.all([
      this.page.waitForEvent("dialog"),
      this.page.click('input[name="submit"]'),
    ]);
    await dialog.accept();
  }
}
