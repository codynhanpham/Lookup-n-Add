# Lookup-n-Add
 A script to perform a dictionary-like lookup and add the terms to a new CSV column.

---

# Installation

### Option 1: Use a Bundled Executable

The easiest way to use this script is to download the bundled executable from the [releases page](https://github.com/codynhanpham/Lookup-n-Add/releases). Versions for `x64` Windows, MacOS, and Linux are available. If you are using a different operating system or architecture, you will need to run the script with [Node.js](https://nodejs.org/en/download/) or try to package it yourself (see below).

It does not matter the location where you save the executable. You will be prompted to select the input file path when you run the script, and the output will be in the same directory as the input file.

---

### Option 2: Run with [Node.js](https://nodejs.org/en/download/)

The script was written in [Node.js](https://nodejs.org/en/download/), and that is the intended way to run it. You will need to have [Node.js](https://nodejs.org/en/download/) installed on your machine. You can download the latest version of **Node.js** for your machine [here](https://nodejs.org/en/download/).

**Once you have [Node.js](https://nodejs.org/en/download/) installed, you can start using the script by navigating to the directory where you downloaded this repository and following the instructions below in the terminal or command prompt.**

1. For the first run ever, use this command to download some required dependencies:
```
npm install
```
2. Then, start the script with:
```
node .
```

---

### Option 3: Package the Script Yourself!

If you want to package the script into a single executable, you can do so by first installing **Node.js** [here](https://nodejs.org/en/download/) and downloading this repository onto your machine. Then, from the root directory of the repository, open the terminal or command prompt and follow the instructions below.

1. Install some required dependencies by running:
```
npm install
```
2. Copy and run the two commands in the `build-script.txt` one by one:

The first command will bundle all of the necessary files into a single `build_node14.js` file using [esbuild](https://esbuild.github.io/)
```
npx esbuild index.js --bundle --platform=node --target=node14 --outfile=build_node14.js
```
Then, the second command will package the `build_node14.js` file into a single executable suitable for your machine using [pkg](https://www.npmjs.com/package/pkg)
```
npx pkg build_node14.js -t node14
```

---

# Usage

1. After downloading the raw datasets, even if they are already in the `.csv` format, it is best to open them in Excel or another spreadsheet program and save them as `.csv` files again as `CSV UTF-8 (Comma delimited) (*.csv)`. This will ensure that the files are properly formatted for the script.

2. Start the script using the methods described above (either double-clicking the executable or running `node .`).

3. Regardless of the location of the input (raw) `.csv` file (it does not have to be in the same directory as the script), you will be prompted to enter the path to the input file. On Windows machines, after selecting the file, the shortcut is `Ctrl + Shift + C`. On MacOS, simply `Command + C` while selecting the file will do the trick.

*Tips: After single-clicking to select the file, on Windows 10, another way to get the path is to go to `Home` (top left) → `Copy path...`. On Windows 11, right-clicking the file will give you the option to `Copy as path` in the context menu; meanwhile, on Windows 10, holding `Shift` while right-clicking will show the option.*

4. Follow the prompts to enter the paths and column names. Please see the [example page](https://github.com/codynhanpham/Lookup-n-Add/tree/main/example) for a step-by-step walkthrough.

5. The original input file will be untouched, and the output file will be named `<your-inputFileName>-added.csv` in the same directory as the input file. *If you have your folder sorted by file name, the output file should be right next to the input file.*

6. Check the output file to make sure that the script worked as expected. A quick summary of the percent match will also be printed to the terminal.

---

## Issues
If there are any problems with the code or if you have any additional requirements, feel free to call, text, or email me. You can even open a new Issue on GitHub.
