import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ClickHandlerChain } from "../clickHandlerChain";
import { LoginPageSelectors } from "../selectors/login.selectors";

/**
 * Complete user registration and login flow test
 * Updated to use centralized selectors for better maintainability
 */
test("register and login a new user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const clickChain = new ClickHandlerChain();

  await loginPage.navigate();

  // Step 1: Initiate registration with unique email
  const uniqueEmail = `roi${Date.now()}@test.com`;
  await loginPage.registerNewUser("Roi", uniqueEmail);

  // Step 2: Fill detailed registration form using centralized selectors
  await page.locator(LoginPageSelectors.registration.password).fill("123456");
  await page
    .locator(LoginPageSelectors.registration.birthDay)
    .selectOption("10");
  await page
    .locator(LoginPageSelectors.registration.birthMonth)
    .selectOption("5");
  await page
    .locator(LoginPageSelectors.registration.birthYear)
    .selectOption("1997");

  // Handle checkbox selections using click chain for reliability
  const genderCheckbox = page.locator(
    LoginPageSelectors.registration.genderMale
  );
  await clickChain.clickWithTimeout(genderCheckbox, 5000);

  const newsletterCheckbox = page.locator(
    LoginPageSelectors.registration.newsletter
  );
  await clickChain.clickWithTimeout(newsletterCheckbox, 5000);

  const optinCheckbox = page.locator(LoginPageSelectors.registration.optin);
  await clickChain.clickWithTimeout(optinCheckbox, 5000);

  // Fill address information using centralized selectors
  await page.locator(LoginPageSelectors.registration.firstName).fill("Roi");
  await page.locator(LoginPageSelectors.registration.lastName).fill("Elias");
  await page
    .locator(LoginPageSelectors.registration.company)
    .fill("Testing LTD");
  await page.locator(LoginPageSelectors.registration.address).fill("Herzl 20");
  await page.locator(LoginPageSelectors.registration.address2).fill("Floor 2");
  await page.locator(LoginPageSelectors.registration.state).fill("Holon");
  await page.locator(LoginPageSelectors.registration.city).fill("Holon");
  await page.locator(LoginPageSelectors.registration.zipcode).fill("12345");
  await page
    .locator(LoginPageSelectors.registration.mobileNumber)
    .fill("0500000000");

  // Step 3: Submit registration form
  const createAccountButton = page.locator(
    LoginPageSelectors.registration.createAccountButton
  );
  const createSuccess = await clickChain.clickWithTimeout(
    createAccountButton,
    10000
  );
  if (!createSuccess) {
    throw new Error("Failed to click create account button");
  }

  // Step 4: Handle account creation confirmation
  await page
    .locator(LoginPageSelectors.registration.continueButton)
    .waitFor({ state: "visible", timeout: 60000 });
  await page.waitForTimeout(1000);

  const continueButton = page.locator(
    LoginPageSelectors.registration.continueButton
  );
  const continueSuccess = await clickChain.clickWithTimeout(
    continueButton,
    10000
  );
  if (!continueSuccess) {
    throw new Error("Failed to click continue button");
  }

  // Step 5: Logout to test login functionality
  const logoutButton = page.locator(LoginPageSelectors.userState.logoutButton);
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

  // Step 7: Verify successful login using centralized selector
  await expect(
    page.locator(LoginPageSelectors.userState.loggedInText + " Roi")
  ).toBeVisible();
});
