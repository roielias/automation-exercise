import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { ClickHandlerChain } from "../clickHandlerChain";

/**
 * Simple test demonstrating basic add-to-cart functionality
 * Tests the core user flow of adding a product to the shopping cart
 */
test("simple add to cart test", async ({ page }) => {
  const productsSection = new ProductsSection(page);
  const clickChain = new ClickHandlerChain();

  await productsSection.navigate();

  // Wait for products to be visible before interaction
  await page.waitForSelector(".single-products", { state: "visible" });

  // Hover over first product to reveal add-to-cart button
  await page.locator(".single-products").first().hover();

  const addToCartButton = page
    .locator(".single-products")
    .first()
    .locator(".add-to-cart")
    .first();

  // Use click handler chain for reliable clicking
  const success = await clickChain.clickWithTimeout(addToCartButton, 10000);
  if (!success) {
    throw new Error("Failed to click add to cart button");
  }

  // Verify confirmation modal appears
  await expect(page.locator("#cartModal.modal.show")).toBeVisible();

  // Verify success message in modal
  await expect(page.locator("#cartModal")).toContainText("Added!");

  // Close the modal
  const closeButton = page.locator(".close-modal");
  const closeSuccess = await clickChain.clickWithTimeout(closeButton, 10000);
  if (!closeSuccess) {
    throw new Error("Failed to close modal");
  }

  // Verify modal is hidden after closing
  await expect(page.locator("#cartModal")).toBeHidden();
});
