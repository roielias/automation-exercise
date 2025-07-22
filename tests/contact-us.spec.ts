import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ContactUsPage } from "../pages/ContactUsPage";

test("send contact message", async ({ page }) => {
  const homePage = new HomePage(page);
  const contactUs = new ContactUsPage(page);

  await homePage.navigate();
  await homePage.clickTopNavLink("Contact us");

  await contactUs.fillForm("Test", "test@mail.com", "Hello", "Message content");
  await contactUs.submitForm();
});

test("should show validation errors for empty contact form", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const contactUsPage = new ContactUsPage(page);

  await homePage.navigate();
  await homePage.clickTopNavLink("Contact us");

  await page.click('input[name="submit"]');

  await expect(page.locator("#contact-us-form")).toBeVisible();
});
