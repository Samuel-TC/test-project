const { By, Key, Builder, until } = require("selenium-webdriver");
const path = require('path');
require("chromedriver");

async function initializeDriver() {
    return await new Builder().forBrowser("chrome").build();
}

async function closeDriver(driver) {
    if (driver) {
        await driver.quit();
    }
}

async function login(driver, urlLogin, userName, password) {
    try {
        await driver.get(urlLogin);
        await driver.findElement(By.id(':r0:')).sendKeys(userName);
        await driver.findElement(By.id(':r1:')).sendKeys(password, Key.RETURN);

    } catch (error) {
        console.error(error);
    }
}

async function openProductPage(driver, urlProduct) {
    await driver.sleep(2000);
    await driver.get(urlProduct);
    await driver.findElement(By.css('.btn-primary')).click();
}

//Name
async function testNameField(driver, nameProduct) {
    try {
        await driver.findElement(By.id(":ra:")).sendKeys(nameProduct);
        const nameValue = await driver.findElement(By.id(":ra:")).getAttribute("value");
        await driver.findElement(By.id(":ra:")).clear();

        if (nameValue !== "X"+nameProduct) {
            throw new Error("El valor del campo de nombre no es correcto");
        }

    } catch (error) {
        console.error(error);
    }
}

//Description
async function testDescriptionField(driver, descriptionProduct) {
    try {
        await driver.findElement(By.id(":rc:")).sendKeys(descriptionProduct);
        const descriptionValue = await driver.findElement(By.id(":rc:")).getAttribute("value");

        if (descriptionValue !== "X"+descriptionProduct) {
            throw new Error("El valor del campo de descripción no es correcto");
        }

    } catch (error) {
        console.error(error);
    }
}

//Price
async function testPriceField(driver, priceProduct) {
    try {
        await driver.findElement(By.id(":rd:")).clear();
        await driver.findElement(By.id(":rd:")).sendKeys(priceProduct);
        const priceValue = await driver.findElement(By.id(":rd:")).getAttribute("value");

        if (priceValue !== "0"+priceProduct) {
            throw new Error("El valor del campo de precio no es correcto");
        }

    } catch (error) {
        console.error(error);
    }
}

//Price
async function testPriceTextField(driver, priceProduct) {
    try {
        await driver.findElement(By.id(":rd:")).clear();
        await driver.findElement(By.id(":rd:")).sendKeys(priceProduct);
        const priceValue = await driver.findElement(By.id(":rd:")).getAttribute("value");

        if ( isNaN(priceValue)) {
            throw new Error("El valor del campo de precio no es correcto");
        }

    } catch (error) {
        console.error(error);
    }
}

//Short Name
async function testShortNameField(driver, nameProduct) {
    try {
        await driver.findElement(By.id(":ra:")).sendKeys(nameProduct);
        const errorMessage = await driver.findElement(By.css('.form-floating .input-error')).getText();

        if (!errorMessage.includes("Se requieren al menos 5 carácteres")) {
            throw new Error("No se ha mostrado el mensaje de error por nombre demasiado corto");
        }

    } catch (error) {
        console.error(error);
    }
}

//Short Description
async function testShortDescriptionField(driver, descriptionProduct) {
    try {
        await driver.findElement(By.id(":rc:")).sendKeys(descriptionProduct);
        const errorMessage = await driver.findElement(By.css('.col > div > .form-floating > .input-error')).getText();

        if (!errorMessage.includes("Se requieren al menos 5 carácteres")) {
            throw new Error("No se ha mostrado el mensaje de error por descripcion demasiado corto");
        }

    } catch (error) {
        console.error(error);
    }
}

//Long Name
async function testLongNameField(driver) {
    try {
        await driver.findElement(By.id(":ra:")).sendKeys("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        const errorMessage = await driver.findElement(By.css('.col > div > .form-floating > .input-error')).getText();

        if (!errorMessage.includes("El máximo es de 25 carácteres")) {
            throw new Error("No se ha mostrado el mensaje de error por nombre demasiado largo");
        }

    } catch (error) {

    }
}

//Long Description
async function testLongDescriptionField(driver) {
    try {
        await driver.findElement(By.id(":rc:")).sendKeys("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        const errorMessage = await driver.findElement(By.css('.col > div > .form-floating > .input-error')).getText();

        if (!errorMessage.includes("El máximo es de 25 carácteres")) {
            throw new Error("No se ha mostrado el mensaje de error por descripcion demasiado larga");
        }

    } catch (error) {
        console.error(error);
    }
}

//invalid data
async function testEmptyForm(driver) {
    try {
        await driver.findElement(By.css(".btn-primary")).click();
        const errorAlert = await driver.findElement(By.css('.swal2-popup'));

        const title = await driver.findElement(By.css('.login-form__title')).getText();

        if (!errorAlert || title != "Agregar producto") {
            throw new Error("No se ha mostrado el mensaje de error por datos invalidos");
        }

    } catch (error) {
        console.error(error);
    }
}

//Added product
async function testAddProduct(driver) {
    try {
        let name = "Producto de prueba"
        await driver.findElement(By.id(":ra:")).sendKeys(name);
        await driver.findElement(By.id(":rd:")).sendKeys("1000");
        await driver.findElement(By.id(":rc:")).sendKeys("Producto de prueba descripcio");
        await driver.findElement(By.id("id")).sendKeys("Rollo");
        await driver.findElement(By.css(".form-floating:nth-child(1) > #id")).sendKeys("Pepino");
        //image path
        let input = await driver.findElement(By.css('input[type="file"]'));
        input.sendKeys(path.resolve(__dirname, 'ladrillo.png'));
        await driver.sleep(2000);
        await driver.findElement(By.css(".btn-primary")).click();

        await driver.sleep(5000);

        const title = await driver.findElement(By.css('h1')).getText();
        const productName = await driver.findElement(By.css('#row-0 > #cell-1-undefined')).getText();

        if (title !== "Productos" || productName != name) {
            throw new Error("No se agrego el producto");
        }

    } catch (error) {
        console.error(error);
    }
}

//validate loaded image
async function testValidateImageLoaded(driver) {
    try {
        // Click en el botón para abrir el modal
        await driver.findElement(By.css("#row-0 > #cell-6-undefined > .btn")).click();
        await driver.sleep(2000);
        // Obtiene el elemento de la imagen en el modal
        const element = await driver.findElement(By.css(".modal__product-image"));
        // Espera hasta que el elemento sea visible
        await driver.wait(until.elementIsVisible(element));
        // Obtiene la propiedad src del elemento
        const src = await element.getAttribute("src");
        // Verifica si la propiedad src está vacía
        if (!src.startsWith("data:image/")) {
            throw new Error("No se cargo la imagen en el  modal");
        }

    } catch (error) {
        console.error(error);
    }
    // Si la propiedad src no está vacía, la imagen se cargó correctamente
    
}

module.exports = { login, testValidateImageLoaded, initializeDriver, closeDriver, testAddProduct, testDescriptionField, testNameField, testShortNameField,
                    testShortDescriptionField, testLongNameField, testLongDescriptionField, testEmptyForm, testPriceField,testPriceTextField, openProductPage };
