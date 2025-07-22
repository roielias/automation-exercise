import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test("top nav buttons navigate correctly", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();

  const topNavLinks = [
    { name: "Home", selector: "#slider" },
    { name: "Products", selector: "h2:has-text('All Products')" },
    { name: "Cart", selector: "li.active:has-text('Shopping Cart')" },
    {
      name: "Signup / Login",
      selector: "h2:has-text('Login to your account')",
    },
    { name: "Test Cases", selector: 'a[href="/test_cases"]' },
    { name: "Contact us", selector: "h2:has-text('Get In Touch')" },
  ];

  for (const { name, selector } of topNavLinks) {
    await homePage.clickTopNavLink(name);
    await expect(page.locator(selector).first()).toBeVisible({
      timeout: 10000,
    });
    await homePage.navigate();
  }
});
