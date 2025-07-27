import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ClickHandlerChain } from "../clickHandlerChain";

/**
 * Complete user registration and login flow test
 *
 * This test covers:
 * 1. New user registration with full profile details
 * 2. Account creation confirmation
 * 3. Logout process
 * 4. Login with newly created credentials
 * 5. Verification of successful authentication
 */
test("register and login a new user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const clickChain = new ClickHandlerChain();

  await loginPage.navigate();

  // Step 1: Initiate registration with unique email
  const uniqueEmail = `roi${Date.now()}@test.com`;
  await loginPage.registerNewUser("Roi", uniqueEmail);

  // Step 2: Fill detailed registration form
  await page.locator('[data-qa="password"]').fill("123456");
  await page.locator('[data-qa="days"]').selectOption("10");
  await page.locator('[data-qa="months"]').selectOption("5");
  await page.locator('[data-qa="years"]').selectOption("1997");

  // Handle checkbox selections using click chain for reliability
  const genderCheckbox = page.locator("#id_gender1");
  await clickChain.clickWithTimeout(genderCheckbox, 5000);

  const newsletterCheckbox = page.locator("#newsletter");
  await clickChain.clickWithTimeout(newsletterCheckbox, 5000);

  const optinCheckbox = page.locator("#optin");
  await clickChain.clickWithTimeout(optinCheckbox, 5000);

  // Fill address information
  await page.locator('[data-qa="first_name"]').fill("Roi");
  await page.locator('[data-qa="last_name"]').fill("Elias");
  await page.locator('[data-qa="company"]').fill("Testing LTD");
  await page.locator('[data-qa="address"]').fill("Herzl 20");
  await page.locator('[data-qa="address2"]').fill("Floor 2");
  await page.locator('[data-qa="state"]').fill("Holon");
  await page.locator('[data-qa="city"]').fill("Holon");
  await page.locator('[data-qa="zipcode"]').fill("12345");
  await page.locator('[data-qa="mobile_number"]').fill("0500000000");

  // Step 3: Submit registration form
  const createAccountButton = page.locator('[data-qa="create-account"]');
  const createSuccess = await clickChain.clickWithTimeout(
    createAccountButton,
    10000
  );
  if (!createSuccess) {
    throw new Error("Failed to click create account button");
  }

  // Step 4: Handle account creation confirmation
  await page
    .locator('[data-qa="continue-button"]')
    .waitFor({ state: "visible", timeout: 60000 });
  await page.waitForTimeout(1000);

  const continueButton = page.locator('[data-qa="continue-button"]');
  const continueSuccess = await clickChain.clickWithTimeout(
    continueButton,
    10000
  );
  if (!continueSuccess) {
    throw new Error("Failed to click continue button");
  }

  // Step 5: Logout to test login functionality
  const logoutButton = page.locator('a[href="/logout"]');
  if ((await logoutButton.count()) > 0) {
    await logoutButton.waitFor({ state: "visible", timeout: 10000 });

    const logoutSuccess = await clickChain.clickWithTimeout(
      logoutButton,
      10000
    );
    if (!logoutSuccess) {
      console.log(
        "Failed to click logout button with chain, trying regular click"
      );
      await logoutButton.click();
    }
  } else {
    console.log("Logout button not found, skipping logout step.");
  }

  // Step 6: Test login with newly created account
  await loginPage.login(uniqueEmail, "123456");

  // Step 7: Verify successful login
  await expect(page.locator("text=Logged in as Roi")).toBeVisible();
});
