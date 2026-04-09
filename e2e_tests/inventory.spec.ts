import { test, expect } from '@playwright/test';
import { addProductList, removeProductList } from '../test-data/products';
import { sorting, pageEndpoints } from '../config/constants';
import { Inventory } from '../pages/inventoryPage';

test.describe('Inventory Feature', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(pageEndpoints.INVENTORY);
    })
    test.only('Sort products by price (low to high)', async ({ page }) => {
        const inventory = new Inventory(page)
        let actualPrices = await (await inventory
            .selectSortingType(sorting.LOW_TO_HIGH))
            .getProductPrice();
        let expectedPrices = await inventory.performSorting(sorting.LOW_TO_HIGH, actualPrices)
        expect(actualPrices).toEqual(expectedPrices);
    })


    test('Add a product to the cart', async ({ page }) => {
        // add product to cart actions here
        for (let product of addProductList) {
            await page.getByText(product).click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.getByRole("button", { name: 'Go back Back to products' }).click();
        }
        const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        await expect(cartBadge).toHaveText(String(addProductList.length));

        await cartBadge.click();
        let allProductNames = await page.locator('[data-test="inventory-item-name"]').allInnerTexts();
        expect(allProductNames, "Count of products in cart is not equal").toHaveLength(addProductList.length)
        expect(allProductNames, "Products in cart are not equal").toEqual(addProductList)
    })

    test('Remove a product from the cart', async ({ page }) => {
        for (const product of addProductList) {
            await page.getByText(product).click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.getByRole("button", { name: 'Go back Back to products' }).click();
        }
        await page.locator('[data-test="shopping-cart-badge"]').click();
        let removeButton = "";
        for (const product of removeProductList) {
            removeButton = product.replace(/\s+/g, "-");
            removeButton = removeButton.toLocaleLowerCase();
            await page.locator(`[data-test="remove-${removeButton}"]`).click();
        }

        //await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();
        const totalItem = await page.locator('.inventory_item_name').allInnerTexts();
        console.log(await page.locator('.inventory_item_name').count());
        expect(totalItem).not.toContain(removeProductList[1]);
    })
    test('Checkout the product from the cart', async ({ page }) => {
        for (const product of addProductList) {
            await page.getByText(product).click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.getByRole("button", { name: 'Go back Back to products' }).click();
        }
        await page.locator('[data-test="shopping-cart-badge"]').click();
        await page.getByRole("button", { name: 'Checkout' }).click();
        await page.getByRole("textbox", { name: 'First Name' }).fill('Tom');
        await page.getByRole("textbox", { name: 'Last Name' }).fill('Dominic');
        await page.getByRole("textbox", { name: 'Zip/Postal Code' }).fill('1234');
        await page.locator('[data-test="continue"]').click();
        const checkoutItems = await page.locator("div.inventory_item_name").allInnerTexts();
        expect(checkoutItems, "Count of products in cart is not equal").toHaveLength(addProductList.length)
        expect(checkoutItems, "Products in cart are not equal").toEqual(addProductList)
        expect(page.locator('[data-test="payment-info-label"]')).toBeVisible();
        expect(page.locator('[data-test="payment-info-value"]').first()).toBeVisible();
        await page.locator('#finish').click();
        await expect(page.getByText('Thank you for your order!')).toBeVisible();
        await page.locator('[data-test="back-to-products"]').click();
    })

    test('Logout Feature', async ({ page }) => {
        for (const product of addProductList) {
            await page.getByText(product).click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.getByRole("button", { name: 'Go back Back to products' }).click();
        }
        await page.locator('[data-test="shopping-cart-badge"]').click();
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator("a#logout_sidebar_link").click();
        await expect(page.locator('div.login_logo')).toBeVisible();
    })
})