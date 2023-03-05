var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ansi-regex/index.js
var require_ansi_regex = __commonJS({
  "node_modules/ansi-regex/index.js"(exports, module2) {
    "use strict";
    module2.exports = (options) => {
      options = Object.assign({
        onlyFirst: false
      }, options);
      const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
      ].join("|");
      return new RegExp(pattern, options.onlyFirst ? void 0 : "g");
    };
  }
});

// node_modules/strip-ansi/index.js
var require_strip_ansi = __commonJS({
  "node_modules/strip-ansi/index.js"(exports, module2) {
    "use strict";
    var ansiRegex = require_ansi_regex();
    var stripAnsi = (string) => typeof string === "string" ? string.replace(ansiRegex(), "") : string;
    module2.exports = stripAnsi;
    module2.exports.default = stripAnsi;
  }
});

// node_modules/prompt-sync/index.js
var require_prompt_sync = __commonJS({
  "node_modules/prompt-sync/index.js"(exports, module2) {
    "use strict";
    var fs3 = require("fs");
    var stripAnsi = require_strip_ansi();
    var term = 13;
    function create(config) {
      config = config || {};
      var sigint = config.sigint;
      var eot = config.eot;
      var autocomplete = config.autocomplete = config.autocomplete || function() {
        return [];
      };
      var history = config.history;
      prompt2.history = history || { save: function() {
      } };
      prompt2.hide = function(ask) {
        return prompt2(ask, { echo: "" });
      };
      return prompt2;
      function prompt2(ask, value, opts) {
        var insert = 0, savedinsert = 0, res, i, savedstr;
        opts = opts || {};
        if (Object(ask) === ask) {
          opts = ask;
          ask = opts.ask;
        } else if (Object(value) === value) {
          opts = value;
          value = opts.value;
        }
        ask = ask || "";
        var echo = opts.echo;
        var masked = "echo" in opts;
        autocomplete = opts.autocomplete || autocomplete;
        var fd = process.platform === "win32" ? process.stdin.fd : fs3.openSync("/dev/tty", "rs");
        var wasRaw = process.stdin.isRaw;
        if (!wasRaw) {
          process.stdin.setRawMode && process.stdin.setRawMode(true);
        }
        var buf = Buffer.alloc(3);
        var str = "", character, read;
        savedstr = "";
        if (ask) {
          process.stdout.write(ask);
        }
        var cycle = 0;
        var prevComplete;
        while (true) {
          read = fs3.readSync(fd, buf, 0, 3);
          if (read > 1) {
            switch (buf.toString()) {
              case "\x1B[A":
                if (masked)
                  break;
                if (!history)
                  break;
                if (history.atStart())
                  break;
                if (history.atEnd()) {
                  savedstr = str;
                  savedinsert = insert;
                }
                str = history.prev();
                insert = str.length;
                process.stdout.write("\x1B[2K\x1B[0G" + ask + str);
                break;
              case "\x1B[B":
                if (masked)
                  break;
                if (!history)
                  break;
                if (history.pastEnd())
                  break;
                if (history.atPenultimate()) {
                  str = savedstr;
                  insert = savedinsert;
                  history.next();
                } else {
                  str = history.next();
                  insert = str.length;
                }
                process.stdout.write("\x1B[2K\x1B[0G" + ask + str + "\x1B[" + (insert + ask.length + 1) + "G");
                break;
              case "\x1B[D":
                if (masked)
                  break;
                var before = insert;
                insert = --insert < 0 ? 0 : insert;
                if (before - insert)
                  process.stdout.write("\x1B[1D");
                break;
              case "\x1B[C":
                if (masked)
                  break;
                insert = ++insert > str.length ? str.length : insert;
                process.stdout.write("\x1B[" + (insert + ask.length + 1) + "G");
                break;
              default:
                if (buf.toString()) {
                  str = str + buf.toString();
                  str = str.replace(/\0/g, "");
                  insert = str.length;
                  promptPrint(masked, ask, echo, str, insert);
                  process.stdout.write("\x1B[" + (insert + ask.length + 1) + "G");
                  buf = Buffer.alloc(3);
                }
            }
            continue;
          }
          character = buf[read - 1];
          if (character == 3) {
            process.stdout.write("^C\n");
            fs3.closeSync(fd);
            if (sigint)
              process.exit(130);
            process.stdin.setRawMode && process.stdin.setRawMode(wasRaw);
            return null;
          }
          if (character == 4) {
            if (str.length == 0 && eot) {
              process.stdout.write("exit\n");
              process.exit(0);
            }
          }
          if (character == term) {
            fs3.closeSync(fd);
            if (!history)
              break;
            if (!masked && str.length)
              history.push(str);
            history.reset();
            break;
          }
          if (character == 9) {
            res = autocomplete(str);
            if (str == res[0]) {
              res = autocomplete("");
            } else {
              prevComplete = res.length;
            }
            if (res.length == 0) {
              process.stdout.write("	");
              continue;
            }
            var item = res[cycle++] || res[cycle = 0, cycle++];
            if (item) {
              process.stdout.write("\r\x1B[K" + ask + item);
              str = item;
              insert = item.length;
            }
          }
          if (character == 127 || process.platform == "win32" && character == 8) {
            if (!insert)
              continue;
            str = str.slice(0, insert - 1) + str.slice(insert);
            insert--;
            process.stdout.write("\x1B[2D");
          } else {
            if (character < 32 || character > 126)
              continue;
            str = str.slice(0, insert) + String.fromCharCode(character) + str.slice(insert);
            insert++;
          }
          ;
          promptPrint(masked, ask, echo, str, insert);
        }
        process.stdout.write("\n");
        process.stdin.setRawMode && process.stdin.setRawMode(wasRaw);
        return str || value || "";
      }
      ;
      function promptPrint(masked, ask, echo, str, insert) {
        if (masked) {
          process.stdout.write("\x1B[2K\x1B[0G" + ask + Array(str.length + 1).join(echo));
        } else {
          process.stdout.write("\x1B[s");
          if (insert == str.length) {
            process.stdout.write("\x1B[2K\x1B[0G" + ask + str);
          } else {
            if (ask) {
              process.stdout.write("\x1B[2K\x1B[0G" + ask + str);
            } else {
              process.stdout.write("\x1B[2K\x1B[0G" + str + "\x1B[" + (str.length - insert) + "D");
            }
          }
          var askLength = stripAnsi(ask).length;
          process.stdout.write(`\x1B[${askLength + 1 + (echo == "" ? 0 : insert)}G`);
        }
      }
    }
    module2.exports = create;
  }
});

