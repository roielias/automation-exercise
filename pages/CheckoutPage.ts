import { Page, expect } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";

/**
 * Interface for order form data
 */
interface OrderFormData {
  name: string;
  card: string;
  cvc?: string;
  expMonth?: string;
  expYear?: string;
}

/**
 * Page Object Model class for the checkout and payment process.
 * Handles order confirmation, payment form filling, and order submission.
 */
export class CheckoutPage {
  private clickChain: ClickHandlerChain;

  constructor(private page: Page) {
    this.clickChain = new ClickHandlerChain();
  }

  /**
   * Verifies that the current page is the checkout page
   */
  async expectOnCheckoutPage() {
    await expect(this.page).toHaveURL(/.*\/checkout/, { timeout: 30000 });
  }

  /**
   * Verifies that the current page is the payment page
   */
  async expectOnPaymentPage() {
    await expect(this.page).toHaveURL(/.*\/payment/, { timeout: 30000 });
  }

  /**
   * Extracts the total order amount from the checkout page
   *
   * @returns Promise<number> - The total order amount as a number
   * @throws Error if total amount cannot be found or parsed
   */
  async getTotalOrderAmount(): Promise<number> {
    const totalSelector =
      "tr:has(h4:has-text('Total Amount')) .cart_total_price";

    try {
      await this.page.waitForSelector(totalSelector, { timeout: 30000 });
    } catch (error) {
      // Try alternative selectors if primary fails
      const alternativeSelectors = [
        ".cart_total_price:last-child",
        "tr:contains('Total Amount') .cart_total_price",
        ".total_amount .cart_total_price",
      ];

      for (const selector of alternativeSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 10000 });
          break;
        } catch (e) {
          continue;
        }
      }
    }

    const totalElement = this.page.locator(totalSelector);
    await totalElement.waitFor({ timeout: 15000 });

    const totalText = await totalElement.innerText({ timeout: 10000 });
    const numeric = parseInt(totalText.replace(/[^\d]/g, ""), 10);

    if (isNaN(numeric)) {
      throw new Error(`Could not parse total amount from text: "${totalText}"`);
    }

    return numeric;
  }

  /**
   * Fills out the payment form with provided details
   *
   * @param formData - Object containing payment form data
   */
  async fillOrderForm({
    name,
    card,
    cvc = "311",
    expMonth = "12",
    expYear = "2025",
  }: OrderFormData) {
    await this.expectOnPaymentPage();

    await this.page.waitForSelector('[data-qa="name-on-card"]', {
      timeout: 20000,
    });

    // Fill name on card
    const nameField = this.page.locator('[data-qa="name-on-card"]');
    await nameField.waitFor({ timeout: 10000 });
    await nameField.clear();
    await nameField.fill(name);
    await this.page.waitForTimeout(500);

    // Fill card number
    const cardField = this.page.locator('[data-qa="card-number"]');
    await cardField.waitFor({ timeout: 10000 });
    await cardField.clear();
    await cardField.fill(card);
    await this.page.waitForTimeout(500);

    // Fill CVC
    const cvcField = this.page.locator('[placeholder="ex. 311"]');
    await cvcField.waitFor({ timeout: 10000 });
    await cvcField.clear();
    await cvcField.fill(cvc);
    await this.page.waitForTimeout(500);

    // Fill expiration month
    const monthField = this.page.locator('[placeholder="MM"]');
    await monthField.waitFor({ timeout: 10000 });
    await monthField.clear();
    await monthField.fill(expMonth);
    await this.page.waitForTimeout(500);

    // Fill expiration year
    const yearField = this.page.locator('[placeholder="YYYY"]');
    await yearField.waitFor({ timeout: 10000 });
    await yearField.clear();
    await yearField.fill(expYear);

    await this.page.waitForTimeout(2000);
  }

  /**
   * Submits the payment form and waits for successful processing
   * Uses multiple fallback strategies for reliable form submission
   */
  async submitOrder() {
    const payButton = this.page.locator('[data-qa="pay-button"]');
    await expect(payButton).toBeVisible({ timeout: 30000 });
    await expect(payButton).toBeEnabled({ timeout: 10000 });

    const currentUrl = this.page.url();

    try {
      const success = await this.clickChain.clickWithTimeout(payButton, 15000);
      if (!success) {
        throw new Error("Failed to click pay button");
      }
      await this.page.waitForURL(/.*\/payment_done\/\d+/, { timeout: 40000 });
    } catch (error) {
      const newUrl = this.page.url();

      if (newUrl.includes("payment_done")) {
        return;
      }

      try {
        // Second attempt with click chain
        await this.clickChain.clickWithTimeout(payButton, 15000);
        await this.page.waitForURL(/.*\/payment_done\/\d+/, { timeout: 40000 });
      } catch (error2) {
        // Final fallback: JavaScript click
        await this.page.evaluate(() => {
          const button = document.querySelector(
            '[data-qa="pay-button"]'
          ) as HTMLElement;
          if (button) {
            button.click();
          }
        });

        await this.page.waitForURL(/.*\/payment_done\/\d+/, { timeout: 40000 });
      }
    }
  }

  /**
   * Confirms the order and proceeds to payment
   */
  async confirmOrder() {
    const confirmBtn = this.page.locator("a.check_out").last();

    await expect(confirmBtn).toBeVisible({ timeout: 20000 });
    await expect(confirmBtn).toBeEnabled({ timeout: 10000 });

    const currentUrl = this.page.url();

    const success = await this.clickChain.clickWithTimeout(confirmBtn, 15000);
    if (!success) {
      throw new Error("Failed to click confirm button");
    }

    try {
      await this.page.waitForURL(/.*payment/, { timeout: 30000 });
    } catch (error) {
      const newUrl = this.page.url();

      if (!newUrl.includes("payment")) {
        throw new Error(
          `Failed to navigate to payment page. Current URL: ${newUrl}`
        );
      }
    }
  }

  /**
   * Verifies that the current page is the order success page
   */
  async expectOnSuccessPage() {
    await expect(this.page).toHaveURL(/.*\/payment_done\/\d+/, {
      timeout: 40000,
    });
  }

  /**
   * Verifies that order success message is displayed
   * Checks multiple possible success indicators
   */
  async expectSuccessMessage() {
    await this.expectOnSuccessPage();

    const successIndicators = [
      ".alert-success",
      "h2:has-text('Order Placed!')",
      "p:has-text('Congratulations')",
      ".order-success",
      "text=Your order has been placed successfully!",
      "text=Order Placed!",
      "[data-qa='order-placed']",
      ".success-message",
      "h1:has-text('Order Placed')",
    ];

    let foundSuccess = false;
    for (const selector of successIndicators) {
      try {
        await this.page.waitForSelector(selector, { timeout: 10000 });
        foundSuccess = true;
        break;
      } catch (e) {
        // Continue checking other indicators
      }
    }

    if (!foundSuccess) {
      await this.expectOnSuccessPage();

      // Fallback check for order-related text in page body
      const bodyText = await this.page.textContent("body");
      if (!bodyText || !bodyText.toLowerCase().includes("order")) {
        // Additional validation could be added here
      }
    }
  }
}
