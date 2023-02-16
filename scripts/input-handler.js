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

function inputPath(message) {
    let input = prompt(message);
    // trim quotation marks at the beginning and end of the path
    input = input.replace(/^"(.*)"$/, '$1');

    if (fs.existsSync(input)) {
        return input;
    } else {
        console.log("Path does not exist. Please enter a valid path.");
        input = inputPath(message);
    }
    return input;
}

function inputKey(message, dataTable) {
    let input = prompt(message);
    input = input.trim();
    let headerExists = false;
    for (let i = 0; i < dataTable.length; i++) {
        if (dataTable[i][input] !== undefined) {
            headerExists = true;
            break;
        }
    }
    if (headerExists) {
        return input;
    } else {
        console.log("Column header does not exist. Please enter a valid column header.");
        input = inputKey(message, dataTable);
    }
    return input;
}

function inputKeyUnique(message, dataTable) {
    let input = prompt(message);
    input = input.trim();
    // replace spaces with empty string
    input = input.replace(/\s/g, "");
    
    let headerList = Object.keys(dataTable[0]);
    if (headerList.includes(input)) {
        console.log("Column header already exists. Please enter a unique column header.");
        input = inputKeyUnique(message, dataTable);
    }
    return input;
}

function listKeys(dataTable) {
    let headerList = Object.keys(dataTable[0]);
    console.log("Available column headers:");
    for (let i = 0; i < headerList.length; i++) {
        console.log(`  ${headerList[i]}`);
    }
}

export { inputString, inputNumber, inputYesNo, inputPath, inputKey, inputKeyUnique, listKeys };