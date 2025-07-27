import { Page } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";

/**
 * Page Object Model class for login and registration functionality.
 * Handles user authentication and new user registration processes.
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
   *
   * @param name - User's full name
   * @param email - User's email address (must be unique)
   */
  async registerNewUser(name: string, email: string) {
    await this.page.locator('[data-qa="signup-name"]').fill(name);
    await this.page.locator('[data-qa="signup-email"]').fill(email);

    const signupButton = this.page.locator('[data-qa="signup-button"]');
    const success = await this.clickChain.clickWithTimeout(signupButton, 10000);
    if (!success) {
      throw new Error("Failed to click signup button");
    }
  }

  /**
   * Performs user login with existing credentials
   *
   * @param email - User's email address
   * @param password - User's password
   */
  async login(email: string, password: string) {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);

    const loginButton = this.page.locator('[data-qa="login-button"]');
    const success = await this.clickChain.clickWithTimeout(loginButton, 10000);
    if (!success) {
      throw new Error("Failed to click login button");
    }
  }
}
