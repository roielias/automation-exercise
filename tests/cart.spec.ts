import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { CartPage } from "../pages/CartPage";

test("verify cart contents and total sum", async ({ page }) => {
  test.setTimeout(90000);
  const products = new ProductsSection(page);
  const cart = new CartPage(page);

  await products.navigate();

  await products.addProductToCart(0);
  await products.addProductToCart(1);

  await cart.navigate();

  await expect(page).toHaveURL(/.*view_cart/);

  const cartItems = await cart.getCartItems();

  for (const item of cartItems) {
    const expectedTotal = item.unitPrice * item.quantity;
    expect(item.totalPrice).toBe(expectedTotal);
  }
});

test("clear cart and verify it is empty", async ({ page }) => {
  test.setTimeout(90000);
  const products = new ProductsSection(page);
  const cart = new CartPage(page);

  await products.navigate();

  await products.addProductToCart(0);
  await products.addProductToCart(1);

  await cart.navigate();

  await cart.clearCart();

  const itemsAfterClear = await cart.getCartItems();
  expect(itemsAfterClear.length).toBe(0);
});
