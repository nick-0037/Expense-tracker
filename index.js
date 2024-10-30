const fs = require('fs')
const { Command } = require('commander')
const path = require('path')

const program = new Command()
const filePath = path.join(__dirname, 'expenses.json')
const budgetFilePath = path.join(__dirname, 'budget.json')

const loadExpenses = () => JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]')
const saveExpenses = (data) => fs.writeFileSync(filePath, JSON.stringify(data))

const loadBudget = () => JSON.parse(fs.readFileSync(budgetFilePath, 'utf-8') || '{}')
const saveBudget = (data) => fs.writeFileSync(budgetFilePath, JSON.stringify(data)) 

program
  .command('set-budget')
  .description('Set a monthly budget')
  .option('--month <month>', 'Month for the budget (1-12)')
  .option('--amount <amount>', 'Amount of the budget')
  .action((options) => {
    const expenses = loadExpenses()
    const budget = loadBudget()
    let filteredExpenses = expenses

    if(options.month) {
      const month = parseInt(options.month, 10)
      const amount = parseFloat(options.amount)

      if(isNaN(month) || amount < 0) {
        console.error('Please enter a valid, positive amount')
        return
      }

      filteredExpenses = filteredExpenses.filter(e => new Date(e.date).getMonth() + 1 === options.month)
      const totalExpensesForMonth = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
      
      budget[month] = amount
      saveBudget(budget)
      console.log(`Budget set for month ${month}: $${amount}`);

      if(totalExpensesForMonth > amount) {
        console.warn(`Warning: Current expenses ($${totalExpensesForMonth}) exceed the budget of $${amount} for month ${month}`)
      }
    }
  })

program
  .command('add')
  .description('Add a new expense')
  .option('--description <description>', 'Description of the expense')
  .option('--amount <amount>', 'Amount of the expense')
  .option('--category <category>', 'Category of the expense')
  .action((options) => {
    const amount = parseFloat(options.amount)

    if(isNaN(amount) || amount <= 0) {
      console.error('Error: The amount must be a positive number')
      return
    }

    

    const expenses = loadExpenses()
    const newExpense = {
      id: expenses.length + 1,
      date: new Date().toISOString().slice(0, 10),
      description: options.description,
      amount: parseFloat(options.amount),
      category: options.category || 'Uncategorized'
    }

    expenses.push(newExpense)
    saveExpenses(expenses)
    console.log(`Expenses added successfully (ID: ${newExpense.id})`)
  })

program
  .command('update')
  .description('Update an exiting expense')
  .option('--id <id>', 'ID of the expense to update')
  .option('--description <description>', 'New description')
  .option('--amount <amount>', 'New amount')
  .action((options) => {
    const expenses = loadExpenses()
    const expense = expenses.find(e => e.id === parseInt(options.id))

    if(expense) {
      if(options.description) expense.description = options.description
      if(options.amount) expense.amount = options.description
      saveExpenses(expenses)
      console.log(`Expense with ID: ${options.id} updated successfully`)
    } else {
      console.log(`Expense with ID: ${options.id} not found`)
    }
  })

program
  .command('delete')
  .description('Delete an existing expense')
  .option('--id <id>', 'ID of the expense to delete')
  .action((options) => {
    const expenseId = parent(options.id, 10)
    if(isNaN(expenseId) || expenseId <= 0) {
      console.log('Error: Invalid expense ID.')
    }

    let expenses = loadExpenses()
    const initialLength = expenses.length
    expenses = expenses.filter(e => e.id !== options.id)

    if(expenses.length < initialLength) {
      saveExpenses(expenses)
      console.log(`Expense with ID: ${options.id} deleted successfully`)
    }
  })

program
  .command('list')
  .description('List all expenses')
  .option('--category <category>', 'Filter by category')
  .action((options) => {
    let expenses = loadExpenses()

    if(options.category) {
      expenses = expenses.filter(e => e.category === options.category)
    }
    console.log('ID\tDate\t\tDescription\tAmount')
    expenses.forEach(e => {
      console.log(`${e.id}\t${e.date}\t${e.description}\t\t${e.amount}\t${e.category}`)
    });
  })

program
  .command('summary')
  .description('Show total expenses')
  .option('--month <month>', 'Filter by month (1-12)')
  .action((options) => {
    const month = parseInt(options.month, 10)
    if (options.month && (isNaN(month) || month < 1 || month > 12)) {
      console.error('Error: The month must be a number between 1 and 12.');
      return;
    }
    
    const expenses = loadExpenses()
    let filteredExpenses = expenses
    
    if(options.month) {
      filteredExpenses = expenses.filter(e => new Date(e.date).getMonth() + 1 === month)
    }

    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    console.log(`Total expenses${options.month ? ` for ${new Date(0, month - 1).toLocaleString('default', { month: 'long' })}` : ''}: $${total}`)
  })


program.parse(process.argv)