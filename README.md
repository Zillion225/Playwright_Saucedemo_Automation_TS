# Saucedemo Playwright Automation

This project contains an automated test suite for the [Saucedemo](https://www.saucedemo.com/) website, implemented using [Playwright](https://playwright.dev/) and TypeScript.

## 🚀 Key Features

- **Page Object Model (POM)**: Organized and maintainable code structure (`pages/` directory).
- **Locator Management**: Locators are externally managed in YAML files (`locators/` directory) for easy maintenance.
- **Dynamic Username Fetching**: Tests dynamically scrape valid usernames from the login page, ensuring resilience against data changes.
- **End-to-End (E2E) Scenarios**: Covers critical user flows like Login and Checkout.
- **Robustness**: Includes `waitFor` strategies to handle dynamic element loading.
- **Documentation**: Comprehensive JSDoc comments for all test cases.

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (Node Package Manager)

## 📥 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

## 🏃‍♂️ Running Tests

### Run all tests
```bash
npx playwright test
```

### Run with UI Mode (Interactive)
Great for debugging and stepping through tests.
```bash
npx playwright test --ui
```

### Run specific test file
```bash
npx playwright test tests/login.spec.ts
```

### Show HTML Report
After running tests, you can view the detailed HTML report:
```bash
npx playwright show-report
```

## 📂 Project Structure

```
TestProject1/
├── pages/                  # Page Object Models
│   ├── LoginPage.ts        # Login actions & dynamic data fetching
│   ├── InventoryPage.ts    # Product catalog interactions
│   ├── CartPage.ts         # Cart management
│   ├── CheckoutPage.ts     # Checkout forms & completion
│   └── index.ts            # Barrel file for easy imports
├── locators/               # External Locator Registry
│   ├── LoginPageLocator.yaml
│   ├── InventoryPageLocator.yaml
│   ├── CartPageLocator.yaml
│   └── CheckoutPageLocator.yaml
├── utils/                  # Utilities
│   └── LocatorLoader.ts    # YAML Locator Loader
├── tests/                  # Test Specifications
│   ├── login.spec.ts       # Login scenarios (Dynamic usernames)
│   ├── checkout.spec.ts    # E2E purchase flow scenarios
├── playwright.config.ts    # Playwright configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## ⚙️ Configuration

The `playwright.config.ts` file controls the test execution settings.
- **Base URL**: `https://www.saucedemo.com`
- **Headless Mode**: Default is `false` (browser is visible). Change `headless: true` in config to run without UI.
- **Video**: Records video of test execution (configured to `on`).

## 🧪 Test Scenarios

### Login (`tests/login.spec.ts`)
- **Dynamic Data**: Fetches "Accepted usernames" directly from the landing page.
- **Valid Login**: Tests standard user login.
- **Locked Out**: Verifies error message for locked-out accounts.
- **Invalid Credentials**: Verifies error handling for incorrect logins.

### Checkout (`tests/checkout.spec.ts`)
- **Single Item Purchase**: Full flow for buying one product.
- **Multi-Item Purchase**: Full flow for buying multiple products, verifying cart counts and totals.
