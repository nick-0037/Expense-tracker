const fs = require('fs')
const { Command } = require('commander')
const path = require('path')

const program = new Command()
const filePath = path.join(__dirname, 'expenses.json')

const loadExpenses = () => JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]')
const saveExpenses = (data) => fs.writeFileSync(filePath, JSON.stringify(data))

program
  .command('add')
  .description('Add a new expense')
  .option('--description <description>', 'Description of the expense')
  .option('--amount <amount>', 'Amount of the expense')
  .action((options) => {
    const expenses = loadExpenses()
    const newExpense = {
      id: expenses.length + 1,
      date: new Date().toISOString().slice(0, 10),
      description: options.description,
      amount: parseFloat(options.amount)
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
    let expenses = loadExpenses()
    const initialLength = expenses.length
    expenses = expenses.filter(e => e.id !== options.id)

    if(expenses.length < initialLength) {
      saveExpenses(expenses)
      console.log(`Expense with ID: ${options.id} deleted successfully`)
    } else {
      console.log(`Expense With ID: ${options.id} not found`)
    }
  })

program
  .command('list')
  .option('List all expenses')
  .action(() => {
    const expenses = loadExpenses()
    console.log('ID\tDate\t\tDescription\tAmount')
    expenses.forEach(e => {
      console.log(`${e.id}\t${e.date}\t${e.description}\t\t${e.amount}`)
    });
  })

program
  .command('summary')
  .description('Show total expenses')
  .option('--month <month>', 'Filter by month (1-12)')
  .action((options) => {
    const expenses = loadExpenses()
    let filteredExpenses = expenses

    if(options.month) {
      const month = parseInt(options.month, 10)
      filteredExpenses = expenses.filter(e => new Date(e.date).getMonth() + 1 === month)

      console.log(`Total expenses for ${new Date(0, month - 1).toLocaleString('default', { month: 'long'})}: $${filteredExpenses.reduce((sum, e) => sum + e.amount, 0)}`)
    } else {
      console.log(`Total expenses: $${filteredExpenses.reduce((sum, e) => sum + e.amount, 0)}`);
    }
  })


program.parse(process.argv)