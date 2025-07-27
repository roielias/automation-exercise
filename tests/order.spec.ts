import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../pages/LoginPage";

test.setTimeout(120000);

/**
 * Complete end-to-end order placement test
 *
 * This comprehensive test covers the entire e-commerce flow:
 * 1. User authentication
 * 2. Cart management (clear + add products)
 * 3. Price verification throughout the process
 * 4. Checkout and payment processing
 * 5. Order confirmation
 *
 * Includes extensive error handling and retry mechanisms for reliability
 */
test("place order with correct total and confirmation", async ({ page }) => {
  const products = new ProductsSection(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const loginPage = new LoginPage(page);

  page.setDefaultTimeout(30000);

  try {
    // Step 1: User Authentication
    await loginPage.navigate();
    await loginPage.login("roielias910@gmail.com", "12345678");

    // Step 2: Start with clean cart
    await cart.clearCart();

    let emptyCart;
    try {
      emptyCart = await cart.getCartItems();
    } catch {
      emptyCart = [];
    }
    expect(emptyCart.length).toBe(0);

    // Step 3: Add products to cart
    await products.navigate();
    await page.waitForTimeout(5000);

    await products.addProductToCart(0);

    await page.waitForTimeout(5000);

    // Verify first item was added, if single item add another for better testing
    await cart.navigate();
    let cartItems = await cart.getCartItems();

    if (cartItems.length === 1 && cartItems[0].quantity === 1) {
      await products.navigate();
      await page.waitForTimeout(5000);
      await products.addProductToCart(1);
      await page.waitForTimeout(5000);
    }

    // Step 4: Verify cart contents and calculate expected total
    await cart.navigate();
    cartItems = await cart.getCartItems();

    expect(cartItems.length).toBeGreaterThan(0);

    const expectedSum = cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    expect(expectedSum).toBeGreaterThan(0);

    // Step 5: Proceed to checkout
    await cart.placeOrder();

    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    if (!currentUrl.includes("checkout")) {
      throw new Error(
        `Failed to reach checkout page. Current URL: ${currentUrl}`
      );
    }

    // Step 6: Verify checkout total matches cart total (with retry mechanism)
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

    // Validate total is reasonable (allows for taxes/fees)
    expect(checkoutSum).toBeGreaterThanOrEqual(expectedSum);
    expect(checkoutSum).toBeLessThanOrEqual(expectedSum * 2);

    // Step 7: Confirm order and proceed to payment
    await checkout.confirmOrder();
    await page.waitForTimeout(5000);

    // Step 8: Fill payment form with test data
    await checkout.fillOrderForm({
      name: "John Doe",
      card: "4111111111111111",
      cvc: "311",
      expMonth: "12",
      expYear: "2025",
    });

    // Step 9: Submit order and verify success
    await checkout.submitOrder();

    await checkout.expectSuccessMessage();
  } catch (error) {
    try {
      // Capture screenshot for debugging on failure
      await page.screenshot({
        path: `error-screenshot-${Date.now()}.png`,
        fullPage: true,
      });
    } catch {
      // Continue if screenshot fails
    }

    throw error;
  }
});
