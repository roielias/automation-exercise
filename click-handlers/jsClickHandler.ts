import { ClickHandler } from "./clickHandler";
import { Locator } from "@playwright/test";

/**
 * JavaScript click handler that uses element.evaluate() to perform clicks.
 * This approach bypasses Playwright's built-in click mechanics and directly
 * calls the DOM element's click() method via JavaScript execution.
 *
 * Useful when standard Playwright clicks fail due to element interception,
 * overlay issues, or other DOM-related problems.
 */
export class JsClickHandler extends ClickHandler {
  /**
   * Attempts to click the element using JavaScript evaluation
   * @param element - The Playwright Locator to click
   * @returns Promise<boolean> - true if JS click succeeded, false if failed
   */
  async handle(element: Locator): Promise<boolean> {
    try {
      // Execute click directly on the DOM element via JavaScript
      await element.evaluate((el: HTMLElement) => el.click());
      return true;
    } catch {
      // If JS click fails, delegate to next handler in chain
      if (this.nextHandler) {
        return this.nextHandler.handle(element);
      }
      return false;
    }
  }
}
