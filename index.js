const CONSTANTS = require('./utils/constants.js');

const { testValidateImageLoaded, login, initializeDriver, closeDriver, testAddProduct, testEmptyForm, testLongDescriptionField,
    testLongNameField, testShortNameField, testPriceField, testDescriptionField, testNameField, testShortDescriptionField, testPriceTextField, openProductPage } = require('./test/test.js');

async function runTests() {
    let driver;

    try {
        driver = await initializeDriver();

        await login(driver, CONSTANTS.URL_LOGIN, "Admin", "123123")

        await openProductPage(driver, CONSTANTS.URL_PRODUCT);
        await driver.sleep(2000);

        const testCases = [
            { fn: testShortNameField, args: [driver, CONSTANTS.PRODUCT_SHORT.NAME] },
            { fn: testShortDescriptionField, args: [driver, CONSTANTS.PRODUCT_SHORT.DESCRIPTION] },
            { fn: testNameField, args: [driver, CONSTANTS.PRODUCT.NAME] },
            { fn: testDescriptionField, args: [driver, CONSTANTS.PRODUCT.DESCRIPTION] },
            { fn: testPriceField, args: [driver, CONSTANTS.PRODUCT.PRICE] },
            { fn: testLongNameField, args: [driver] },
            { fn: testLongDescriptionField, args: [driver] },
            { fn: testPriceTextField, args: [driver, CONSTANTS.PRODUCT_SHORT.PRICE] },
            { fn: testEmptyForm, args: [driver] },
            //{ fn: testAddProduct, args: [driver]},
            //{ fn: testValidateImageLoaded, args: [driver]}
        ];

        for (const testCase of testCases) {
            try {
                await testCase.fn(...testCase.args);
            } catch (error) {
                console.error(`Test case failed: ${testCase.fn.name}\n`, error);
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        await closeDriver(driver);
    }
}

runTests();