import { Locator } from "@playwright/test";
import { NormalClickHandler } from "./click-handlers/normalClickHandler";
import { JsClickHandler } from "./click-handlers/jsClickHandler";
import { ScrollAndClickHandler } from "./click-handlers/scrollAndClickHandler";

export class ClickHandlerChain {
  private chain: NormalClickHandler;

  constructor() {
    this.chain = new NormalClickHandler();
    const scrollHandler = new ScrollAndClickHandler();
    const jsHandler = new JsClickHandler();

    this.chain.setNext(scrollHandler).setNext(jsHandler);
  }

  async click(element: Locator): Promise<boolean> {
    return await this.chain.handle(element);
  }

  async clickWithTimeout(
    element: Locator,
    timeout: number = 10000
  ): Promise<boolean> {
    const timeoutPromise = new Promise<boolean>((_, reject) => {
      setTimeout(
        () => reject(new Error(`Click timeout after ${timeout}ms`)),
        timeout
      );
    });

    const clickPromise = this.click(element);

    try {
      return await Promise.race([clickPromise, timeoutPromise]);
    } catch (error) {
      throw new Error(`Failed to click element: ${error}`);
    }
  }
}