// node_modules/convert-csv-to-json/src/util/fileUtils.js
var require_fileUtils = __commonJS({
  "node_modules/convert-csv-to-json/src/util/fileUtils.js"(exports, module2) {
    "use strict";
    var fs3 = require("fs");
    var FileUtils = class {
      readFile(fileInputName, encoding) {
        return fs3.readFileSync(fileInputName, encoding).toString();
      }
      writeFile(json, fileOutputName) {
        fs3.writeFile(fileOutputName, json, function(err) {
          if (err) {
            throw err;
          } else {
            console.log("File saved: " + fileOutputName);
          }
        });
      }
    };
    module2.exports = new FileUtils();
  }
});

// node_modules/convert-csv-to-json/src/util/stringUtils.js
var require_stringUtils = __commonJS({
  "node_modules/convert-csv-to-json/src/util/stringUtils.js"(exports, module2) {
    "use strict";
    var StringUtils = class {
      trimPropertyName(value) {
        return value.replace(/\s/g, "");
      }
      getValueFormatByType(value) {
        if (value === void 0 || value === "") {
          return String();
        }
        let isNumber = !isNaN(value);
        if (isNumber) {
          return Number(value);
        }
        if (value === "true" || value === "false") {
          return JSON.parse(value.toLowerCase());
        }
        return String(value);
      }
      hasContent(values) {
        if (values.length > 0) {
          for (let i = 0; i < values.length; i++) {
            if (values[i]) {
              return true;
            }
          }
        }
        return false;
      }
    };
    module2.exports = new StringUtils();
  }
});

// node_modules/convert-csv-to-json/src/util/jsonUtils.js
var require_jsonUtils = __commonJS({
  "node_modules/convert-csv-to-json/src/util/jsonUtils.js"(exports, module2) {
    "use strict";
    var JsonUtil = class {
      validateJson(json) {
        try {
          JSON.parse(json);
        } catch (err) {
          throw Error("Parsed csv has generated an invalid json!!!\n" + err);
        }
      }
    };
    module2.exports = new JsonUtil();
  }
});

