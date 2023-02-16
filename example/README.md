# A Step-by-Step Walkthrough Example

Feel free to follow along with this example to see how the script works.

## The Data

The data used for this example is in the `data` folder. The first file, `In_00-In_24_allGenes_0.05.csv`, is the raw data file, and the second file, `V3.csv`, is the lookup table. Please take a look at the files to see what they look like.

## The Objective

We can see that the raw data file lacks the `GeneName` column, which is present in the `V3.csv` lookup table. We will try to add the `GeneName` column to the raw data file using the lookup file.

# The Run

### Step 1: Start the Script

You can either double-click the executable or run `node .` in the terminal or command prompt, as instructed in the [Home Page](https://github.com/codynhanpham/Lookup-n-Add).

### Step 2: Select the Lookup File

You will be prompted to select the lookup file. In this example, it is the `V3.csv`. How to get the path to the file varies quite a bit depending on the operating system.

- On Windows machines, holding down the `Shift` key and right-clicking on the file will give you the option to `Copy as path`. If you are on Windows 11, a quick shortcut is to press `Ctrl + Shift + C` after selecting the file.

- On MacOS, you can right-click (Control-click) on the file and select `Copy "V3.csv" as Pathname`.

Then, paste the path into the terminal or command prompt and press `Enter`. On Windows, it is Right-Click to paste. The window should look like this after this step:

![Step 2: Lookup file path](https://raw.githubusercontent.com/codynhanpham/Lookup-n-Add/main/example/media/lookup-path.png)

### Step 3: Select the `Lookup` Key Column Header

Available column headers will be displayed. Type in or copy the column header that you want to use to match the data in the lookup file. In this example, we will use the `GeneID` column. Things should look like this after this step:

![Step 3: Lookup column header](https://raw.githubusercontent.com/codynhanpham/Lookup-n-Add/main/example/media/lookup-column-header.png)

### Step 4: Select the `Lookup` Value Column Header

Similar to the previous step, we now want the column with the values that we want to match and add to the raw data file. In this example, we will use the `GeneName` column. Hit `Enter` to continue.

### Step 5: Select the Raw Data File

Select the raw data file. In this example, it is the `In_00-In_24_allGenes_0.05.csv` file. Things should look like this after this step:

![Step 5: Raw data file path](https://raw.githubusercontent.com/codynhanpham/Lookup-n-Add/main/example/media/raw-data-path.png)

### Step 6: Select the `Raw Data` Key Column Header

This is the column in the raw data whose values will be matched with the values in the column selected in step 3 in the lookup file. In this example, we will use the `ID` column. Hit `Enter` to continue.

### Step 7: Select the `Raw Data` Value Column Header

You now name the header for the column that will be added to the raw data file. In this example, let's name it `geneName`. Hit `Enter` to continue.

The window should now look something like this:

![Step 7: Raw data column header](https://raw.githubusercontent.com/codynhanpham/Lookup-n-Add/main/example/media/raw-data-column-header.png)

### Step 8: Wait and Profit

It should take a few seconds to complete, depending on the size of the files. Once it is done, a quick summary of matched results will be displayed. If all values in the raw data file were matched found in the lookup file, the percentage should be 100%. Otherwise, the unmatched entries will have the value of `NA` in the new column.

You can then simply close the window to exit the script. The new file will be saved in the same folder as the raw data file, with the name `In_00-In_24_allGenes_0.05-added.csv`. The output file is also included in the `data` folder.

**Summary**


![Step 8: Summary](https://raw.githubusercontent.com/codynhanpham/Lookup-n-Add/main/example/media/summary.png)
