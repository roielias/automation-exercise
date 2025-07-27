import { CartPageSelectors } from "./cart.selectors";
import { CheckoutPageSelectors } from "./checkout.selectors";
import { ContactUsSelectors } from "./contactUs.selectors";
import { HomePageSelectors } from "./home.selectors";
import { LoginPageSelectors } from "./login.selectors";
import { ProductsSectionSelectors } from "./products.selectors";
import { CommonSelectors } from "./common";

export {
  CartPageSelectors,
  CheckoutPageSelectors,
  ContactUsSelectors,
  HomePageSelectors,
  LoginPageSelectors,
  ProductsSectionSelectors,
  CommonSelectors,
};

export const AllSelectors = {
  cart: CartPageSelectors,
  checkout: CheckoutPageSelectors,
  contactUs: ContactUsSelectors,
  home: HomePageSelectors,
  login: LoginPageSelectors,
  products: ProductsSectionSelectors,
  common: CommonSelectors,
} as const;
