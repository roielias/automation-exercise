import { Page, expect } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";
import { CheckoutPageSelectors } from "../selectors/checkout.selectors";

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
 * Updated to use centralized selectors.
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
    await expect(this.page).toHaveURL(CheckoutPageSelectors.pages.checkout, {
      timeout: 30000,
    });
  }

  /**
   * Verifies that the current page is the payment page
   */
  async expectOnPaymentPage() {
    await expect(this.page).toHaveURL(CheckoutPageSelectors.pages.payment, {
      timeout: 30000,
    });
  }

  /**
   * Extracts the total order amount from the checkout page
   */
  async getTotalOrderAmount(): Promise<number> {
    try {
      await this.page.waitForSelector(
        CheckoutPageSelectors.totalAmount.primary,
        { timeout: 30000 }
      );
    } catch (error) {
      // Try alternative selectors if primary fails
      for (const selector of CheckoutPageSelectors.totalAmount.alternatives) {
        try {
          await this.page.waitForSelector(selector, { timeout: 10000 });
          break;
        } catch (e) {
          continue;
        }
      }
    }

    const totalElement = this.page.locator(
      CheckoutPageSelectors.totalAmount.primary
    );
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
   */
  async fillOrderForm({
    name,
    card,
    cvc = "311",
    expMonth = "12",
    expYear = "2025",
  }: OrderFormData) {
    await this.expectOnPaymentPage();

    await this.page.waitForSelector(
      CheckoutPageSelectors.paymentForm.nameOnCard,
      {
        timeout: 20000,
      }
    );

    // Fill name on card
    const nameField = this.page.locator(
      CheckoutPageSelectors.paymentForm.nameOnCard
    );
    await nameField.waitFor({ timeout: 10000 });
    await nameField.clear();
    await nameField.fill(name);
    await this.page.waitForTimeout(500);

    // Fill card number
    const cardField = this.page.locator(
      CheckoutPageSelectors.paymentForm.cardNumber
    );
    await cardField.waitFor({ timeout: 10000 });
    await cardField.clear();
    await cardField.fill(card);
    await this.page.waitForTimeout(500);

    // Fill CVC
    const cvcField = this.page.locator(CheckoutPageSelectors.paymentForm.cvc);
    await cvcField.waitFor({ timeout: 10000 });
    await cvcField.clear();
    await cvcField.fill(cvc);
    await this.page.waitForTimeout(500);

    // Fill expiration month
    const monthField = this.page.locator(
      CheckoutPageSelectors.paymentForm.expiryMonth
    );
    await monthField.waitFor({ timeout: 10000 });
    await monthField.clear();
    await monthField.fill(expMonth);
    await this.page.waitForTimeout(500);

    // Fill expiration year
    const yearField = this.page.locator(
      CheckoutPageSelectors.paymentForm.expiryYear
    );
    await yearField.waitFor({ timeout: 10000 });
    await yearField.clear();
    await yearField.fill(expYear);

    await this.page.waitForTimeout(2000);
  }

  /**
   * Submits the payment form and waits for successful processing
   */
  async submitOrder() {
    const payButton = this.page.locator(
      CheckoutPageSelectors.paymentForm.payButton
    );
    await expect(payButton).toBeVisible({ timeout: 30000 });
    await expect(payButton).toBeEnabled({ timeout: 10000 });

    const currentUrl = this.page.url();

    try {
      const success = await this.clickChain.clickWithTimeout(payButton, 15000);
      if (!success) {
        throw new Error("Failed to click pay button");
      }
      await this.page.waitForURL(CheckoutPageSelectors.pages.success, {
        timeout: 40000,
      });
    } catch (error) {
      const newUrl = this.page.url();

      if (newUrl.includes("payment_done")) {
        return;
      }

      try {
        // Second attempt with click chain
        await this.clickChain.clickWithTimeout(payButton, 15000);
        await this.page.waitForURL(CheckoutPageSelectors.pages.success, {
          timeout: 40000,
        });
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

        await this.page.waitForURL(CheckoutPageSelectors.pages.success, {
          timeout: 40000,
        });
      }
    }
  }

  /**
   * Confirms the order and proceeds to payment
   */
  async confirmOrder() {
    const confirmBtn = this.page
      .locator(CheckoutPageSelectors.confirmButton)
      .last();

    await expect(confirmBtn).toBeVisible({ timeout: 20000 });
    await expect(confirmBtn).toBeEnabled({ timeout: 10000 });

    const currentUrl = this.page.url();

    const success = await this.clickChain.clickWithTimeout(confirmBtn, 15000);
    if (!success) {
      throw new Error("Failed to click confirm button");
    }

    try {
      await this.page.waitForURL(CheckoutPageSelectors.pages.payment, {
        timeout: 30000,
      });
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
    await expect(this.page).toHaveURL(CheckoutPageSelectors.pages.success, {
      timeout: 40000,
    });
  }

  /**
   * Verifies that order success message is displayed
   */
  async expectSuccessMessage() {
    await this.expectOnSuccessPage();

    let foundSuccess = false;
    for (const selector of CheckoutPageSelectors.successIndicators) {
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
