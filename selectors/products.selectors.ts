/**
 * Selectors for Products Section functionality
 * Includes product listings, add to cart interactions, and modal handling
 */
export const ProductsSectionSelectors = {
  // Product containers
  products: {
    container: ".single-products",
    productInfo: ".productinfo",
    productTitle: ".productinfo > p",
  },

  // Add to cart functionality
  addToCart: {
    button: ".add-to-cart",
    overlay: ".product-overlay",
    overlayButton: ".product-overlay .add-to-cart",
  },

  // Cart modal
  modal: {
    container: "#cartModal",
    activeModal: "#cartModal.modal.show",
    closeButton: ".close-modal",
    successText: "Added!",

    // Modal close alternatives
    closeAlternatives: [
      '[class*="close"]',
      '[class*="dismiss"]',
      ".modal-close",
    ],
  },

  // Page navigation
  navigation: {
    home: 'a[href="/"]',
  },
} as const;
