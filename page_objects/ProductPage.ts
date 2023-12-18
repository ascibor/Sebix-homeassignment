import { Page } from 'playwright';

export default class ProductPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Method to navigate to the product page
  async navigate(productNameURL: string) {
    const baseUrl = "https://skleptest.pl/product";
    await this.page.goto(`${baseUrl}/${productNameURL}`);
  }

  async getProductTitle() {
    return await this.page.locator('h1.product_title.entry-title');
  }

  async addToCart(productName: string) {
    await this.page.locator('li').filter({ hasText: `${productName}` }).getByRole('link').nth(1).click();
  }

  async getPrice() {
    const priceElement = await this.page.$('.woocommerce-Price-amount.amount');
    const priceText = await priceElement.innerText();
    const price = priceText.replace(/[^\d]/g, '');
    return price;
  }
  // Add other methods as per the functionality of your ProductCategoryPage
}

//export { ProductCategoryPage };