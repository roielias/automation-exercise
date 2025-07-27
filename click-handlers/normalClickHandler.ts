import { ClickHandler } from "./clickHandler";
import { Locator } from "@playwright/test";

/**
 * Standard Playwright click handler that uses the built-in click() method.
 * This is typically the first handler in the chain as it represents
 * the most reliable and expected way to interact with elements.
 *
 * Handles standard clicks with Playwright's built-in waiting mechanisms,
 * actionability checks, and event simulation.
 */
export class NormalClickHandler extends ClickHandler {
  /**
   * Attempts to click the element using Playwright's standard click method
   * @param element - The Playwright Locator to click
   * @returns Promise<boolean> - true if click succeeded, false if failed
   */
  async handle(element: Locator): Promise<boolean> {
    try {
      await element.click();
      return true;
    } catch {
      // If standard click fails, delegate to next handler in chain
      if (this.nextHandler) {
        return this.nextHandler.handle(element);
      }
      return false;
    }
  }
}
