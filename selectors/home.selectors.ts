/**
 * Selectors for Home Page functionality
 * Includes navigation, categories, and product display elements
 */
export const HomePageSelectors = {
  // Page identification
  slider: "#slider",

  // Top navigation
  navigation: {
    home: 'a[href="/"]',
    products: 'a:has-text("Products")',
    cart: 'a:has-text("Cart")',
    signupLogin: 'a:has-text("Signup / Login")',
    testCases: 'a[href="/test_cases"]',
    contactUs: 'a[href="/contact_us"]',
  },

  // Categories and accordion
  categories: {
    accordion: "#accordian",
    panels: "#accordian > .panel",
    panelCollapse: ".panel-collapse",
    categoryLinks: ".panel-collapse a",
    expandedPanel: ".panel-collapse.in",
  },

  // Products display
  products: {
    container: ".single-products",
    titles: ".productinfo > p",
    allProductsTitle: 'h2:has-text("All Products")',
  },
} as const;
