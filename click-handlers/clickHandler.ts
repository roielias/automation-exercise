import { Locator } from "@playwright/test";

/**
 * Abstract base class implementing the Chain of Responsibility pattern
 * for handling different click strategies in Playwright tests.
 *
 * This pattern allows multiple click handlers to be chained together,
 * where each handler attempts to click an element and passes control
 * to the next handler if it fails.
 */
export abstract class ClickHandler {
  protected nextHandler?: ClickHandler;

  /**
   * Sets the next handler in the chain
   * @param handler - The next ClickHandler to try if this one fails
   * @returns The handler that was set as next (for method chaining)
   */
  setNext(handler: ClickHandler): ClickHandler {
    this.nextHandler = handler;
    return handler;
  }

  /**
   * Handles the click operation. Default implementation delegates to next handler.
   * Concrete implementations should override this method to provide specific click logic.
   *
   * @param element - The Playwright Locator to click
   * @returns Promise<boolean> - true if click succeeded, false otherwise
   */
  async handle(element: Locator): Promise<boolean> {
    if (this.nextHandler) {
      return this.nextHandler.handle(element);
    }
    return false;
  }
}
