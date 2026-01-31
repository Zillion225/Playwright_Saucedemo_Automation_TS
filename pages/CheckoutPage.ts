import { type Locator, type Page } from '@playwright/test';
import { LocatorLoader } from '../utils/LocatorLoader';

export class CheckoutPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly completeHeader: Locator;
    readonly backHomeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator(LocatorLoader.get('CheckoutPage', 'firstNameInput'));
        this.lastNameInput = page.locator(LocatorLoader.get('CheckoutPage', 'lastNameInput'));
        this.postalCodeInput = page.locator(LocatorLoader.get('CheckoutPage', 'postalCodeInput'));
        this.continueButton = page.locator(LocatorLoader.get('CheckoutPage', 'continueButton'));
        this.finishButton = page.locator(LocatorLoader.get('CheckoutPage', 'finishButton'));
        this.completeHeader = page.locator(LocatorLoader.get('CheckoutPage', 'completeHeader'));
        this.backHomeButton = page.locator(LocatorLoader.get('CheckoutPage', 'backHomeButton'));
    }

    async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async finishOrder() {
        await this.finishButton.click();
    }

    async getConfirmationMessage(): Promise<string> {
        return await this.completeHeader.textContent() ?? '';
    }
}
