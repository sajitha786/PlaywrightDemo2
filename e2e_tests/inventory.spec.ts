import { test, expect } from '@playwright/test';

test.describe('Inventory Feature', async () => {
    test.only('Sort products by price (low to high)', async ({ page }) => {
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
        await page.selectOption('.product_sort_container', 'hilo');
        let prices = await page.locator("div.inventory_item_price").allInnerTexts();
        for (let i = 0; i < prices.length - i; i++) {
            prices[i] = prices[i].replace("$", "");
        }
        let sortedPrices = [...prices].sort((a, b) => parseFloat(b) - parseFloat(a));
        expect(prices).toEqual(sortedPrices);
    })
})