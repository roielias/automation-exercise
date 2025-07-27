import { Page, expect } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";
import { ProductsSectionSelectors } from "../selectors/products.selectors";

/**
 * Page Object Model class for products section functionality.
 * Handles product browsing and adding items to cart with robust interaction strategies.
 * Updated to use centralized selectors.
 */
export class ProductsSection {
  private clickChain: ClickHandlerChain;

  constructor(private page: Page) {
    this.clickChain = new ClickHandlerChain();
  }

  /**
   * Navigates to the products section with comprehensive loading strategy
   */
  async navigate() {
    await this.page.goto("https://automationexercise.com/", {
      timeout: 90000,
      waitUntil: "domcontentloaded",
    });

    await this.page.waitForTimeout(5000);

    try {
      // Wait for network to be idle for better stability
      await this.page.waitForLoadState("networkidle", { timeout: 30000 });
    } catch {
      // Continue if networkidle timeout occurs
    }
  }

  /**
   * Adds a product to cart by index with comprehensive error handling and retry logic
   */
  async addProductToCart(index: number) {
    await this.page.waitForSelector(
      ProductsSectionSelectors.products.container,
      { timeout: 30000 }
    );

    const productCount = await this.page
      .locator(ProductsSectionSelectors.products.container)
      .count();

    if (index >= productCount) {
      throw new Error(
        `Product index ${index} is out of range. Only ${productCount} products found.`
      );
    }

    await this.page.waitForTimeout(3000);

    const product = this.page
      .locator(ProductsSectionSelectors.products.container)
      .nth(index);

    // Ensure product is visible in viewport
    await product.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);

    try {
      // Close any existing modals that might interfere
      await this.page.keyboard.press("Escape");
      await this.page.waitForTimeout(1000);

      const closeButtons = this.page.locator(
        ProductsSectionSelectors.modal.closeAlternatives.join(", ")
      );
      const closeCount = await closeButtons.count();

      for (let i = 0; i < Math.min(closeCount, 3); i++) {
        try {
          await this.clickChain.clickWithTimeout(closeButtons.nth(i), 2000);
          await this.page.waitForTimeout(500);
        } catch {
          // Continue trying other close buttons
        }
      }
    } catch {
      // Continue if modal cleanup fails
    }

    await product.waitFor({ timeout: 15000 });

    // Hover over product to reveal add-to-cart button (retry mechanism)
    let hoverSuccess = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await expect(product).toBeVisible({ timeout: 10000 });
        await product.scrollIntoViewIfNeeded();
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

    const addToCartButton = product.locator(
      ProductsSectionSelectors.addToCart.overlayButton
    );
    await expect(addToCartButton).toBeVisible({ timeout: 20000 });

    let success = false;
    const maxAttempts = 5;

    // Multiple attempts to click add-to-cart button
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

        // Verify modal appears confirming item was added
        const modal = this.page.locator(
          ProductsSectionSelectors.modal.activeModal
        );
        await expect(modal).toBeVisible({ timeout: 20000 });

        await expect(
          this.page.locator(ProductsSectionSelectors.modal.container)
        ).toHaveText(new RegExp(ProductsSectionSelectors.modal.successText), {
          timeout: 10000,
        });

        success = true;
        break;
      } catch {
        if (attempts < maxAttempts - 1) {
          try {
            // Reset state for retry
            await this.page.keyboard.press("Escape");
            await this.page.waitForTimeout(1000);
          } catch {
            // Continue with retry
          }

          await this.page.waitForTimeout(3000);
          await product.scrollIntoViewIfNeeded();

          try {
            await product.hover({ timeout: 10000 });
            await this.page.waitForTimeout(2000);
          } catch {
            // Continue with retry
          }
        }
      }
    }

    if (!success) {
      throw new Error(
        `Failed to add product ${index} to cart after ${maxAttempts} attempts`
      );
    }

    // Close the confirmation modal
    try {
      const closeButton = this.page.locator(
        ProductsSectionSelectors.modal.closeButton
      );
      await expect(closeButton).toBeVisible({ timeout: 10000 });

      const closeSuccess = await this.clickChain.clickWithTimeout(
        closeButton,
        10000
      );
      if (!closeSuccess) {
        throw new Error("Failed to close modal");
      }

      await expect(
        this.page.locator(ProductsSectionSelectors.modal.container)
      ).toBeHidden({
        timeout: 10000,
      });
    } catch {
      try {
        // Fallback: Use keyboard to close modal
        await this.page.keyboard.press("Escape");
        await this.page.waitForTimeout(2000);
      } catch {
        // Continue if escape fails
      }

      // Force hide modal if still visible
      const isModalVisible = await this.page
        .locator(ProductsSectionSelectors.modal.activeModal)
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

    // Brief pause before next operation
    await this.page.waitForTimeout(2000);
  }
}
