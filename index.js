import * as InputHandler from "./scripts/input-handler.js";
import * as CSVParser from "./scripts/csv-parsing.js";
import * as LookUp from "./scripts/lookup.js";

import fs from "fs";
import path from "path";

let Settings = {};
import settings from "./settings.js";
// Check if there is a settings.json file
if (fs.existsSync("./settings.json")) {
    Settings = JSON.parse(fs.readFileSync("./settings.json", "utf8"));
} else {
    // Make a settings.json file using the template settings.js file
    const settingsJSON = JSON.stringify(settings, null, 4);
    fs.writeFileSync("./settings.json", settingsJSON, "utf8");
    Settings = JSON.parse(fs.readFileSync("/.settings.json", "utf8"));
}

console.clear();

console.log("The source code and compiled executable of this script is available at https://github.com/codynhanpham/Lookup-n-Add\n\n");

// INPUT STUFF

const lookupTablePath = InputHandler.inputPath("Enter the path to the lookup table: ", Settings.lookupTablePath);
const lookupTable = CSVParser.parseCSV(lookupTablePath);
InputHandler.listKeys(lookupTable);
console.log("\nPlease enter the column to lookup. This is the column in the lookup table with the same values as in the data table.");
const lookupKey = InputHandler.inputKey("Enter the column header to lookup: ", lookupTable, Settings.lookupKey);
console.log("\nPlease enter the column to add. This is the column in the lookup table with the values you want to add to the data table.");
const lookupValues = InputHandler.inputKeys("Enter the column header to add: ", lookupTable, Settings.lookupValues);

console.log("\n\t----\n")
const inputDataPath = InputHandler.inputPath("Enter the path to the data: ", Settings.inputDataPath);
const inputData = CSVParser.parseCSV(inputDataPath);
InputHandler.listKeys(inputData);
console.log("\nPlease enter the column to lookup. The values in this column will be used to match with those in the lookup table.");
const dataKey = InputHandler.inputKey("Enter the column header to lookup: ", inputData, Settings.dataKey);

console.log("");
const dataValues = InputHandler.inputKeysUnique("How would you want to name the new added column? ", inputData, Settings.dataValues);

// LOOKUP AND ADD

if (!Settings.checkedDuplicateKeys) {
    const duplicates = LookUp.checkDuplicateKeys(lookupTable, lookupKey);

    if (duplicates.hasDuplicate) {
        console.log(`\n\x1b[31m%s\x1b[0m`, `ERROR: The lookup table has duplicate keys. Please remove the duplicates and try again.`);
        console.log(`\n\x1b[31m%s\x1b[0m`, `Duplicates: ${duplicates.duplicateKeys.join(", ")}`);
        throw new Error("Duplicate keys found in lookup table. Please remove the duplicates (see above) and try again.");
    } else {
        console.log(`\n\x1b[32m%s\x1b[0m`, `Passed! No duplicate keys found in lookup table.`);
        // Save the settings so that we don't have to check for duplicates again
        Settings.checkedDuplicateKeys = true;
        const settingsJSON = JSON.stringify(Settings, null, 4);
        fs.writeFileSync(__dirname + "/settings.json", settingsJSON, "utf8");
    }
}

console.log('\x1b[32m%s\x1b[0m',"\nNow running fast and hot...\n");
console.time("Looking up data");
const outputData = LookUp.lookUpAndAdd(lookupTable, lookupKey, lookupValues, inputData, dataKey, dataValues);
console.timeEnd("Looking up data");

console.time("Making CSV");
const outputCSV = CSVParser.toCSVString(outputData);
console.timeEnd("Making CSV");


// OUTPUT TO FILE

const outputDir = path.dirname(inputDataPath);
let outputFileName = path.basename(inputDataPath, ".csv") + "-added.csv";
let outputPath = path.join(outputDir, outputFileName);

// write the formatted data to the csv
console.time("Writing to file");
fs.writeFileSync(outputPath, outputCSV, "utf8");
console.timeEnd("Writing to file");

console.log("\n");
console.log(`Done! Output saved to ${outputPath}\n`);

const end = InputHandler.inputString("(Press enter to exit)\n"); // keep the console open