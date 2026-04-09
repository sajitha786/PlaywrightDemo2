import { test, expect } from '@playwright/test';

test.describe('Inventory Feature', async () => {
    test('Sort products by price (low to high)', async ({ page }) => {
        // let username = loginCreds[0].username;
        // let password = loginCreds[0].password;
        // await page.goto('');
        // await page.getByRole('textbox', { name: 'username' }).fill(username);
        // await page.getByRole('textbox', { name: 'password' }).fill(password);
        // await page.click("#login-button");
        // await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        // await expect(page.getByText("Products")).toBeVisible();
        // await page.click(".product_sort_container");
        //await page.pause();
        await page.goto("/inventory.html");
        await page.selectOption('.product_sort_container', 'Price (high to low)');
        let prices = await page.locator('div.inventory_item_price').allInnerTexts();
        console.log("Prices before looping", prices);
        const numericPrices = prices.map(price => parseFloat(price.replace("$", "")));
        console.log(numericPrices);
        let sortedPrices = [...numericPrices].sort((a, b) => b - a);
        console.log(sortedPrices);
        expect(numericPrices).toEqual(sortedPrices);
    })


    test('Add a product to the cart', async ({ page }) => {
        // add product to cart actions here
        let productList = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket', 'Test.allTheThings() T-Shirt (Red)']
        await page.goto('/inventory.html');
        for (let product of productList) {
            await page.getByText(product).click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.getByRole("button", { name: 'Go back Back to products' }).click();
        }
        const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        await expect(cartBadge).toHaveText(String(productList.length));

        await cartBadge.click();
        let allProductNames = await page.locator('[data-test="inventory-item-name"]').allInnerTexts();
        expect(allProductNames, "Count of products in cart is not equal").toHaveLength(productList.length)
        expect(allProductNames, "Products in cart are not equal").toEqual(productList)
    })

    test('Remove a product from the cart', async ({ page }) => {
        await page.goto("/inventory.html")
        let addProductList = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket', 'Test.allTheThings() T-Shirt (Red)']
        await page.goto('/inventory.html');
        for (const product of addProductList) {
            await page.getByText(product).click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.getByRole("button", { name: 'Go back Back to products' }).click();
        }
        await page.locator('[data-test="shopping-cart-badge"]').click();
        let removeProductList = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket']
        let removeButton = "";
        for (const product of removeProductList) {
            console.log("product", product)
            removeButton = product.replace(/\s+/g, "-");
            removeButton = removeButton.toLocaleLowerCase();
            console.log(removeButton)
            await page.locator(`[data-test="remove-${removeButton}"]`).click();
        }

        //await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();
        const totalItem = await page.locator('.inventory_item_name').allInnerTexts();
        console.log(await page.locator('.inventory_item_name').count());;
        console.log(totalItem);
        expect(totalItem).not.toContain(removeProductList[1]);
    })
    test('Checkout the product from the cart', async ({ page }) => {
        await page.goto("/inventory.html")
        let productList = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket', 'Test.allTheThings() T-Shirt (Red)']
        await page.goto('/inventory.html');
        for (const product of productList) {
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
        expect(checkoutItems, "Count of products in cart is not equal").toHaveLength(productList.length)
        expect(checkoutItems, "Products in cart are not equal").toEqual(productList)
        expect(page.locator('[data-test="payment-info-label"]')).toBeVisible();
        expect(page.locator('[data-test="payment-info-value"]').first()).toBeVisible();
        await page.locator('#finish').click();
        await expect(page.getByText('Thank you for your order!')).toBeVisible();
        await page.locator('[data-test="back-to-products"]').click();
    })

    test.only('Logout Feature', async ({ page }) => {
        await page.goto("/inventory.html")
        let productList = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket', 'Test.allTheThings() T-Shirt (Red)']
        await page.goto('/inventory.html');
        for (const product of productList) {
            await page.getByText(product).click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.getByRole("button", { name: 'Go back Back to products' }).click();
        }
        await page.locator('[data-test="shopping-cart-badge"]').click();
        await page.getByRole('button', { name: 'Open Menu'}).click();
        await page.locator("a#logout_sidebar_link").click();
        await expect (page.locator('div.login_logo')).toBeVisible();
    })
})