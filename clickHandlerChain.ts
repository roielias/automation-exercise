import { Locator } from "@playwright/test";
import { NormalClickHandler } from "./click-handlers/normalClickHandler";
import { ScrollAndClickHandler } from "./click-handlers/scrollAndClickHandler";
import { JsClickHandler } from "./click-handlers/jsClickHandler";

/**
 * Main orchestrator class that sets up and manages the click handler chain.
 *
 * This class configures the chain of responsibility pattern with different
 * click strategies arranged in order of preference:
 * 1. Normal click (most reliable)
 * 2. Scroll and click (for viewport issues)
 * 3. JavaScript click (fallback for complex DOM issues)
 */
export class ClickHandlerChain {
  private chain: NormalClickHandler;

  constructor() {
    // Initialize the chain with preferred order of handlers
    this.chain = new NormalClickHandler();
    this.chain
      .setNext(new ScrollAndClickHandler())
      .setNext(new JsClickHandler());
  }

  /**
   * Attempts to click an element with timeout using the configured handler chain
   *
   * @param element - The Playwright Locator to click
   * @param timeout - Maximum time to wait for successful click (in milliseconds)
   * @returns Promise<boolean> - true if any handler in chain succeeded, false if all failed
   * @throws Error if timeout is exceeded before successful click
   */
  async clickWithTimeout(element: Locator, timeout: number): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const success = await this.chain.handle(element);
        if (success) {
          return true;
        }
      } catch (error) {
        // Continue trying until timeout
      }

      // Small delay between attempts to avoid overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error(`Click operation timed out after ${timeout}ms`);
  }
}
