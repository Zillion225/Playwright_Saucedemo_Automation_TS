import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages';

/**
 * Test Suite: Checkout E2E Flow
 * 
 * This suite verifies the End-to-End (E2E) purchase flow on the Saucedemo website.
 * It covers the entire user journey from login to order completion.
 * 
 * Scenarios:
 * 1. Complete purchase flow with a single item.
 * 2. Complete purchase flow with multiple items.
 */
test.describe('Checkout E2E Flow', () => {

    /**
     * Test Case: Should complete a full purchase flow
     * 
     * Objective: Verify a successful purchase transaction for a single item.
     * Steps:
     * 1. Login with valid credentials.
     * 2. Add 'Sauce Labs Backpack' to the cart.
     * 3. Navigate to the cart and verify the item is present.
     * 4. Proceed to checkout.
     * 5. Fill in customer information.
     * 6. Finish the order.
     * 7. Verify the 'Thank you' confirmation message.
     */
    test('should complete a full purchase flow', async ({ page }) => {
        // Step 1: Login
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');

        // Step 2: Add item to cart
        const inventoryPage = new InventoryPage(page);
        // Ensure we are on the inventory page
        await expect(inventoryPage.title).toHaveText('Products');
        // Add a specific item
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        // Verify cart badge count
        expect(await inventoryPage.getCartItemCount()).toBe(1);

        // Step 3: Go to cart and verify content
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        await expect(cartPage.title).toHaveText('Your Cart');

        const cartItems = await cartPage.getCartItemNames();
        expect(cartItems).toContain('Sauce Labs Backpack');

        // Step 4: Checkout process
        await cartPage.checkout();
        const checkoutPage = new CheckoutPage(page);

        // Fill shipping details
        await checkoutPage.fillCustomerInfo('John', 'Doe', '12345');

        // Complete the order
        await checkoutPage.finishOrder();

        // Step 5: Verify order confirmation
        const confirmationMessage = await checkoutPage.getConfirmationMessage();
        expect(confirmationMessage).toBe('Thank you for your order!');
    });

    /**
     * Test Case: Should add multiple items and complete purchase
     * 
     * Objective: Verify a successful purchase transaction for multiple items.
     * Steps:
     * 1. Login with valid credentials.
     * 2. Add two distinct items to the cart.
     * 3. Verify cart count is 2.
     * 4. Navigate to cart and verify both items are listed.
     * 5. Proceed to checkout and complete the order.
     * 6. Verify confirmation message.
     */
    test('should add multiple items and complete purchase', async ({ page }) => {
        // Step 1: Login
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');

        // Step 2: Add multiple items to cart
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        await inventoryPage.addItemToCart('Sauce Labs Bike Light');

        // Verify cart count matches number of added items
        expect(await inventoryPage.getCartItemCount()).toBe(2);

        // Step 3: Verify items in cart
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        const cartItems = await cartPage.getCartItemNames();

        // Check both items exist in the cart list
        expect(cartItems).toContain('Sauce Labs Backpack');
        expect(cartItems).toContain('Sauce Labs Bike Light');

        // Step 4: Checkout and finish order
        await cartPage.checkout();
        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.fillCustomerInfo('Jane', 'Smith', '67890');
        await checkoutPage.finishOrder();

        // Step 5: Validation
        const confirmationMessage = await checkoutPage.getConfirmationMessage();
        expect(confirmationMessage).toBe('Thank you for your order!');
    });
});
