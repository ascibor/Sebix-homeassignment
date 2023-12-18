import { Page } from 'playwright';

export default class CartPage {
  private page: Page;


  constructor(page: Page) {
    this.page = page;
  }

  // Method to navigate to the cart page
  async navigate() {
    const baseUrl = "https://skleptest.pl/cart";
    await this.page.goto(`${baseUrl}`);
  }

  //Check Price column on the cart view tabel
  async priceCartView(productName: string) {

    const productTotalPrice = await this.page.locator(`tr:has-text("${productName}") .woocommerce-Price-amount.amount`).first();
    const priceText = await productTotalPrice.innerText();
    const price = priceText.replace(/[^\d]/g, '');
    console.log(price);
    return price
  }

  async subTotal() {
    const subTotal = await this.page.locator('td[data-title="Subtotal"] .woocommerce-Price-amount.amount');
    const subTotalText = await subTotal.innerText();
    const price = await subTotalText.replace(/[^\d]/g, '');
    return parseFloat(price)
  }

  async total() {
    const total = await this.page.locator('td[data-title="Total"] .woocommerce-Price-amount.amount').last();
    const totalText = await total.innerText();
    const price = await totalText.replace(/[^\d]/g, '');
    const truncatedPrice = await price.replace(/00+$/, '');
    return truncatedPrice
  }

  async calculateShipping() {
    return this.page.getByRole('link', { name: 'Calculate shipping' }).click();
  }

  async dropDownShipping() {
    return this.page.locator('#select2-calc_shipping_country-container').click();
  }

  async dropDownShippingTextBox(value: string) {
    await this.page.getByRole('combobox').nth(1).fill(`${value}`);
    await this.page.getByRole('option', { name: `${value}` }).click();
  }

  async zipShipping(value: string) {
    await this.page.locator('#calc_shipping_postcode').fill(`${value}`);
  }

  async calculateShippingCostsButton() {
     await this.page.locator('button.button[type="submit"][name="calc_shipping"][value="1"]').click();
     const buttonSelector = 'button.button[type="submit"][name="calc_shipping"][value="1"]';
     await this.page.waitForSelector(buttonSelector, { state: 'hidden' });
  }

  async checkoutButton() {
    return this.page.getByRole('link', { name: 'Proceed to checkout' }).click();
  }

  async updateCartButton() {
    return this.page.getByRole('button', { name: 'Update cart' });
  }

  async flatRate() {
    const flatRateValue = await this.page.locator('td[data-title="Shipping"] .woocommerce-Price-amount.amount');
    const flatRateText = await flatRateValue.innerText();
    const flatRate = await flatRateText.replace(/[^\d]/g, '');
    return flatRate
  }
}



