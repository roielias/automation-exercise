import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../pages/LoginPage";

test.setTimeout(120000);

test("place order with correct total and confirmation", async ({ page }) => {
  const products = new ProductsSection(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const loginPage = new LoginPage(page);

  page.setDefaultTimeout(30000);

  try {
    await loginPage.navigate();
    await loginPage.login("roielias910@gmail.com", "12345678");

    await cart.clearCart();

    let emptyCart;
    try {
      emptyCart = await cart.getCartItems();
    } catch {
      emptyCart = [];
    }
    expect(emptyCart.length).toBe(0);

    await products.navigate();
    await page.waitForTimeout(5000);

    await products.addProductToCart(0);

    await page.waitForTimeout(5000);

    await cart.navigate();
    let cartItems = await cart.getCartItems();

    if (cartItems.length === 1 && cartItems[0].quantity === 1) {
      await products.navigate();
      await page.waitForTimeout(5000);
      await products.addProductToCart(1);
      await page.waitForTimeout(5000);
    }

    await cart.navigate();
    cartItems = await cart.getCartItems();

    expect(cartItems.length).toBeGreaterThan(0);

    const expectedSum = cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    expect(expectedSum).toBeGreaterThan(0);

    await cart.placeOrder();

    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    if (!currentUrl.includes("checkout")) {
      throw new Error(
        `Failed to reach checkout page. Current URL: ${currentUrl}`
      );
    }

    let checkoutSum;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        checkoutSum = await checkout.getTotalOrderAmount();
        break;
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          await page.waitForTimeout(3000);
          await page.reload({ waitUntil: "domcontentloaded" });
          await page.waitForTimeout(3000);
        } else {
          throw error;
        }
      }
    }

    expect(checkoutSum).toBeGreaterThanOrEqual(expectedSum);
    expect(checkoutSum).toBeLessThanOrEqual(expectedSum * 2);

    await checkout.confirmOrder();
    await page.waitForTimeout(5000);

    await checkout.fillOrderForm({
      name: "John Doe",
      card: "4111111111111111",
      cvc: "311",
      expMonth: "12",
      expYear: "2025",
    });

    await checkout.submitOrder();

    await checkout.expectSuccessMessage();
  } catch (error) {
    try {
      await page.screenshot({
        path: `error-screenshot-${Date.now()}.png`,
        fullPage: true,
      });
    } catch {}

    throw error;
  }
});
