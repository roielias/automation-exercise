import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { ClickHandlerChain } from "../clickHandlerChain";

test("simple add to cart test", async ({ page }) => {
  const productsSection = new ProductsSection(page);
  const clickChain = new ClickHandlerChain();

  await productsSection.navigate();

  await page.waitForSelector(".single-products", { state: "visible" });

  await page.locator(".single-products").first().hover();

  const addToCartButton = page
    .locator(".single-products")
    .first()
    .locator(".add-to-cart")
    .first();

  const success = await clickChain.clickWithTimeout(addToCartButton, 10000);
  if (!success) {
    throw new Error("Failed to click add to cart button");
  }

  await expect(page.locator("#cartModal.modal.show")).toBeVisible();

  await expect(page.locator("#cartModal")).toContainText("Added!");

  const closeButton = page.locator(".close-modal");
  const closeSuccess = await clickChain.clickWithTimeout(closeButton, 10000);
  if (!closeSuccess) {
    throw new Error("Failed to close modal");
  }

  await expect(page.locator("#cartModal")).toBeHidden();
});
