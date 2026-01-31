import { type Locator, type Page } from '@playwright/test';
import { LocatorLoader } from '../utils/LocatorLoader';
import { PageName } from '../constants/PageNames';

export class CartPage {
    readonly page: Page;
    readonly title: Locator;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator(LocatorLoader.get(PageName.CartPage, 'title'));
        this.cartItems = page.locator(LocatorLoader.get(PageName.CartPage, 'cartItems'));
        this.checkoutButton = page.locator(LocatorLoader.get(PageName.CartPage, 'checkoutButton'));
        this.continueShoppingButton = page.locator(LocatorLoader.get(PageName.CartPage, 'continueShoppingButton'));
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async getCartItemNames(): Promise<string[]> {
        const names = await this.page.locator(LocatorLoader.get(PageName.CartPage, 'itemNames')).allTextContents();
        return names;
    }
}
