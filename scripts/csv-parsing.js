import * as CSV_TO_JSON from "convert-csv-to-json";

function removeKeys(json, keys) {
    for (let i = 0; i < json.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            delete json[i][keys[j]];
        }
    }
    return json;
}

function parseCSV(csvLocation) {
    let json = CSV_TO_JSON.fieldDelimiter(',').parseSubArray('*',',').getJsonFromCsv(csvLocation);
    return json;
}

function toCSVString(dataArray) {
    let csvString = "";
    let hearders = Object.keys(dataArray[0]);
    csvString += hearders.join(",") + "\n";
    for (let i = 0; i < dataArray.length; i++) {
        let row = [];
        for (let j = 0; j < hearders.length; j++) {
            row.push(dataArray[i][hearders[j]]);
        }
        csvString += row.join(",") + "\n";
    }
    return csvString;
}

export { parseCSV, removeKeys, toCSVString };