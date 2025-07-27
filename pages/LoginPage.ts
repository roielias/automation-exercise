import { Page } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";
import { LoginPageSelectors } from "../selectors/login.selectors";

/**
 * Page Object Model class for login and registration functionality.
 * Handles user authentication and new user registration processes.
 * Updated to use centralized selectors.
 */
export class LoginPage {
  private clickChain: ClickHandlerChain;

  constructor(private page: Page) {
    this.clickChain = new ClickHandlerChain();
  }

  /**
   * Navigates to the login page
   */
  async navigate() {
    await this.page.goto("https://automationexercise.com/login", {
      waitUntil: "load",
      timeout: 60000,
    });
  }

  /**
   * Initiates new user registration process
   */
  async registerNewUser(name: string, email: string) {
    await this.page.locator(LoginPageSelectors.signup.name).fill(name);
    await this.page.locator(LoginPageSelectors.signup.email).fill(email);

    const signupButton = this.page.locator(LoginPageSelectors.signup.button);
    const success = await this.clickChain.clickWithTimeout(signupButton, 10000);
    if (!success) {
      throw new Error("Failed to click signup button");
    }
  }

  /**
   * Performs user login with existing credentials
   */
  async login(email: string, password: string) {
    await this.page.locator(LoginPageSelectors.login.email).fill(email);
    await this.page.locator(LoginPageSelectors.login.password).fill(password);

    const loginButton = this.page.locator(LoginPageSelectors.login.button);
    const success = await this.clickChain.clickWithTimeout(loginButton, 10000);
    if (!success) {
      throw new Error("Failed to click login button");
    }
  }
}
