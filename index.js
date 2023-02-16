import * as InputHandler from "./scripts/input-handler.js";
import * as CSVParser from "./scripts/csv-parsing.js";
import * as LookUp from "./scripts/lookup.js";

import fs from "fs";
import path from "path";

console.clear();

console.log("The source code and compiled executable of this script is available at https://github.com/codynhanpham/Lookup-n-Add\n\n");

// INPUT STUFF

const lookupTablePath = InputHandler.inputPath("Enter the path to the lookup table: ");
const lookupTable = CSVParser.parseCSV(lookupTablePath);
InputHandler.listKeys(lookupTable);
console.log("\nPlease enter the column to lookup. This is the column in the lookup table with the same values as in the data table.");
const lookupKey = InputHandler.inputKey("Enter the column header to lookup: ", lookupTable);
console.log("\nPlease enter the column to add. This is the column in the lookup table with the values you want to add to the data table.");
const lookupValue = InputHandler.inputKey("Enter the column header to add: ", lookupTable);

console.log("\n\t----\n")
const inputDataPath = InputHandler.inputPath("Enter the path to the data: ");
const inputData = CSVParser.parseCSV(inputDataPath);
InputHandler.listKeys(inputData);
console.log("\nPlease enter the column to lookup. The values in this column will be used to match with those in the lookup table.");
const dataKey = InputHandler.inputKey("Enter the column header to lookup: ", inputData);

console.log("");
const dataValue = InputHandler.inputKeyUnique("How would you want to name the new added column? ", inputData);


// LOOKUP AND ADD
console.log('\x1b[32m%s\x1b[0m',"\nRunning fast and hot...\n");
console.time("Looking up data");
const outputData = LookUp.lookUpAndAdd(lookupTable, lookupKey, lookupValue, inputData, dataKey, dataValue, dataKey);
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