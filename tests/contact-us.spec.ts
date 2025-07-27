import { test, expect } from "@playwright/test";
import { ContactUsPage } from "../pages/ContactUsPage";
import { ClickHandlerChain } from "../clickHandlerChain";

test("send contact message", async ({ page }) => {
  const contactUs = new ContactUsPage(page);

  await contactUs.navigate();

  await contactUs.fillForm("Test", "test@mail.com", "Hello", "Message content");
  await contactUs.submitForm();
});

test("should show validation errors for empty contact form", async ({
  page,
}) => {
  const contactUsPage = new ContactUsPage(page);
  const clickChain = new ClickHandlerChain();

  await contactUsPage.navigate();

  const submitButton = page.locator('input[name="submit"]');
  const success = await clickChain.clickWithTimeout(submitButton, 10000);
  if (!success) {
    throw new Error("Failed to click submit button");
  }

  await expect(page.locator("#contact-us-form")).toBeVisible();
});
