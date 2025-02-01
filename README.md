# The Numbers Mason

**The Numbers Mason** is a free, client-side data analysis web application that lets you easily upload and analyze CSV files containing numeric data. Hosted on GitHub Pages, this project leverages Pyodide to run Python code directly in the browser, allowing you to process CSV data, preview its contents, and perform basic statistical modeling—starting with a simple linear regression.

## Features

- **CSV Upload and Drag & Drop:**  
  Easily upload your CSV files by either dragging and dropping them onto the designated area or selecting a file via the file picker.

- **Client-Side Data Processing:**  
  All analysis is performed directly in your browser using Pyodide, ensuring that your data never leaves your computer.

- **CSV Parsing and Preview:**  
  Uses Python's Pandas library (via Pyodide) to read and display CSV headers and a preview of the first five rows.

- **Basic Statistical Modeling:**  
  If your CSV includes columns named `Value1` and `Value2`, a linear regression is automatically performed. The analysis includes:
  - Calculation of regression coefficient, intercept, and R-squared value.
  - Generation of a scatter plot with a regression line.

- **Extensible Platform:**  
  Designed to be enhanced with additional statistical models (e.g., logistic regression, polynomial regression, ridge, and lasso) and further visualizations in future updates.

## Project Structure

- **`index.html`**  
  The main webpage containing the HTML, CSS, and JavaScript needed for CSV upload, drag-and-drop functionality, and running Python code with Pyodide.

- **`LICENSE`**  
  The MIT license file governing the usage and distribution of this project.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge) with JavaScript enabled.
- No additional installations are required since all processing is performed client-side.

### Running the Project

1. **Visit the Website:**  
   Open your browser and go to the live site:  
   `https://evanwmart.github.io/the-numbers-mason/`

2. **Upload a CSV File:**  
   - **Drag & Drop:** Simply drag your CSV file into the drop area.
   - **File Picker:** Click the drop area to open your file selector and choose a CSV file.

3. **View the Analysis:**  
   - The application reads the CSV and displays its headers and a preview of the first five rows.
   - If the CSV includes columns named `Value1` and `Value2`, a linear regression is performed, and you will see:
     - The regression coefficient, intercept, and R-squared value.
     - A scatter plot with the regression line overlay.

## Future Enhancements

- **Additional Statistical Models:**  
  Expand the analysis to include logistic regression, polynomial regression, ridge, lasso, and more.

- **Advanced Visualization:**  
  Improve the interactivity and range of data visualizations.

- **User Interface Enhancements:**  
  Allow users to select which columns to analyze and customize model parameters.

- **Reproducible Code Snippets:**  
  Generate downloadable Python and R code snippets so users can reproduce the analysis locally.
