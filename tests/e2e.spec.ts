import { test, expect } from '@playwright/test';
import POManager from '../page_objects/POManager';

test('Verify if a product with ID 56 from Shrits cateogry has the proper name Mango Shrit', async ({page}) => {
    const poManager = new POManager(page);
    
    await page.goto('/product-category/shirts/');
    
    const rowLocator = page.getByRole('listitem');
    
    const product = await rowLocator.filter({has: page.locator('[data-product_id="56"]')}).first();

    await expect(product).toContainText('Manago Shirt');
 });


 test('Verify product name on product page', async ({page}) => {
    const poManager = new POManager(page);

    await page.goto('/product/manago-shirt/');

    const productTitleSelector = await poManager.productPage().getProductTitle();

    await expect(productTitleSelector).toContainText('Manago Shirt'); 
 });

test('Verify shipping prices in the cart', async ({page}) => {
    const poManager = new POManager(page);
    //add product to the cart
    await page.goto('/product-category/shirts/');
    await poManager.productCategoryPage().addToCart('Manago Shirt');

    //navigate to the cart
    await page.goto('/cart/');
    const flatRateDefault = await poManager.cartPage().flatRate();
    const parsedFlatRateDefault = parseFloat(flatRateDefault)
    // check flat rate for PL
    if (parsedFlatRateDefault !== 12) {
        throw new Error(`Prices do not match flat rate for Poland `);
    }

    //Verify total price including flatRate for PL
    const totalPrice = await poManager.cartPage().total();
    console.log(totalPrice);
    const parsedTotal = parseFloat(totalPrice);
    console.log(typeof parsedTotal);
    console.log( parsedTotal);
    if (parsedTotal !== 37) {
        throw new Error(`Total price incorrect`);
    }

    // check flat rate for UK
    await poManager.cartPage().calculateShipping();
    await poManager.cartPage().dropDownShipping();
    await poManager.cartPage().dropDownShippingTextBox("United Kingdom (UK)");
    await expect (page.locator("#select2-calc_shipping_country-container")).toContainText("United Kingdom (UK)");

    await poManager.cartPage().calculateShippingCostsButton();
    
    const flatRateForUK = await poManager.cartPage().flatRate();
    const parsedFlatRateForUK = parseFloat(flatRateForUK);

    if (parsedFlatRateForUK !== 20) {
        throw new Error(`Prices do not match flat rate for UK `);
    }
});

test('Make sure that product quantity is changing total value', async ({page}) => {
    const poManager = new POManager(page);
     //add product to the cart
     await page.goto('/product-category/dresses/');
     await poManager.productCategoryPage().addToCart('Magnolia Dress');
     //go to cart
     await page.goto('/cart/');
     //take price of manoliaDress - it is not needed in this test implementation, can be useful when we would like to count price dynamically
    const magnoliaDressCost = await poManager.cartPage().priceCartView('Magnolia Dress');
    // + Add product 
    await page.locator('.dashicons.dashicons-plus').click();
    // Update cart 
    const updateCartButton = await poManager.cartPage().updateCartButton()
    await updateCartButton.click();
    await expect (updateCartButton).toBeDisabled();
    //Check subtotal
    const subTotal = await poManager.cartPage().subTotal();

    //Verify is subtotal is validated. 
    if (subTotal !== 50) {
        throw new Error(`Subtotal is incorrect`);
    }
})

 test('Make an order with 3 different products from different categories', async ({page}) => {
    const poManager = new POManager(page);

    //check prices on product pages
    await page.goto('/product/blue-magawi-shoes');
    const blueMagawiShoesPricProductPage = await poManager.productPage().getPrice()
    console.log(blueMagawiShoesPricProductPage);
    
    await page.goto('/product/manago-shirt');
    const managoShirtPriceProductPage = await poManager.productPage().getPrice()
    console.log(managoShirtPriceProductPage);

    await page.goto('/product/amari-shirt');
    const amariShritPriceProductPage = await poManager.productPage().getPrice()
    console.log(amariShritPriceProductPage);

    //Add products to cart
    await poManager.productCategoryPage().navigate('shirts');
    await poManager.productCategoryPage().addToCart('Manago Shirt');
    await poManager.productCategoryPage().navigate('trends');
    await poManager.productCategoryPage().addToCart('Amari Shirt');
    await poManager.productCategoryPage().navigate('shoes');
    await poManager.productCategoryPage().addToCart('Blue Magawi Shoes');
   
    //Go to cart
    await page.goto('/cart/');;

    //compare prices between cart and product pages
    async function comparePrices(productPagePrice: string, cartPagePrice: string, productName: string): Promise<void> {
        if (productPagePrice !== cartPagePrice) {
          throw new Error(`Prices do not match for ${productName}. Product Page Price: ${productPagePrice}, Cart Page Price: ${cartPagePrice}`);
        }
      }

    await comparePrices(managoShirtPriceProductPage, await poManager.cartPage().priceCartView('Manago Shirt'), 'Manago Shirt');
    await comparePrices(amariShritPriceProductPage, await poManager.cartPage().priceCartView('Amari Shirt'), 'Amari Shirt');
    await comparePrices(blueMagawiShoesPricProductPage, await poManager.cartPage().priceCartView('Blue Magawi Shoes'), 'Blue Magawi Shoes');
    

    //compare subtotal with sum of product prices
    async function compareTotal(sumOfProducts: string, subTotal: string): Promise<void> {
        if (sumOfProducts !== subTotal) {
            throw new Error(`Subtotal is not matching sum of product prices`);
          }
    }
    
    // Check the typeof for each value

    const parsedBlueMagawiShoesPrice = parseFloat(blueMagawiShoesPricProductPage);
    const parsedManagoShirtPrice = parseFloat(managoShirtPriceProductPage);
    const parsedAmariShirtPrice = parseFloat(amariShritPriceProductPage);

    if (isNaN(parsedBlueMagawiShoesPrice) || isNaN(parsedManagoShirtPrice) || isNaN(parsedAmariShirtPrice)) {
        throw new Error('One or more prices are not valid numbers');
      }
    
    const sumOfProducts = parsedBlueMagawiShoesPrice + parsedManagoShirtPrice + parsedAmariShirtPrice;
    const subTotal = await poManager.cartPage().subTotal();


    const result = await compareTotal(sumOfProducts.toString(), subTotal.toString());
    //Go to checkout
    await poManager.cartPage().checkoutButton();

    //Fill Checkout Page
    await poManager.checkoutPage().firstName("Albert");
    await poManager.checkoutPage().lastName("Tester");
    await poManager.checkoutPage().companyName("Sebixowo");
    await poManager.checkoutPage().billingAddresLine1("Kwiatowa 1");
    await poManager.checkoutPage().billingAddresLine2("II piętro");
    await poManager.checkoutPage().zip("09-123");
    await poManager.checkoutPage().city("Berlin");
    await poManager.checkoutPage().phone("123213123");
    await poManager.checkoutPage().emailAddress("testtest@testniepodam.pl");

    //click on place order button
    await poManager.checkoutPage().placeOrderButton();
    await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
});