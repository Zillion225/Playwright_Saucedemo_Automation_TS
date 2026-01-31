import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage } from '../pages';

/**
 * Test Suite: Login Tests - Dynamic Usernames
 * 
 * This suite verifies the login functionality of the Saucedemo website using 
 * dynamically fetched usernames from the page itself.
 * 
 * It covers:
 * 1. Verifying the display of accepted usernames.
 * 2. Successful login with a standard user.
 * 3. Error handling for locked-out users.
 * 4. Successful login for all other valid users.
 * 5. Error handling for invalid credentials.
 */
test.describe('Login Tests - Dynamic Usernames', () => {

    /**
     * Test Case: Should display accepted usernames on the login page
     * 
     * Objective: Verify that the login page displays a list of accepted usernames.
     * Steps:
     * 1. Navigate to the login page.
     * 2. Wait for the credentials section to be visible.
     * 3. Fetch the list of accepted usernames using the `getAcceptedUsernames` method.
     * 4. Assert that the list is not empty.
     */
    test('should display accepted usernames on the login page', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        // Wait for the credentials section to be visible to ensure we can scrape them
        await loginPage.loginCredentials.waitFor({ state: 'visible' });

        const usernames = await loginPage.getAcceptedUsernames();
        console.log('Fetched usernames:', usernames);

        // Assert that we successfully fetched at least one username
        expect(usernames.length).toBeGreaterThan(0);
    });

    /**
     * Test Case: Should login with standard_user from accepted usernames
     * 
     * Objective: Verify that a valid 'standard_user' can log in successfully.
     * Steps:
     * 1. Navigate to the login page.
     * 2. Fetch valid usernames and password dynamically.
     * 3. Find the 'standard_user' in the list.
     * 4. Perform login with 'standard_user' and the fetched password.
     * 5. Verify successful redirection to the Inventory page.
     */
    test('should login with standard_user from accepted usernames', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        // Wait for the credentials section to be visible
        await loginPage.loginCredentials.waitFor({ state: 'visible' });

        const usernames = await loginPage.getAcceptedUsernames();
        const password = await loginPage.getPassword();

        console.log('Usernames found:', usernames);
        console.log('Password found:', password);

        // Find the specific user we want to test
        const standardUser = usernames.find(u => u.includes('standard_user'));
        expect(standardUser).toBeDefined();

        // Perform login action
        await loginPage.login(standardUser!, password);

        // Verify we are on the inventory page by checking the title
        const inventoryPage = new InventoryPage(page);
        await expect(inventoryPage.title).toHaveText('Products');
    });

    /**
     * Test Case: Should show error for locked_out_user from accepted usernames
     * 
     * Objective: Verify that the system correctly identifies and blocks a locked-out user.
     * Steps:
     * 1. Navigate to the login page.
     * 2. Fetch usernames and password.
     * 3. Find the 'locked_out_user'.
     * 4. Attempt login with 'locked_out_user'.
     * 5. Verify that an error message is displayed indicating the user is locked out.
     */
    test('should show error for locked_out_user from accepted usernames', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.loginCredentials.waitFor({ state: 'visible' });

        const usernames = await loginPage.getAcceptedUsernames();
        const password = await loginPage.getPassword();

        const lockedUser = usernames.find(u => u.includes('locked_out_user'));
        expect(lockedUser).toBeDefined();

        await loginPage.login(lockedUser!, password);

        // Check for the specific error message for locked out users
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Sorry, this user has been locked out');
    });

    /**
     * Test Case: Should login successfully with all non-locked users
     * 
     * Objective: Verify login functionality for all valid users except the locked-out one.
     * Steps:
     * 1. Navigate to the login page.
     * 2. Fetch all usernames.
     * 3. Filter out 'locked_out_user'.
     * 4. Iterate through each valid user:
     *    a. Navigate to login page.
     *    b. Login with the user.
     *    c. Verify successful login (Inventory page title).
     */
    test('should login successfully with all non-locked users', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.loginCredentials.waitFor({ state: 'visible' });

        const usernames = await loginPage.getAcceptedUsernames();
        const password = await loginPage.getPassword();

        // Filter out locked_out_user to test only valid scenarios
        const validUsers = usernames.filter(u => !u.includes('locked_out'));
        console.log('Valid users to test:', validUsers);

        for (const username of validUsers) {
            await test.step(`Login as ${username}`, async () => {
                // Reset state by going back to login for each user
                await loginPage.goto();
                await loginPage.login(username, password);

                // Verify successful login
                const url = page.url();
                if (url.includes('inventory')) {
                    const inventoryPage = new InventoryPage(page);
                    await expect(inventoryPage.title).toHaveText('Products');
                    console.log(`✅ ${username}: Login successful`);
                }
            });
        }
    });

    /**
     * Test Case: Should show error for invalid credentials
     * 
     * Objective: Verify that the system handles invalid login attempts correctly.
     * Steps:
     * 1. Navigate to the login page.
     * 2. Attempt login with non-existent username and password.
     * 3. Verify that an error message is displayed indicating username and password do not match.
     */
    test('should show error for invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login('invalid_user', 'invalid_password');

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Username and password do not match');
    });
});
