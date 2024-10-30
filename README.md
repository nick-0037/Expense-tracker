# Expense tracker

Expense Tracker is a command-line-interface (CLI) aaplication for managing your monthly expenses. It allows you to record expenses, set a budget, and export your expenses to a CSV file for easier analysis.
https://roadmap.sh/projects/expense-tracker

## Features

- Record and manage monthly expenses.
- Set a budget for each month.
- Export expenses to a CSV file.
- Load and save data in JSON files.

## Installation

```bash
git clone https://github.com/nick-0037/Expense-tracker
cd expense-tracker
npm install
```

## Usage

Available Commands:

- Add:
  
```bash
  node index.js add --description 'expense-description' --amount 'Amount' --category

  // If you want only one option, either description will work
```

- Set Budget:
  
```bash
  node index.js set-budget --month 'number-month' --amount 'Amount'

  // Without: --month: Give error!
```

- Update:

```bash
  node index.js update --id 'expense-id' --description 'New description' --amount 'New amount'

  /** Without:
    --id: Give error!
    --description and --amount: If only you want to update description or both, You can do it! 
  **/
```

- Delete:

```bash
  node index.js delete --id 'expense-id' // Without --id: give error
```

- List:

```bash
  node index.js list --category 'expense-category' // Without --category: only show all list
```

- Summary:

```bash
  node index.js summary --month 'number-month'  // Without --month: give error
```

- Export:

```bash
  node index.js export-expenses --output 'export-file' // Default: expenses.csv
```

