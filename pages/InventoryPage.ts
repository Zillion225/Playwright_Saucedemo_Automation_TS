import { type Locator, type Page } from '@playwright/test';
import { LocatorLoader } from '../utils/LocatorLoader';

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly inventoryItems: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator(LocatorLoader.get('InventoryPage', 'title'));
        this.inventoryItems = page.locator(LocatorLoader.get('InventoryPage', 'inventoryItems'));
        this.cartBadge = page.locator(LocatorLoader.get('InventoryPage', 'cartBadge'));
        this.cartLink = page.locator(LocatorLoader.get('InventoryPage', 'cartLink'));
    }

    async addItemToCart(itemName: string) {
        const item = this.page.locator(LocatorLoader.get('InventoryPage', 'inventoryItems'), { hasText: itemName });
        await item.locator(LocatorLoader.get('InventoryPage', 'addToCartButton'), { hasText: 'Add to cart' }).click();
    }

    async goToCart() {
        await this.cartLink.click();
    }

    async getCartItemCount(): Promise<number> {
        const text = await this.cartBadge.textContent();
        return text ? parseInt(text, 10) : 0;
    }
}
