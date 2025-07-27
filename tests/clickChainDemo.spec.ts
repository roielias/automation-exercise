import { test, expect } from "@playwright/test";
import { ClickHandlerChain } from "../clickHandlerChain";
import { ProductsSection } from "../pages/ProductsSection";
import { CartPage } from "../pages/CartPage";

/**
 * Demonstration test for the Click Handler Chain functionality
 * Shows various scenarios where the chain provides reliable clicking
 */
test("demonstrate click handler chain usage", async ({ page }) => {
  const clickChain = new ClickHandlerChain();
  const products = new ProductsSection(page);
  const cart = new CartPage(page);

  test.setTimeout(60000);

  await products.navigate();

  // Test 1: Simple navigation link click
  const homeLink = page.locator('a[href="/"]').first();
  const homeSuccess = await clickChain.clickWithTimeout(homeLink, 5000);
  expect(homeSuccess).toBe(true);

  await page.waitForTimeout(2000);

  await page.waitForSelector(".single-products", { state: "visible" });

  // Test 2: Complex product interaction requiring hover + click
  const product = page.locator(".single-products").nth(5);

  await product.hover();
  await page.waitForTimeout(2000);

  const addButton = product.locator(".add-to-cart");

  console.log("Attempting to click add to cart button with chain...");
  const addSuccess = await clickChain.clickWithTimeout(addButton, 10000);

  if (addSuccess) {
    console.log("Successfully clicked add to cart button!");

    // Verify modal appears after successful click
    await expect(page.locator("#cartModal.modal.show")).toBeVisible({
      timeout: 10000,
    });

    // Close modal using click chain
    const closeButton = page.locator(".close-modal");
    const closeSuccess = await clickChain.clickWithTimeout(closeButton, 5000);
    expect(closeSuccess).toBe(true);
  } else {
    console.log("Failed to click add to cart button even with chain");
  }

  // Test 3: Cart item deletion
  await cart.navigate();

  const deleteButtons = page.locator(".cart_quantity_delete");
  const deleteCount = await deleteButtons.count();

  if (deleteCount > 0) {
    console.log("Attempting to delete cart item with chain...");
    const deleteSuccess = await clickChain.clickWithTimeout(
      deleteButtons.first(),
      10000
    );

    if (deleteSuccess) {
      console.log("Successfully deleted cart item!");
      await page.waitForTimeout(3000);
    } else {
      console.log("Failed to delete cart item");
    }
  }

  // Test 4: Handling non-existent elements (error scenario)
  try {
    const nonExistentElement = page.locator("#this-element-does-not-exist");
    const failureResult = await clickChain.clickWithTimeout(
      nonExistentElement,
      2000
    );
    expect(failureResult).toBe(false);
  } catch (error) {
    console.log("Expected failure caught:", error.message);
    expect(error.message).toContain("timeout");
  }
});

/**
 * Performance comparison test between normal clicking and chain clicking
 * Demonstrates the reliability benefits of the chain approach
 */
test("compare normal click vs chain click performance", async ({ page }) => {
  const clickChain = new ClickHandlerChain();
  const products = new ProductsSection(page);

  await products.navigate();
  await page.waitForSelector(".single-products", { state: "visible" });

  // Test normal click performance and reliability
  const startNormal = Date.now();
  try {
    await page.locator('a[href="/"]').first().click({ timeout: 5000 });
  } catch (error) {
    console.log("Normal click failed:", error.message);
  }
  const normalTime = Date.now() - startNormal;

  await page.waitForTimeout(1000);
  await products.navigate();

  // Test chain click performance and reliability
  const startChain = Date.now();
  const chainSuccess = await clickChain.clickWithTimeout(
    page.locator('a[href="/"]').first(),
    5000
  );
  const chainTime = Date.now() - startChain;

  console.log(`Normal click time: ${normalTime}ms`);
  console.log(`Chain click time: ${chainTime}ms`);
  console.log(`Chain success: ${chainSuccess}`);

  // Chain should succeed even if normal click might fail
  expect(chainSuccess).toBe(true);
});