// node_modules/convert-csv-to-json/src/csvToJson.js
var require_csvToJson = __commonJS({
  "node_modules/convert-csv-to-json/src/csvToJson.js"(exports, module2) {
    "use strict";
    var fileUtils = require_fileUtils();
    var stringUtils = require_stringUtils();
    var jsonUtils = require_jsonUtils();
    var newLine = /\r?\n/;
    var defaultFieldDelimiter = ";";
    var CsvToJson = class {
      formatValueByType(active) {
        this.printValueFormatByType = active;
        return this;
      }
      fieldDelimiter(delimiter) {
        this.delimiter = delimiter;
        return this;
      }
      indexHeader(indexHeader) {
        if (isNaN(indexHeader)) {
          throw new Error("The index Header must be a Number!");
        }
        this.indexHeader = indexHeader;
        return this;
      }
      parseSubArray(delimiter = "*", separator = ",") {
        this.parseSubArrayDelimiter = delimiter;
        this.parseSubArraySeparator = separator;
      }
      encoding(encoding) {
        this.encoding = encoding;
        return this;
      }
      generateJsonFileFromCsv(fileInputName, fileOutputName) {
        let jsonStringified = this.getJsonFromCsvStringified(fileInputName);
        fileUtils.writeFile(jsonStringified, fileOutputName);
      }
      getJsonFromCsvStringified(fileInputName) {
        let json = this.getJsonFromCsv(fileInputName);
        let jsonStringified = JSON.stringify(json, void 0, 1);
        jsonUtils.validateJson(jsonStringified);
        return jsonStringified;
      }
      getJsonFromCsv(fileInputName) {
        let parsedCsv = fileUtils.readFile(fileInputName, this.encoding);
        return this.csvToJson(parsedCsv);
      }
      csvStringToJson(csvString) {
        return this.csvToJson(csvString);
      }
      csvToJson(parsedCsv) {
        let lines = parsedCsv.split(newLine);
        let fieldDelimiter2 = this.getFieldDelimiter();
        let index = this.getIndexHeader();
        let headers = lines[index].split(fieldDelimiter2);
        while (!stringUtils.hasContent(headers) && index <= lines.length) {
          index = index + 1;
          headers = lines[index].split(fieldDelimiter2);
        }
        let jsonResult = [];
        for (let i = index + 1; i < lines.length; i++) {
          let currentLine = lines[i].split(fieldDelimiter2);
          if (stringUtils.hasContent(currentLine)) {
            jsonResult.push(this.buildJsonResult(headers, currentLine));
          }
        }
        return jsonResult;
      }
      getFieldDelimiter() {
        if (this.delimiter) {
          return this.delimiter;
        }
        return defaultFieldDelimiter;
      }
      getIndexHeader() {
        if (this.indexHeader !== null && !isNaN(this.indexHeader)) {
          return this.indexHeader;
        }
        return 0;
      }
      buildJsonResult(headers, currentLine) {
        let jsonObject = {};
        for (let j = 0; j < headers.length; j++) {
          let propertyName = stringUtils.trimPropertyName(headers[j]);
          let value = currentLine[j];
          if (this.isParseSubArray(value)) {
            value = this.buildJsonSubArray(value);
          }
          if (this.printValueFormatByType && !Array.isArray(value)) {
            value = stringUtils.getValueFormatByType(currentLine[j]);
          }
          jsonObject[propertyName] = value;
        }
        return jsonObject;
      }
      buildJsonSubArray(value) {
        let extractedValues = value.substring(
          value.indexOf(this.parseSubArrayDelimiter) + 1,
          value.lastIndexOf(this.parseSubArrayDelimiter)
        );
        extractedValues.trim();
        value = extractedValues.split(this.parseSubArraySeparator);
        if (this.printValueFormatByType) {
          for (let i = 0; i < value.length; i++) {
            value[i] = stringUtils.getValueFormatByType(value[i]);
          }
        }
        return value;
      }
      isParseSubArray(value) {
        if (this.parseSubArrayDelimiter) {
          if (value && (value.indexOf(this.parseSubArrayDelimiter) === 0 && value.lastIndexOf(this.parseSubArrayDelimiter) === value.length - 1)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = new CsvToJson();
  }
});

// node_modules/convert-csv-to-json/index.js
var require_convert_csv_to_json = __commonJS({
  "node_modules/convert-csv-to-json/index.js"(exports) {
    "use strict";
    var csvToJson = require_csvToJson();
    var encodingOps = {
      utf8: "utf8",
      ucs2: "ucs2",
      utf16le: "utf16le",
      latin1: "latin1",
      ascii: "ascii",
      base64: "base64",
      hex: "hex"
    };
    exports.formatValueByType = function(active = true) {
      csvToJson.formatValueByType(active);
      return this;
    };
    exports.fieldDelimiter = function(delimiter) {
      csvToJson.fieldDelimiter(delimiter);
      return this;
    };
    exports.indexHeader = function(index) {
      csvToJson.indexHeader(index);
      return this;
    };
    exports.parseSubArray = function(delimiter, separator) {
      csvToJson.parseSubArray(delimiter, separator);
      return this;
    };
    exports.customEncoding = function(encoding) {
      csvToJson.encoding = encoding;
      return this;
    };
    exports.utf8Encoding = function utf8Encoding() {
      csvToJson.encoding = encodingOps.utf8;
      return this;
    };
    exports.ucs2Encoding = function() {
      csvToJson.encoding = encodingOps.ucs2;
      return this;
    };
    exports.utf16leEncoding = function() {
      csvToJson.encoding = encodingOps.utf16le;
      return this;
    };
    exports.latin1Encoding = function() {
      csvToJson.encoding = encodingOps.latin1;
      return this;
    };
    exports.asciiEncoding = function() {
      csvToJson.encoding = encodingOps.ascii;
      return this;
    };
    exports.base64Encoding = function() {
      this.csvToJson = encodingOps.base64;
      return this;
    };
    exports.hexEncoding = function() {
      this.csvToJson = encodingOps.hex;
      return this;
    };
    exports.generateJsonFileFromCsv = function(inputFileName, outputFileName2) {
      if (!inputFileName) {
        throw new Error("inputFileName is not defined!!!");
      }
      if (!outputFileName2) {
        throw new Error("outputFileName is not defined!!!");
      }
      csvToJson.generateJsonFileFromCsv(inputFileName, outputFileName2);
    };
    exports.getJsonFromCsv = function(inputFileName) {
      if (!inputFileName) {
        throw new Error("inputFileName is not defined!!!");
      }
      return csvToJson.getJsonFromCsv(inputFileName);
    };
    exports.csvStringToJson = function(csvString) {
      return csvToJson.csvStringToJson(csvString);
    };
    exports.jsonToCsv = function(inputFileName, outputFileName2) {
      csvToJson.generateJsonFileFromCsv(inputFileName, outputFileName2);
    };
  }
});

// scripts/input-handler.js
var import_prompt_sync = __toESM(require_prompt_sync(), 1);
var import_fs = __toESM(require("fs"), 1);
var prompt = (0, import_prompt_sync.default)();
function inputString(message) {
  let input = prompt(message);
  input = input.trim();
  return input;
}
function inputPath(message, defaultValue) {
  if (defaultValue) {
    console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`);
  }
  ;
  let input = prompt(message, defaultValue);
  input = input.replace(/^"(.*)"$/, "$1");
  if (import_fs.default.existsSync(input)) {
    return input;
  } else {
    console.log("Path does not exist. Please enter a valid path.");
    input = inputPath(message, defaultValue);
  }
}
function inputKey(message, dataTable, defaultValue) {
  if (defaultValue) {
    console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`);
  }
  ;
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
function inputKeys(message, dataTable, defaultValue) {
  if (defaultValue) {
    console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`);
  }
  ;
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
  if (defaultValue) {
    console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`);
  }
  ;
  let input = prompt(message, defaultValue);
  input = input.trim();
  input = input.replace(/\s/g, "");
  let headerList = Object.keys(dataTable[0]);
  if (headerList.includes(input)) {
    console.log("Column header already exists. Please enter a unique column header.");
    input = inputKeyUnique(message, dataTable, defaultValue);
  }
  return input;
}
function inputKeysUnique(message, dataTable, defaultValue) {
  if (defaultValue) {
    console.log(`Simply hit Enter to use the settings' default: ${defaultValue}`);
  }
  ;
  let headers = [];
  let invalid = [];
  let input = prompt(message, defaultValue);
  input = input.trim();
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

// scripts/csv-parsing.js
var CSV_TO_JSON = __toESM(require_convert_csv_to_json(), 1);
function parseCSV(csvLocation) {
  let json = CSV_TO_JSON.fieldDelimiter(",").parseSubArray("*", ",").getJsonFromCsv(csvLocation);
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

// scripts/lookup.js
function lookUpAndAdd(lookupTable2, lookupKey2, lookupValues2, inputData2, dataKey2, dataValues2) {
  const lookupList = makeLookupList(lookupTable2, lookupKey2, lookupValues2);
  let successCount = 0;
  for (let row of inputData2) {
    if (lookupList[row[dataKey2]]) {
      for (let i = 0; i < lookupValues2.length; i++) {
        row[dataValues2[i]] = lookupList[row[dataKey2]][lookupValues2[i]];
      }
      successCount++;
    } else {
      for (let i = 0; i < lookupValues2.length; i++) {
        row[dataValues2[i]] = "NA";
      }
    }
  }
  console.log(`
${successCount}/${inputData2.length} (${successCount / inputData2.length * 100}%) rows were successfully matched.`);
  return inputData2;
}
function makeLookupList(lookupTable2, lookupKey2, lookupValues2) {
  let lookupList = {};
  for (let row of lookupTable2) {
    lookupList[row[lookupKey2]] = {};
    for (let value of lookupValues2) {
      lookupList[row[lookupKey2]][value] = row[value];
    }
  }
  return lookupList;
}
function checkDuplicateKeys(lookupTable2, lookupKey2) {
  console.log(`
Checking for duplicate keys in the "${lookupKey2}" column (This will only be run once)...`);
  console.time("Check Duplicate Keys");
  let duplicateKeys = [];
  let uniqueKeys = [];
  let hasDuplicate = false;
  const lookupKeyList = lookupTable2.map((row) => row[lookupKey2]);
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

// index.js
var import_fs2 = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);

// settings.js
var settings = {
  lookupTablePath: "",
  lookupKey: "",
  lookupValues: "",
  inputDataPath: "",
  dataKey: "",
  dataValues: "",
  checkedDuplicateKeys: false
};
var settings_default = settings;

// index.js
var Settings = {};
if (import_fs2.default.existsSync("./settings.json")) {
  Settings = JSON.parse(import_fs2.default.readFileSync("./settings.json", "utf8"));
} else {
  const settingsJSON = JSON.stringify(settings_default, null, 4);
  import_fs2.default.writeFileSync("./settings.json", settingsJSON, "utf8");
  Settings = JSON.parse(import_fs2.default.readFileSync("/.settings.json", "utf8"));
}
console.clear();
console.log("The source code and compiled executable of this script is available at https://github.com/codynhanpham/Lookup-n-Add\n\n");
var lookupTablePath = inputPath("Enter the path to the lookup table: ", Settings.lookupTablePath);
var lookupTable = parseCSV(lookupTablePath);
listKeys(lookupTable);
console.log("\nPlease enter the column to lookup. This is the column in the lookup table with the same values as in the data table.");
var lookupKey = inputKey("Enter the column header to lookup: ", lookupTable, Settings.lookupKey);
console.log("\nPlease enter the column to add. This is the column in the lookup table with the values you want to add to the data table.");
var lookupValues = inputKeys("Enter the column header to add: ", lookupTable, Settings.lookupValues);
console.log("\n	----\n");
var inputDataPath = inputPath("Enter the path to the data: ", Settings.inputDataPath);
var inputData = parseCSV(inputDataPath);
listKeys(inputData);
console.log("\nPlease enter the column to lookup. The values in this column will be used to match with those in the lookup table.");
var dataKey = inputKey("Enter the column header to lookup: ", inputData, Settings.dataKey);
console.log("");
var dataValues = inputKeysUnique("How would you want to name the new added column? ", inputData, Settings.dataValues);
if (!Settings.checkedDuplicateKeys) {
  const duplicates = checkDuplicateKeys(lookupTable, lookupKey);
  if (duplicates.hasDuplicate) {
    console.log(`
\x1B[31m%s\x1B[0m`, `ERROR: The lookup table has duplicate keys. Please remove the duplicates and try again.`);
    console.log(`
\x1B[31m%s\x1B[0m`, `Duplicates: ${duplicates.duplicateKeys.join(", ")}`);
    throw new Error("Duplicate keys found in lookup table. Please remove the duplicates (see above) and try again.");
  } else {
    console.log(`
\x1B[32m%s\x1B[0m`, `Passed! No duplicate keys found in lookup table.`);
    Settings.checkedDuplicateKeys = true;
    const settingsJSON = JSON.stringify(Settings, null, 4);
    import_fs2.default.writeFileSync(__dirname + "/settings.json", settingsJSON, "utf8");
  }
}
console.log("\x1B[32m%s\x1B[0m", "\nNow running fast and hot...\n");
console.time("Looking up data");
var outputData = lookUpAndAdd(lookupTable, lookupKey, lookupValues, inputData, dataKey, dataValues);
console.timeEnd("Looking up data");
console.time("Making CSV");
var outputCSV = toCSVString(outputData);
console.timeEnd("Making CSV");
var outputDir = import_path.default.dirname(inputDataPath);
var outputFileName = import_path.default.basename(inputDataPath, ".csv") + "-added.csv";
var outputPath = import_path.default.join(outputDir, outputFileName);
console.time("Writing to file");
import_fs2.default.writeFileSync(outputPath, outputCSV, "utf8");
console.timeEnd("Writing to file");
console.log("\n");
console.log(`Done! Output saved to ${outputPath}
`);
var end = inputString("(Press enter to exit)\n");
