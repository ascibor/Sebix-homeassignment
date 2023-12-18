import { Page } from 'playwright';

export default class CheckoutPage {
  private page: Page;


  constructor(page: Page) {
    this.page = page;
  }

  // Method to navigate to the checkout page
  async navigate() {
    const baseUrl = "https://skleptest.pl/checkout";
    await this.page.goto(`${baseUrl}`);
  }

  //For fields locators
  async firstName(value: string) {
    return  this.page.locator('#billing_first_name').fill(`${value}`);
  }

  async lastName(value: string) {
    return this.page.locator('#billing_last_name').fill(`${value}`);
  }

  async companyName(value: string) {
    return this.page.locator('#billing_company').fill(`${value}`);
  }

  async country() {
    return this.page.locator('#billing_country');
  }

  async billingAddresLine1(value: string) {
    return this.page.locator('#billing_address_1').fill(`${value}`);
  }

  async billingAddresLine2(value: string) {
    return this.page.locator('#billing_address_2').fill(`${value}`);
  }

  async city(value: string) {
    return this.page.locator('#billing_city').fill(`${value}`);
  }

  async zip(value: string) {
    return this.page.locator('#billing_postcode').fill(`${value}`);
  }

  async phone(value: string) {
    return this.page.getByLabel('Phone *').fill(`${value}`);
  }

  async emailAddress(value: string) {
    return this.page.getByLabel('Email address *').fill(`${value}`);
  }

  async placeOrderButton() {
    return this.page.getByRole('button', { name: 'Place order' }).click();
  }

}
