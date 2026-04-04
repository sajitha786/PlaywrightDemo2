import { test, expect } from '@playwright/test';
import { loginCreds, url } from '../test-data/loginCreds';

test.describe('Login Tests', () => {

    for (const creds of loginCreds) {
        test(`Login with valid credentials with username ${creds.username} and password ${creds.password}`, async ({ page }) => {
            //let url = "https://www.saucedemo.com/";
            let username = creds.username;
            let password = creds.password;
            await page.goto(url);
            //await page.fill("#user-name","standard_user");
            await page.getByRole('textbox', { name: 'Username' }).fill(username);
            //await page.fill("#password", "secreat_sauce");
            await page.getByRole('textbox', { name: 'Password' }).fill(password);
            await page.click("#login-button");
            //await page.pause();
            if (username === "standard_user" || username === "problem_user" || username === "performance_glitch_user") {
                await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
                await expect(page.getByText("Products")).toBeVisible();
            } else {
                await expect(page).toHaveURL("https://www.saucedemo.com");
            }
        });
    }
});
