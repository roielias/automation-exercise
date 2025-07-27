import { test, expect } from "@playwright/test";
import { ContactUsPage } from "../pages/ContactUsPage";
import { ClickHandlerChain } from "../clickHandlerChain";

/**
 * Test suite for Contact Us page functionality
 */

/**
 * Tests successful contact form submission with valid data
 */
test("send contact message", async ({ page }) => {
  const contactUs = new ContactUsPage(page);

  await contactUs.navigate();

  await contactUs.fillForm("Test", "test@mail.com", "Hello", "Message content");
  await contactUs.submitForm();
});

/**
 * Tests form validation by attempting to submit empty form
 * Verifies that appropriate validation occurs for required fields
 */
test("should show validation errors for empty contact form", async ({
  page,
}) => {
  const contactUsPage = new ContactUsPage(page);
  const clickChain = new ClickHandlerChain();

  await contactUsPage.navigate();

  // Attempt to submit form without filling any fields
  const submitButton = page.locator('input[name="submit"]');
  const success = await clickChain.clickWithTimeout(submitButton, 10000);
  if (!success) {
    throw new Error("Failed to click submit button");
  }

  // Verify form is still visible (indicating validation prevented submission)
  await expect(page.locator("#contact-us-form")).toBeVisible();
});
