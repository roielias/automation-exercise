import { test, expect } from "@playwright/test";
import { ContactUsPage } from "../pages/ContactUsPage";

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

  await contactUsPage.navigate();

  await page.click('input[name="submit"]');

  await expect(page.locator("#contact-us-form")).toBeVisible();
});
