import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../pages/LoginPage";

test("place order with correct total and confirmation", async ({ page }) => {
  const products = new ProductsSection(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login("roielias910@gmail.com", "12345678");

  await products.navigate();
  await products.addProductToCart(0);
  await products.addProductToCart(1);

  await cart.navigate();
  const cartItems = await cart.getCartItems();

  const expectedSum = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  await cart.placeOrder();
  const checkoutSum = await checkout.getTotalOrderAmount();

  expect(checkoutSum).toBe(expectedSum);

  await checkout.fillOrderForm({
    name: "John Doe",
    card: "4111111111111111",
  });

  await checkout.submitOrder();
  await checkout.expectSuccessMessage();
});
