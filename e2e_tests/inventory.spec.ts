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
        let productList= ['Sauce Labs Backpack','Sauce Labs Fleece Jacket','Test.allTheThings() T-Shirt (Red)']
        await page.goto('/inventory.html');
        for(let product of productList){
            await page.getByText(product).click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.getByRole("button", {name:'Go back Back to products'}).click();
        }
        const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        await expect(cartBadge).toHaveText(String(productList.length));

        await cartBadge.click();
        let allProductNames =await page.locator('[data-test="inventory-item-name"]').allInnerTexts();
        expect(allProductNames).toHaveLength(productList.length)
        expect(allProductNames).toEqual(productList)
    })

    test.only('Remove a product from the cart', async({page})=>{
        await page.goto("/inventory.html")
        let productList= ['Sauce Labs Backpack','Sauce Labs Fleece Jacket']
        await page.goto('/inventory.html');
        for(let product of productList){
            await page.getByText(product).click();
            await page.locator('[data-test="add-to-cart"]').click();
            await page.getByRole("button", {name:'Go back Back to products'}).click();
        }
        await page.locator('[data-test="shopping-cart-badge"]').click();
        await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();
        const totalItem= await page.locator('[data-test="inventory-item-name"]').allInnerTexts();
        console.log(totalItem);
        expect(totalItem).not.toContain(productList[1]);
    })
})