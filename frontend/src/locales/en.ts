import type { LocaleResource } from './LocaleResource';

const en: LocaleResource = {
  translation: {
    common: {
      done: 'Done',
      cancel: 'Cancel',
    },
    home: {
      balance: 'Balance',
    },
    transaction: {
      addIncome: 'Add income',
      addExpense: 'Add expense',
      enterAmount: 'Enter amount',
      selectDate: 'Date',
      selectTime: 'Time',
      selectCategory: 'Category',
      filterAll: 'All',
    },
    category: {
      salary: 'Salary',
      freelance: 'Freelance',
      gift: 'Gift',
      investment: 'Investment',
      food: 'Food',
      transport: 'Transport',
      housing: 'Housing',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      health: 'Health',
      other: 'Other',
    },
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      currency: 'Currency',
      language: 'Language',
    },
    currency: {
      title: 'Currency',
      eur: 'Euro (EUR)',
      usd: 'US Dollar (USD)',
    },
    appearance: {
      title: 'Appearance',
      black: 'Black',
      light: 'Light',
      dark: 'Dark',
      black_yellow: 'Black Yellow',
    },
    nav: {
      home: 'Home',
      transactions: 'Transactions',
      settings: 'Settings',
    },
    total: {
      income: 'Income',
      expense: 'Expense',
      allTime: 'all-time',
    },
    notFoundScreen: {
      header: 'Oops! Not Found!',
      mainMessage: 'Go back to Home screen',
    },
  },
};

export default en;
