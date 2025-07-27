/**
 * Common selectors used across multiple pages
 * Includes shared elements like navigation, buttons, and loading states
 */
export const CommonSelectors = {
  // Loading states
  loading: {
    spinner: ".loading-spinner",
    overlay: ".loading-overlay",
  },

  // Common buttons
  buttons: {
    submit: 'input[type="submit"]',
    button: "button",
    close: ".close",
    cancel: ".cancel",
    confirm: ".confirm",
  },

  // Form elements
  forms: {
    input: "input",
    textarea: "textarea",
    select: "select",
    checkbox: 'input[type="checkbox"]',
    radio: 'input[type="radio"]',
  },

  // Navigation elements
  navigation: {
    navbar: ".navbar",
    navLinks: ".nav-link",
    breadcrumb: ".breadcrumb",
  },

  // Modal elements
  modals: {
    backdrop: ".modal-backdrop",
    dialog: ".modal-dialog",
    header: ".modal-header",
    body: ".modal-body",
    footer: ".modal-footer",
  },

  // Alert and message elements
  alerts: {
    success: ".alert-success",
    error: ".alert-error",
    warning: ".alert-warning",
    info: ".alert-info",
  },

  // Layout elements
  layout: {
    container: ".container",
    row: ".row",
    column: ".col",
    sidebar: ".sidebar",
    mainContent: ".main-content",
  },
} as const;
