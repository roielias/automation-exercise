import { test, expect } from "@playwright/test";
import { ProductsSection } from "../pages/ProductsSection";

test("simple add to cart test", async ({ page }) => {
  const productsSection = new ProductsSection(page);
  await productsSection.navigate();

  await page.waitForSelector(".single-products", { state: "visible" });

  await page.locator(".single-products").first().hover();

  await page
    .locator(".single-products")
    .first()
    .locator(".add-to-cart")
    .first()
    .click();

  await expect(page.locator("#cartModal.modal.show")).toBeVisible();

  await expect(page.locator("#cartModal")).toContainText("Added!");

  await page.click(".close-modal");

  await expect(page.locator("#cartModal")).toBeHidden();
});
