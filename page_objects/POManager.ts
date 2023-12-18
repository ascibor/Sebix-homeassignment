import { Page } from 'playwright';
//Import Page Objects
import  ProductCategoryPage from './ProductCategoryPage';
import ProductPage from './ProductPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';

export default class POManager {
    private page; Page;

    constructor(page: Page) {
        this.page = page;
    }

    public productCategoryPage(): ProductCategoryPage {
        return new ProductCategoryPage(this.page);
    }

    public productPage(): ProductPage {
        return new ProductPage(this.page);
    }

    public cartPage(): CartPage {
        return new CartPage(this.page);
    }

    public checkoutPage(): CheckoutPage {
        return new CheckoutPage(this.page);
    }
}
