import { test, expect } from '@playwright/test';
import { addProductList, removeProductList } from '../test-data/products';
import { sorting, pageEndpoints } from '../config/constants';
import { Inventory } from '../pages/inventoryPage';
import { Cart } from '../pages/cartPage';
import { Checkout } from '../pages/checkoutPage';
import { checkoutCreds } from '../test-data/checkoutCreds';
import { CheckoutOverview } from '../pages/checkoutOverviewPage';
import { Order } from '../pages/orderConfirmationPage';
import { LBL_LOGIN_LOGO } from '../objects/loginObjects';

test.describe('Inventory Feature', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(pageEndpoints.INVENTORY);
    })
    test('Sort products by price (low to high)', async ({ page }) => {
        const inventory = new Inventory(page)
        let actualPrices = await (await inventory
            .selectSortingType(sorting.LOW_TO_HIGH))
            .getProductPrice();
        let expectedPrices = await inventory.performSorting(sorting.LOW_TO_HIGH, actualPrices)
        expect(actualPrices).toEqual(expectedPrices);
    })


    test('Add a product to the cart', async ({ page }) => {
        const inventory = new Inventory(page)
        const cart = new Cart(page)
        // add product to cart actions here
        for (let product of addProductList) {
            await inventory.selectProduct(product);
            await (await cart.addToCart()).goBackToProductPage()
        }
        await inventory.goToShoppingCart()
        let allProductNames = await cart.getProducts();
        expect(allProductNames, "Count of products in cart is not equal").toHaveLength(addProductList.length)
        expect(allProductNames, "Products in cart are not equal").toEqual(addProductList)
    })

    test('Remove a product from the cart', async ({ page }) => {
        const inventory = new Inventory(page)
        const cart = new Cart(page)
        // add product to cart actions here
        for (let product of addProductList) {
            await inventory.selectProduct(product);
            expect(page).toHaveURL(pageEndpoints.CART)
            await (await cart.addToCart()).goBackToProductPage()
        }
        await inventory.removeProduct(removeProductList);
        await inventory.goToShoppingCart()
        //await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();
        const totalItem = await cart.getProducts();
        console.log(await page.locator('.inventory_item_name').count());
        expect(totalItem).not.toContain(removeProductList[1]);
    })
    test.only('Checkout the product from the cart', async ({ page }) => {
        const inventory = new Inventory(page)
        const cart = new Cart(page)
        const checkout = new Checkout(page)
        const checkoutOverview = new CheckoutOverview(page)
        const order = new Order(page)
        // add product to cart actions here
        for (let product of addProductList) {
            await inventory.selectProduct(product);
            //confirm the current page is inventory page
            expect(page).toHaveURL(pageEndpoints.INVENTORY)
            await (await cart.addToCart()).goBackToProductPage()
        }
        await inventory.goToShoppingCart()
        expect(page).toHaveURL(pageEndpoints.CART)
        await checkout.goToCheckoutPage()
        //confirm the current page is checkout step one page
        expect(page).toHaveURL(pageEndpoints.CHECKOUT)
        let cusFirstName = checkoutCreds[0].cusFirstName;
        let cusLastName = checkoutCreds[0].cusLastName
        let zipCode = checkoutCreds[0].zipCode
        await checkout.performCheckout(cusFirstName,cusLastName,zipCode)
        //confirm the current page is checkout step two page
        expect(page).toHaveURL(pageEndpoints.CHECKOUT_OVERVIEW)
        //Goto Checkout overview page
        const checkoutItems = await cart.getProducts();

        expect(checkoutItems, "Count of products in cart is not equal").toHaveLength(addProductList.length)
        expect(checkoutItems, "Products in cart are not equal").toEqual(addProductList)
        expect(checkoutOverview.LBL_PAYMENT_INFO).toBeVisible();
        expect(checkoutOverview.lblPaymentVal).toBeVisible();
        await checkoutOverview.confirmCheckoutFlow()
        //Goto Order Confirmation page
        await expect(order.lblMessage).toBeVisible();
        await order.backToHome()
    })

    test.only('Logout Feature', async ({ page }) => {
        const inventory = new Inventory(page)
        const cart = new Cart(page)
        const checkout = new Checkout(page)
        const checkoutOverview = new CheckoutOverview(page)
        const order = new Order(page)
        // add product to cart actions here
        for (let product of addProductList) {
            await inventory.selectProduct(product);
            //confirm the current page is inventory page
            await (await cart.addToCart()).goBackToProductPage()
        }
        await inventory.goToShoppingCart()
        expect(page).toHaveURL(pageEndpoints.CART)
        await checkout.goToCheckoutPage()
        expect(page).toHaveURL(pageEndpoints.CHECKOUT)
        await checkout.openMenu();
        await checkout.logout();
        await expect(page.locator(LBL_LOGIN_LOGO)).toBeVisible();
    })
})