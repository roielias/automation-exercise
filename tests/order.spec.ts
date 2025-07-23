import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test("place order with correct total and confirmation", async ({ page }) => {
  const products = new ProductsSection(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await products.navigate();
  await products.addProductToCart(0);
  await products.addProductToCart(1);

  await cart.navigate();
  const cartItems = await cart.getCartItems();
  await cart.placeOrder();

  await expect(page.locator("text=Review Your Order")).toBeVisible();

  const expectedSum = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const checkoutSum = await checkout.getTotalOrderAmount();

  expect(checkoutSum).toBe(expectedSum);

  await checkout.fillOrderForm({
    name: "John Doe",
    card: "4111111111111111",
  });

  await checkout.submitOrder();
  await checkout.expectSuccessMessage();
});
