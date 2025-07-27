/**
 * Selectors for Checkout Page functionality
 * Includes selectors for order confirmation, payment forms, and success pages
 */
export const CheckoutPageSelectors = {
  // Page identification
  pages: {
    checkout: /.*\/checkout/,
    payment: /.*\/payment/,
    success: /.*\/payment_done\/\d+/,
  },

  // Order total
  totalAmount: {
    primary: 'tr:has(h4:has-text("Total Amount")) .cart_total_price',
    alternatives: [
      ".cart_total_price:last-child",
      'tr:contains("Total Amount") .cart_total_price',
      ".total_amount .cart_total_price",
    ],
  },

  // Payment form fields
  paymentForm: {
    nameOnCard: '[data-qa="name-on-card"]',
    cardNumber: '[data-qa="card-number"]',
    cvc: '[placeholder="ex. 311"]',
    expiryMonth: '[placeholder="MM"]',
    expiryYear: '[placeholder="YYYY"]',
    payButton: '[data-qa="pay-button"]',
  },

  // Order confirmation
  confirmButton: "a.check_out",

  // Success indicators
  successIndicators: [
    ".alert-success",
    'h2:has-text("Order Placed!")',
    'p:has-text("Congratulations")',
    ".order-success",
    "text=Your order has been placed successfully!",
    "text=Order Placed!",
    '[data-qa="order-placed"]',
    ".success-message",
    'h1:has-text("Order Placed")',
  ],
} as const;
