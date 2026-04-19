import type { LocaleResource } from './types';

const en: LocaleResource = {
  translation: {
    common: {
      done: 'Done',
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
