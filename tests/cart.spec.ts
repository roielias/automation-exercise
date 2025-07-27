import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { CartPage } from "../pages/CartPage";

/**
 * Test suite for shopping cart functionality
 * Ensures Firefox/browser compatibility via stronger selectors, visibility waits, and scroll handling.
 */

test.describe("Cart functionality", () => {
  test.setTimeout(90000); // Global timeout for suite

  /**
   * Verifies that cart items display correct pricing calculations.
   * Ensures: unit price × quantity === total price for each cart item.
   */
  test("verify cart contents and total sum", async ({ page }) => {
    const products = new ProductsSection(page);
    const cart = new CartPage(page);

    // Step 1: Navigate to product list and wait for items
    await products.navigate();
    const allProducts = page.locator(".single-products");
    await expect(allProducts.nth(1)).toBeVisible({ timeout: 20000 });

    // Step 2: Add first two products with proper scroll + hover for Firefox compatibility
    await products.addProductToCart(0);
    await products.addProductToCart(1);

    // Step 3: Navigate to cart and validate URL
    await cart.navigate();
    await expect(page).toHaveURL(/.*view_cart/);

    // Step 4: Validate unit price × quantity === total price
    const cartItems = await cart.getCartItems();
    for (const item of cartItems) {
      const expectedTotal = item.unitPrice * item.quantity;
      expect(item.totalPrice).toBe(expectedTotal);
    }
  });

  /**
   * Ensures that cart clearing flow works properly
   * Adds products, clears cart, and verifies it is empty.
   */
  test("clear cart and verify it is empty", async ({ page }) => {
    const products = new ProductsSection(page);
    const cart = new CartPage(page);

    // Step 1: Go to product list and wait for visibility
    await products.navigate();
    const productList = page.locator(".single-products");
    await expect(productList.first()).toBeVisible({ timeout: 20000 });

    // Step 2: Add two products with stable interaction
    await products.addProductToCart(0);
    await products.addProductToCart(1);

    // Step 3: Navigate to cart
    await cart.navigate();
    await expect(page).toHaveURL(/.*view_cart/);

    // Step 4: Clear the cart
    await cart.clearCart();

    // Step 5: Confirm cart is empty
    const itemsAfterClear = await cart.getCartItems();
    expect(itemsAfterClear.length).toBe(0);
  });
});
