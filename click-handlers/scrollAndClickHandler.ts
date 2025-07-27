import { ClickHandler } from "./clickHandler";
import { Locator } from "@playwright/test";

export class ScrollAndClickHandler extends ClickHandler {
  async handle(element: Locator): Promise<boolean> {
    try {
      await element.scrollIntoViewIfNeeded();
      await element.click();
      return true;
    } catch {
      if (this.nextHandler) {
        return this.nextHandler.handle(element);
      }
      return false;
    }
  }
}
