import { chromium } from 'playwright';
import {ENV} from '../config/env';

async function globalSetup() {
    const browser = await chromium.launch({headless:false});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(ENV.BASE_URL);
    console.log(ENV.BASE_URL);
    await page.getByRole('textbox', { name: 'username' }).fill(ENV.USER_NAME);
    await page.getByRole('textbox', { name: 'password' }).fill(ENV.PASSWORD);
    await page.click("#login-button");
    await context.storageState({ path: 'state.json' });
    await browser.close();
}

export default globalSetup;