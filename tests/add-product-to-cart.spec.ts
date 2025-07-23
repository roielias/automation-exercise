import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";

test("should add product to cart and show confirmation modal", async ({
  page,
}) => {
  const productsSection = new ProductsSection(page);
  await productsSection.navigate();

  await productsSection.addProductToCart(0);

  await expect(page.locator("#cartModal")).toBeVisible();

  await page.click('button:has-text("Continue Shopping")');
  await expect(page.locator("#cartModal")).toBeHidden();
});
