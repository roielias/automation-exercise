import { Page } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";

/**
 * Page Object Model class for the Contact Us functionality.
 * Handles navigation to contact page, form filling, and form submission.
 */
export class ContactUsPage {
  private clickChain: ClickHandlerChain;

  constructor(private page: Page) {
    this.clickChain = new ClickHandlerChain();
  }

  /**
   * Navigates to the Contact Us page
   */
  async navigate() {
    await this.page.goto("https://automationexercise.com/contact_us", {
      timeout: 800000,
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * Fills out the contact form with provided information
   *
   * @param name - Contact name
   * @param email - Contact email address
   * @param subject - Message subject
   * @param message - Message content
   */
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

  /**
   * Submits the contact form
   * Handles the confirmation dialog that appears after submission
   */
  async submitForm() {
    // Set up dialog handler before clicking submit to auto-accept confirmation
    this.page.once("dialog", (dialog) => dialog.accept());

    const submitButton = this.page.locator('input[name="submit"]');
    const success = await this.clickChain.clickWithTimeout(submitButton, 10000);
    if (!success) {
      throw new Error("Failed to click submit button");
    }
  }
}
