import { Page, expect } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";

export class ProductsSection {
  private clickChain: ClickHandlerChain;

  constructor(private page: Page) {
    this.clickChain = new ClickHandlerChain();
  }

  async navigate() {
    await this.page.goto("https://automationexercise.com/", {
      timeout: 90000,
      waitUntil: "domcontentloaded",
    });

    await this.page.waitForTimeout(5000);

    try {
      await this.page.waitForLoadState("networkidle", { timeout: 30000 });
    } catch {}
  }

  async addProductToCart(index: number) {
    await this.page.waitForSelector(".single-products", { timeout: 30000 });

    const productCount = await this.page.locator(".single-products").count();

    if (index >= productCount) {
      throw new Error(
        `Product index ${index} is out of range. Only ${productCount} products found.`
      );
    }

    await this.page.waitForTimeout(3000);

    const product = this.page.locator(".single-products").nth(index);

    await product.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);

    try {
      await this.page.keyboard.press("Escape");
      await this.page.waitForTimeout(1000);

      const closeButtons = this.page.locator(
        '[class*="close"], [class*="dismiss"], .modal-close'
      );
      const closeCount = await closeButtons.count();

      for (let i = 0; i < Math.min(closeCount, 3); i++) {
        try {
          await this.clickChain.clickWithTimeout(closeButtons.nth(i), 2000);
          await this.page.waitForTimeout(500);
        } catch {}
      }
    } catch {}

    await product.waitFor({ timeout: 15000 });

    let hoverSuccess = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await product.hover({ timeout: 10000 });
        await this.page.waitForTimeout(2000);
        hoverSuccess = true;
        break;
      } catch {
        if (attempt < 2) {
          await this.page.waitForTimeout(2000);
        }
      }
    }

    if (!hoverSuccess) {
      throw new Error(`Failed to hover over product ${index} after 3 attempts`);
    }

    const addToCartButton = product.locator(".product-overlay .add-to-cart");
    await expect(addToCartButton).toBeVisible({ timeout: 20000 });

    let success = false;
    const maxAttempts = 5;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      try {
        await expect(addToCartButton).toBeVisible({ timeout: 10000 });
        await expect(addToCartButton).toBeEnabled({ timeout: 5000 });

        const clickSuccess = await this.clickChain.clickWithTimeout(
          addToCartButton,
          15000
        );
        if (!clickSuccess) {
          throw new Error("Click failed through chain");
        }

        const modal = this.page.locator("#cartModal.modal.show");
        await expect(modal).toBeVisible({ timeout: 20000 });

        await expect(this.page.locator("#cartModal")).toHaveText(/Added!/, {
          timeout: 10000,
        });

        success = true;
        break;
      } catch {
        if (attempts < maxAttempts - 1) {
          try {
            await this.page.keyboard.press("Escape");
            await this.page.waitForTimeout(1000);
          } catch {}

          await this.page.waitForTimeout(3000);
          await product.scrollIntoViewIfNeeded();

          try {
            await product.hover({ timeout: 10000 });
            await this.page.waitForTimeout(2000);
          } catch {}
        }
      }
    }

    if (!success) {
      throw new Error(
        `Failed to add product ${index} to cart after ${maxAttempts} attempts`
      );
    }

    try {
      const closeButton = this.page.locator(".close-modal");
      await expect(closeButton).toBeVisible({ timeout: 10000 });

      const closeSuccess = await this.clickChain.clickWithTimeout(
        closeButton,
        10000
      );
      if (!closeSuccess) {
        throw new Error("Failed to close modal");
      }

      await expect(this.page.locator("#cartModal")).toBeHidden({
        timeout: 10000,
      });
    } catch {
      try {
        await this.page.keyboard.press("Escape");
        await this.page.waitForTimeout(2000);
      } catch {}

      const isModalVisible = await this.page
        .locator("#cartModal.modal.show")
        .isVisible();
      if (isModalVisible) {
        await this.page.evaluate(() => {
          const modal = document.querySelector("#cartModal");
          if (modal) {
            (modal as any).style.display = "none";
          }
        });
      }
    }

    await this.page.waitForTimeout(2000);
  }
}
