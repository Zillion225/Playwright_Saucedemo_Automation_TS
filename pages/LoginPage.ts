import { type Locator, type Page } from '@playwright/test';
import { LocatorLoader } from '../utils/LocatorLoader';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly loginCredentials: Locator;
    readonly loginPassword: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator(LocatorLoader.get('LoginPage', 'usernameInput'));
        this.passwordInput = page.locator(LocatorLoader.get('LoginPage', 'passwordInput'));
        this.loginButton = page.locator(LocatorLoader.get('LoginPage', 'loginButton'));
        this.errorMessage = page.locator(LocatorLoader.get('LoginPage', 'errorMessage'));
        this.loginCredentials = page.locator(LocatorLoader.get('LoginPage', 'loginCredentials'));
        this.loginPassword = page.locator(LocatorLoader.get('LoginPage', 'loginPassword'));
    }

    async getAcceptedUsernames(): Promise<string[]> {
        // Use innerText (via evaluate) to properly handle <br> tags as newlines
        const text = await this.loginCredentials.evaluate((el: Element) => (el as HTMLElement).innerText) ?? '';
        // Extract usernames from the text (each username is on a new line after the header)
        const lines = text.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
        // Remove the header "Accepted usernames are:"
        return lines.filter((line: string) => !line.includes('Accepted usernames'));
    }

    async getPassword(): Promise<string> {
        const text = await this.loginPassword.evaluate((el: Element) => (el as HTMLElement).innerText) ?? '';
        const lines = text.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
        // Return the password (second line after header)
        return lines.find((line: string) => !line.includes('Password')) ?? 'secret_sauce';
    }

    async goto() {
        await this.page.goto('/');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.textContent() ?? '';
    }
}
