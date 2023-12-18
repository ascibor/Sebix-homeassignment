import { Page } from 'playwright';

export default class ProductCategoryPage {
  private page: Page;


  constructor(page: Page) {
    this.page = page;
  }

  // Method to navigate to the product category page
  async navigate(category: string) {
    const baseUrl = "https://skleptest.pl/product-category";
    await this.page.goto(`${baseUrl}/${category}`);
  }

  async addToCart(productName: string) {
    await this.page.locator('li').filter({ hasText: `${productName}` }).getByRole('link').nth(1).click();
  }
}