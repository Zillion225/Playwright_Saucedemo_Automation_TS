import { type Locator, type Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly title: Locator;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('.title');
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async getCartItemNames(): Promise<string[]> {
        const names = await this.page.locator('.cart_item .inventory_item_name').allTextContents();
        return names;
    }
}
