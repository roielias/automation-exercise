import { ClickHandler } from "./clickHandler";
import { Locator } from "@playwright/test";

/**
 * Scroll and click handler that ensures element visibility before clicking.
 * This handler first scrolls the element into view if needed, then performs a click.
 *
 * Particularly useful for elements that are outside the viewport or
 * partially obscured by other elements.
 */
export class ScrollAndClickHandler extends ClickHandler {
  /**
   * Scrolls element into view if needed, then attempts to click it
   * @param element - The Playwright Locator to scroll and click
   * @returns Promise<boolean> - true if scroll+click succeeded, false if failed
   */
  async handle(element: Locator): Promise<boolean> {
    try {
      // Ensure element is visible in viewport before clicking
      await element.scrollIntoViewIfNeeded();
      await element.click();
      return true;
    } catch {
      // If scroll+click fails, delegate to next handler in chain
      if (this.nextHandler) {
        return this.nextHandler.handle(element);
      }
      return false;
    }
  }
}
