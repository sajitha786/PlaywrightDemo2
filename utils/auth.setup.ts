import { chromium } from 'playwright';

async function globalSetup() {
    const browser = await chromium.launch({headless:false});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/");
    await page.getByRole('textbox', { name: 'username' }).fill("standard_user");
    await page.getByRole('textbox', { name: 'password' }).fill("secret_sauce");
    await page.click("#login-button");
    await context.storageState({ path: 'state.json' });
    await browser.close();
}

export default globalSetup;