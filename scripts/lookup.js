function lookUpAndAdd(lookupTable, lookupKey, lookupValues, inputData, dataKey, dataValues) {
    // Use a hash table to store the lookup table for O(1) lookup time
    const lookupList = makeLookupList(lookupTable, lookupKey, lookupValues);

    let successCount = 0;
    for (let row of inputData) {
        if (lookupList[row[dataKey]]) {
            for (let i = 0; i < lookupValues.length; i++) {
                row[dataValues[i]] = lookupList[row[dataKey]][lookupValues[i]];
            }
            successCount++;
        } else {
            for (let i = 0; i < lookupValues.length; i++) {
                row[dataValues[i]] = "NA";
            }
        }
    }

    console.log(`\n${successCount}/${inputData.length} (${successCount/inputData.length*100}%) rows were successfully matched.`);
    return inputData;
}

function makeLookupList(lookupTable, lookupKey, lookupValues) {
    // make a lookup list from the lookup table
    // the lookup list is an object with the lookupKey as the key and the {lookupValues} as the value
    // this will be used to speed up the lookup process

    let lookupList = {};
    for (let row of lookupTable) {
        lookupList[row[lookupKey]] = {};
        for (let value of lookupValues) {
            lookupList[row[lookupKey]][value] = row[value];
        }
    }

    return lookupList;
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

function checkDuplicateKeys(lookupTable, lookupKey) {
    // check if there are any duplicate value in the lookupKey column (this will be used to match, so it must be unique)
    // return an object with: { hasDuplicate: true/false, duplicateKeys: [array of duplicate keys], uniqueKeys: [array of unique keys] }

    console.log(`\nChecking for duplicate keys in the "${lookupKey}" column (This will only be run once)...`);
    console.time("Check Duplicate Keys");
    let duplicateKeys = [];
    let uniqueKeys = [];
    let hasDuplicate = false;

    const lookupKeyList = lookupTable.map(row => row[lookupKey]);

    for (let i = 0; i < lookupKeyList.length; i++) {
        if (uniqueKeys.includes(lookupKeyList[i])) {
            if (!duplicateKeys.includes(lookupKeyList[i])) {
                duplicateKeys.push(lookupKeyList[i]);
            }
            hasDuplicate = true;
        } else {
            uniqueKeys.push(lookupKeyList[i]);
        }
    }

    console.timeEnd("Check Duplicate Keys");
    return { hasDuplicate, duplicateKeys, uniqueKeys };
}

export { lookUpAndAdd, checkDuplicateKeys };