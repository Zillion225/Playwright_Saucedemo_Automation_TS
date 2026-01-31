import { type Locator, type Page } from '@playwright/test';
import { LocatorLoader } from '../utils/LocatorLoader';
import { PageName } from '../constants/PageNames';

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
        this.usernameInput = page.locator(LocatorLoader.get(PageName.LoginPage, 'usernameInput'));
        this.passwordInput = page.locator(LocatorLoader.get(PageName.LoginPage, 'passwordInput'));
        this.loginButton = page.locator(LocatorLoader.get(PageName.LoginPage, 'loginButton'));
        this.errorMessage = page.locator(LocatorLoader.get(PageName.LoginPage, 'errorMessage'));
        this.loginCredentials = page.locator(LocatorLoader.get(PageName.LoginPage, 'loginCredentials'));
        this.loginPassword = page.locator(LocatorLoader.get(PageName.LoginPage, 'loginPassword'));
    }

    async getAcceptedUsernames(): Promise<string[]> {
        // Use innerText (via evaluate) to properly handle <br> tags as newlines
        const rawText = await this.loginCredentials.evaluate((el: Element) => (el as HTMLElement).innerText) ?? '';

        // Break text into lines, trim whitespace, and remove empty lines
        const lines = rawText.split('\n');
        const trimmedLines = lines.map((line) => line.trim());
        const filteredLines = trimmedLines.filter((line) => line.length > 0);

        // Filter out the header text to get only the actual usernames
        const usernames = filteredLines.filter((line) => {
            const isHeader = line.includes('Accepted usernames');
            return !isHeader;
        });

        return usernames;
    }

    async getPassword(): Promise<string> {
        const rawText = await this.loginPassword.evaluate((el: Element) => (el as HTMLElement).innerText) ?? '';

        // Break text into lines, trim whitespace, and remove empty lines
        const lines = rawText.split('\n');
        const trimmedLines = lines.map((line) => line.trim());
        const filteredLines = trimmedLines.filter((line) => line.length > 0);

        // Find the line that doesn't contain the header 'Password'
        const passwordLine = filteredLines.find((line) => {
            const isHeader = line.includes('Password');
            return !isHeader;
        });

        return passwordLine ?? 'secret_sauce';
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
