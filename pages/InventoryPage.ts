import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly inventoryItems: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('.title');
        this.inventoryItems = page.locator('.inventory_item');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartLink = page.locator('.shopping_cart_link');
    }

    async addItemToCart(itemName: string) {
        const item = this.page.locator('.inventory_item', { hasText: itemName });
        await item.locator('button', { hasText: 'Add to cart' }).click();
    }

    async goToCart() {
        await this.cartLink.click();
    }

    async getCartItemCount(): Promise<number> {
        const text = await this.cartBadge.textContent();
        return text ? parseInt(text, 10) : 0;
    }
}
