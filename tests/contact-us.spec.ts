import { test } from "@playwright/test";
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
