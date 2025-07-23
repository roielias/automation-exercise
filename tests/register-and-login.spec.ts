import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("register and login a new user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();

  const uniqueEmail = `roi${Date.now()}@test.com`;
  await loginPage.registerNewUser("Roi", uniqueEmail);

  await page.locator('[data-qa="password"]').fill("123456");
  await page.locator('[data-qa="days"]').selectOption("10");
  await page.locator('[data-qa="months"]').selectOption("5");
  await page.locator('[data-qa="years"]').selectOption("1997");
  await page.locator("#id_gender1").check();
  await page.locator("#newsletter").check();
  await page.locator("#optin").check();
  await page.locator('[data-qa="first_name"]').fill("Roi");
  await page.locator('[data-qa="last_name"]').fill("Elias");
  await page.locator('[data-qa="company"]').fill("Testing LTD");
  await page.locator('[data-qa="address"]').fill("Herzl 20");
  await page.locator('[data-qa="address2"]').fill("Floor 2");
  await page.locator('[data-qa="state"]').fill("Holon");
  await page.locator('[data-qa="city"]').fill("Holon");
  await page.locator('[data-qa="zipcode"]').fill("12345");
  await page.locator('[data-qa="mobile_number"]').fill("0500000000");
  await page.locator('[data-qa="create-account"]').click();

  await page
    .locator('[data-qa="continue-button"]')
    .waitFor({ state: "visible", timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.locator('[data-qa="continue-button"]').click();

  const logoutButton = page.locator('a[href="/logout"]');
  if ((await logoutButton.count()) > 0) {
    await logoutButton.waitFor({ state: "visible", timeout: 10000 });
    await logoutButton.click();
  } else {
    console.log("Logout button not found, skipping logout step.");
  }

  await loginPage.login(uniqueEmail, "123456");
  await expect(page.locator("text=Logged in as Roi")).toBeVisible();
});
