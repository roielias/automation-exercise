import { Locator } from "@playwright/test";

export abstract class ClickHandler {
  protected nextHandler?: ClickHandler;

  setNext(handler: ClickHandler): ClickHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(element: Locator): Promise<boolean> {
    if (this.nextHandler) {
      return this.nextHandler.handle(element);
    }
    return false;
  }
}
