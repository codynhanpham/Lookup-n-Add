function lookUpAndAdd(lookupTable, lookupKey, lookupValue, inputData, dataKey, dataValue, insertAfter) {
    // loop through the data table, for each row, find the corresponding row in the lookup table using the keys
    // then add the value from the lookup table to the data table, with the new column name (dataValue)
    // if the lookup fails, the new column will be added with an "NA"
    // if insertAfter is not specified, the new column will be added to the end of the row
    // if insertAfter is specified, the new column will be added after the column specified by insertAfter

    let successCount = 0;
    for (let i = 0; i < inputData.length; i++) {
        for (let j = 0; j < lookupTable.length; j++) {
            if (inputData[i][dataKey] === lookupTable[j][lookupKey]) {
                inputData[i][dataValue] = lookupTable[j][lookupValue];
                inputData[i] = moveKeyInObject(inputData[i], dataValue, insertAfter);
                successCount++;
                break;
            }
            if (j === lookupTable.length - 1) { // if the loop reaches the end of the lookup table without finding a match
                inputData[i][dataValue] = "NA";
                inputData[i] = moveKeyInObject(inputData[i], dataValue, insertAfter);
            }
        }
    }

    console.log(`\n${successCount}/${inputData.length} (${successCount/inputData.length*100}%) rows were successfully matched.`);
    return inputData;
}

function moveKeyInObject(object, key, insertAfter) {
    // move the key in the object to the position after the insertAfter key
    // if insertAfter is not specified, the key will be moved to the end of the object

    let newObject = {};
    let keys = Object.keys(object);
    let keyIndex = keys.indexOf(key);
    let insertAfterIndex = keys.indexOf(insertAfter);
    let newKeyIndex = insertAfterIndex + 1;

    if (insertAfterIndex === -1) { // if insertAfter is not specified, move the key to the end of the object
        insertAfterIndex = keys.length - 1;
    }

    for (let i = 0; i < keys.length; i++) {
        if (i === newKeyIndex) {
            newObject[key] = object[key];
        }
        if (i === keyIndex) {
            continue;
        }
        newObject[keys[i]] = object[keys[i]];
    }

    return newObject;
}

export { lookUpAndAdd };