import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { PageName } from '../constants/PageNames';

/**
 * LocatorLoader
 * 
 * A utility class to manage and load UI locators from external YAML files.
 * It uses a caching mechanism to minimize file system I/O.
 */
export class LocatorLoader {
    // Cache for storing loaded locators (PageName -> Locator Object)
    private static locators: Record<string, any> = {};

    /**
     * Loads locators for a specific page.
     * 
     * @param pageName - The enum value representing the page (e.g., PageName.LoginPage).
     * @returns The parsed locator object.
     */
    static load(pageName: PageName) {
        // Return cached locators if available
        if (this.locators[pageName]) {
            return this.locators[pageName];
        }

        const filePath = path.resolve(__dirname, `../locators/${pageName}Locator.yaml`);

        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Locator file not found: ${filePath}`);
            }
            const fileContents = fs.readFileSync(filePath, 'utf8');
            this.locators[pageName] = yaml.load(fileContents);
            return this.locators[pageName];
        } catch (error) {
            console.error(`Error loading locators for ${pageName}:`, error);
            throw new Error(`Failed to load locators for ${pageName}. Details: ${error}`);
        }
    }

    /**
     * Retrieves a locator string for a given key.
     * 
     * @param pageName - The page to look up.
     * @param key - The specific locator key defined in the YAML file.
     * @returns The CSS/XPath selector string.
     */
    static get(pageName: PageName, key: string): string {
        const locators = this.load(pageName);

        if (!locators || !locators[key]) {
            throw new Error(`Locator not found for Page: ${pageName}, Key: ${key}`);
        }

        return locators[key];
    }
}
