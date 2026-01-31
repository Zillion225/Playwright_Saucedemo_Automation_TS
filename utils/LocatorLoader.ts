import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

/**
 * Utility class for loading and retrieving locators from YAML files.
 * 
 * This class implements a singleton-like pattern (via static properties) to cache loaded locators,
 * preventing robust file system reads. It assumes locators are stored in the `locators/` directory
 * with a naming convention of `{PageName}Locator.yaml`.
 */
import { PageName } from '../constants/PageNames';

/**
 * Utility class for loading and retrieving locators from YAML files.
 * 
 * This class implements a singleton-like pattern (via static properties) to cache loaded locators,
 * preventing robust file system reads. It assumes locators are stored in the `locators/` directory
 * with a naming convention of `{PageName}Locator.yaml`.
 */
export class LocatorLoader {
    /**
     * Cache for loaded locators. Keys are page names, values are the parsed YAML objects.
     */
    private static locators: Record<string, any> = {};

    /**
     * Loads locators for a specific page from its corresponding YAML file.
     * If the locators are already cached, it returns them directly.
     * 
     * The method looks for files in `../locators/{pageName}Locator.yaml` relative to this file.
     * 
     * @param pageName - The name of the page using PageName enum.
     * @returns The object containing locators for the page.
     * @throws Will throw an error if the file cannot be read or parsed.
     */
    static load(pageName: PageName) {
        if (!this.locators[pageName]) {
            // Adjust path to point to locators folder and file based on pageName
            // Format: {PageObjectName}Locator.yaml
            const filePath = path.resolve(__dirname, `../locators/${pageName}Locator.yaml`);
            try {
                if (!fs.existsSync(filePath)) {
                    throw new Error(`Locator file not found: ${filePath}`);
                }
                const fileContents = fs.readFileSync(filePath, 'utf8');
                this.locators[pageName] = yaml.load(fileContents);
            } catch (error) {
                console.error(`Error loading locators for ${pageName}:`, error);
                throw new Error(`Failed to load locators for ${pageName}. Details: ${error}`);
            }
        }
        return this.locators[pageName];
    }

    /**
     * Retrieves a specific locator string for a given page and key.
     * 
     * @param pageName - The name of the page using PageName enum.
     * @param key - The key of the locator within the YAML file.
     * @returns The locator string.
     * @throws Will throw an error if the locator is not found.
     */
    static get(pageName: PageName, key: string): string {
        const locators = this.load(pageName);
        if (!locators || !locators[key]) {
            throw new Error(`Locator not found for Page: ${pageName}, Key: ${key}`);
        }
        return locators[key];
    }
}
