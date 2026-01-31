import { type Locator, type Page } from '@playwright/test';
import { LocatorLoader } from '../utils/LocatorLoader';

export class CartPage {
    readonly page: Page;
    readonly title: Locator;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator(LocatorLoader.get('CartPage', 'title'));
        this.cartItems = page.locator(LocatorLoader.get('CartPage', 'cartItems'));
        this.checkoutButton = page.locator(LocatorLoader.get('CartPage', 'checkoutButton'));
        this.continueShoppingButton = page.locator(LocatorLoader.get('CartPage', 'continueShoppingButton'));
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async getCartItemNames(): Promise<string[]> {
        const names = await this.page.locator(LocatorLoader.get('CartPage', 'itemNames')).allTextContents();
        return names;
    }
}
