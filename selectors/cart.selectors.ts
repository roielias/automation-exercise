/**
 * Selectors for Cart Page functionality
 * Centralized location for all cart-related element selectors
 */
export const CartPageSelectors = {
  // Cart table and structure
  cartTable: "#cart_info_table",
  cartRows: 'tr[id^="product-"]',

  // Empty cart indicators
  emptyCartIndicators: [
    "text=Your shopping cart is empty!",
    ".cart-empty",
    "text=Cart is empty",
    "#cart_empty",
  ],

  // Cart item details
  cartItem: {
    title: ".cart_description h4 a",
    quantity: ".cart_quantity button.disabled",
    unitPrice: ".cart_price p",
    totalPrice: ".cart_total_price",
    deleteButton: ".cart_quantity_delete",
  },

  // Checkout process
  checkoutButton: 'a.check_out, a:has-text("Proceed To Checkout")',

  // Page navigation
  activeCartPage: 'li.active:has-text("Shopping Cart")',
} as const;
