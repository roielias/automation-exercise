import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { CartPage } from "../pages/CartPage";

test("verify cart contents and total sum", async ({ page }) => {
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
