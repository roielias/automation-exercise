import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { CartPage } from "../pages/CartPage";

/**
 * Test suite for shopping cart functionality
 * Covers cart content verification and cart clearing operations
 */

/**
 * Verifies that cart items display correct pricing calculations
 * Tests the mathematical accuracy of unit price × quantity = total price
 */
test("verify cart contents and total sum", async ({ page }) => {
  test.setTimeout(90000);
  const products = new ProductsSection(page);
  const cart = new CartPage(page);

  await products.navigate();

  // Add multiple products to cart for comprehensive testing
  await products.addProductToCart(0);
  await products.addProductToCart(1);

  await cart.navigate();

  // Verify we're on the cart page
  await expect(page).toHaveURL(/.*view_cart/);

  const cartItems = await cart.getCartItems();

  // Validate price calculations for each item
  for (const item of cartItems) {
    const expectedTotal = item.unitPrice * item.quantity;
    expect(item.totalPrice).toBe(expectedTotal);
  }
});

/**
 * Tests the cart clearing functionality
 * Ensures that all items can be removed and cart becomes empty
 */
test("clear cart and verify it is empty", async ({ page }) => {
  test.setTimeout(90000);
  const products = new ProductsSection(page);
  const cart = new CartPage(page);

  await products.navigate();

  // Add products to have items to clear
  await products.addProductToCart(0);
  await products.addProductToCart(1);

  await cart.navigate();

  // Clear all items from cart
  await cart.clearCart();

  // Verify cart is empty after clearing
  const itemsAfterClear = await cart.getCartItems();
  expect(itemsAfterClear.length).toBe(0);
});
