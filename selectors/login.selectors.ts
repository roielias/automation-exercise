/**
 * Selectors for Login Page functionality
 * Includes login form, registration form, and user state elements
 */
export const LoginPageSelectors = {
  // Login form
  login: {
    email: '[data-qa="login-email"]',
    password: '[data-qa="login-password"]',
    button: '[data-qa="login-button"]',
    title: 'h2:has-text("Login to your account")',
  },

  // Registration form - initial signup
  signup: {
    name: '[data-qa="signup-name"]',
    email: '[data-qa="signup-email"]',
    button: '[data-qa="signup-button"]',
  },

  // Registration form - detailed information
  registration: {
    password: '[data-qa="password"]',
    birthDay: '[data-qa="days"]',
    birthMonth: '[data-qa="months"]',
    birthYear: '[data-qa="years"]',

    // Checkboxes
    genderMale: "#id_gender1",
    genderFemale: "#id_gender2",
    newsletter: "#newsletter",
    optin: "#optin",

    // Address information
    firstName: '[data-qa="first_name"]',
    lastName: '[data-qa="last_name"]',
    company: '[data-qa="company"]',
    address: '[data-qa="address"]',
    address2: '[data-qa="address2"]',
    country: '[data-qa="country"]',
    state: '[data-qa="state"]',
    city: '[data-qa="city"]',
    zipcode: '[data-qa="zipcode"]',
    mobileNumber: '[data-qa="mobile_number"]',

    // Buttons
    createAccountButton: '[data-qa="create-account"]',
    continueButton: '[data-qa="continue-button"]',
  },

  // User state
  userState: {
    loggedInText: "text=Logged in as",
    logoutButton: 'a[href="/logout"]',
  },
} as const;
