import { expect, test } from '@playwright/test';

test.describe('Product Feature', () => {
    test('Add a product to the cart', async ({ page }) => {
        // add product to cart actions here
        await page.goto('/inventory.html');
        //await page.
        await page.getByRole("button", {name: 'Add to cart'}).first().click();
        let cartIcon= page.locator('div#shopping_cart_container a.shopping-cart-link');
        let cartIconCount =await cartIcon.locator('span.shopping-cart-badge').allInnerTexts();
        console.log("cart count",cartIconCount);
    });
});