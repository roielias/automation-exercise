/**
 * Selectors for Contact Us Page functionality
 * Includes form fields, submission buttons, and validation elements
 */
export const ContactUsSelectors = {
  // Contact form fields
  form: {
    container: "#contact-us-form",
    name: '[name="name"]',
    email: '[name="email"]',
    subject: '[name="subject"]',
    message: '[name="message"]',
    submitButton: 'input[name="submit"]',
  },

  // Page identification
  pageTitle: 'h2:has-text("Get In Touch")',

  // Navigation
  navLink: 'a[href="/contact_us"]',
} as const;
