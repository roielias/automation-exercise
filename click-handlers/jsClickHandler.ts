import { ClickHandler } from "./clickHandler";
import { Locator } from "@playwright/test";

export class JsClickHandler extends ClickHandler {
  async handle(element: Locator): Promise<boolean> {
    try {
      await element.evaluate((el: HTMLElement) => el.click());
      return true;
    } catch {
      if (this.nextHandler) {
        return this.nextHandler.handle(element);
      }
      return false;
    }
  }
}
