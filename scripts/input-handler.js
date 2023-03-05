import promptSync from "prompt-sync";
const prompt = promptSync();
import fs from "fs";

function inputString(message) {
    let input = prompt(message);
    input = input.trim();
    return input;
}

function inputNumber(message) {
    let input = prompt(message);
    input = input.trim();
    input = Number(input);
    if (isNaN(input)) {
        console.log("\nInvalid input. Please enter a number.");
        input = inputNumber(message);
    }
    return input;
}

function inputYesNo(message) {
    let input = prompt(message);
    input = input.trim();
    input = input.toLowerCase();
    if (input === "y" || input === "yes") {
        return true;
    } else if (input === "n" || input === "no") {
        return false;
    } else {
        console.log("\nInvalid input. Please enter yes or no.");
        input = inputYesNo(message);
    }
    return input;
}

function inputPath(message, defaultValue) {
    if (defaultValue) { console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`) };
    let input = prompt(message, defaultValue);
    // trim quotation marks at the beginning and end of the path
    input = input.replace(/^"(.*)"$/, '$1');

    if (fs.existsSync(input)) {
        return input;
    } else {
        console.log("Path does not exist. Please enter a valid path.");
        input = inputPath(message, defaultValue);
    }
}

function inputKey(message, dataTable, defaultValue) { // input a single key
    if (defaultValue) { console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`) };
    let input = prompt(message, defaultValue);
    input = input.trim();
    let headerList = Object.keys(dataTable[0]);
    if (headerList.includes(input)) {
        return input;
    } else {
        console.log("Column header does not exist. Please enter a valid column header.");
        input = inputKey(message, dataTable, defaultValue);
    }
}

function inputKeys(message, dataTable, defaultValue) { // input multiple keys, comma separated
    if (defaultValue) { console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`) };
    let headers = [];
    let invalid = [];
    let input = prompt(message, defaultValue);
    input = input.trim();
    input = input.split(",");
    for (let i = 0; i < input.length; i++) {
        input[i] = input[i].trim();

        let headerList = Object.keys(dataTable[0]);
        if (headerList.includes(input[i])) {
            headers.push(input[i]);
        } else {
            invalid.push(input[i]);
        }
    }

    if (invalid.length > 0) {
        console.log(`Column header(s) ${invalid.join(", ")} do not exist. Please enter valid column header(s).`);
        input = inputKey(message, dataTable, defaultValue);
    } else {
        return headers;
    }
}

function inputKeyUnique(message, dataTable, defaultValue) {
    if (defaultValue) { console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`) };
    let input = prompt(message, defaultValue);
    input = input.trim();
    // replace spaces with empty string
    input = input.replace(/\s/g, "");
    
    let headerList = Object.keys(dataTable[0]);
    if (headerList.includes(input)) {
        console.log("Column header already exists. Please enter a unique column header.");
        input = inputKeyUnique(message, dataTable, defaultValue);
    }
    return input;
}

function inputKeysUnique(message, dataTable, defaultValue) { // input multiple keys, comma separated
    if (defaultValue) { console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`) };
    let headers = [];
    let invalid = [];
    let input = prompt(message, defaultValue);
    input = input.trim();
    // replace spaces with empty string
    input = input.replace(/\s/g, "");
    input = input.split(",");
    
    for (let i = 0; i < input.length; i++) {
        input[i] = input[i].trim();

        let headerList = Object.keys(dataTable[0]);
        if (headerList.includes(input) || input === "") {
            invalid.push(input[i]);
        } else {
            headers.push(input[i]);
        }
    }

    if (invalid.length > 0) {
        console.log(`Column header(s) ${invalid.join(", ")} already exist. Please enter unique column header(s).`);
        input = inputKeyUnique(message, dataTable, defaultValue);
    } else {
        return headers;
    }
}

function listKeys(dataTable) {
    let headerList = Object.keys(dataTable[0]);
    console.log("Available column headers:");
    for (let i = 0; i < headerList.length; i++) {
        console.log(`  ${headerList[i]}`);
    }
}

export { inputString, inputNumber, inputYesNo, inputPath, inputKey, inputKeys, inputKeyUnique, inputKeysUnique, listKeys };