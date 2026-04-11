import { test, expect } from '@playwright/test';
import { loginCreds, url } from '../test-data/loginCreds';
import { Login } from '../pages/loginPage';
import { pageEndpoints } from '../config/constants';


test.describe.only('Login Tests', () => {

    for (const creds of loginCreds) {
        test(`Login with valid & invalid credentials with username ${creds.username} and password ${creds.password}`, async ({ page }) => {
            const login = new Login(page)
            let username = creds.username;
            let password = creds.password;
            await page.goto('');
            await login.loginMethod(username, password);
            if (username === "standard_user" || username === "problem_user" || username === "performance_glitch_user") {
                await expect(page).toHaveURL(pageEndpoints.INVENTORY);
                await expect(page.getByText("Products")).toBeVisible();
            } else {
                await expect(page).toHaveURL("https://www.saucedemo.com");
            }
        });
    }

    test('Login with valid credentials', async ({ page }) => {
        const login= new Login(page);
        let username = loginCreds[0].username;
        let password = loginCreds[0].password;
        await page.goto('');
        await login.loginMethod(username, password);
        await expect(page).toHaveURL(pageEndpoints.INVENTORY);
    });

    test('Login with invalid credentials', async ({ page }) => {
        const login= new Login(page);
        let username = loginCreds[1].username;
        let password = loginCreds[1].password;
        await page.goto('');
        await login.loginMethod(username, password);
        await expect(page).toHaveURL("https://www.saucedemo.com");
    });

    
});
