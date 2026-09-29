export type LocaleResource = {
  translation: {
    common: {
      done: string;
      cancel: string;
    };
    home: {
      balance: string;
    };
    transaction: {
      addIncome: string;
      addExpense: string;
      enterAmount: string;
      selectDate: string;
      selectTime: string;
      selectCategory: string;
      filterAll: string;
    };
    category: {
      salary: string;
      freelance: string;
      gift: string;
      investment: string;
      food: string;
      transport: string;
      housing: string;
      entertainment: string;
      shopping: string;
      health: string;
      other: string;
    };
    settings: {
      title: string;
      appearance: string;
      currency: string;
      language: string;
    };
    currency: {
      title: string;
      eur: string;
      usd: string;
    };
    appearance: {
      title: string;
      black: string;
      light: string;
      dark: string;
      black_yellow: string;
    };
    nav: {
      home: string;
      transactions: string;
      settings: string;
    };
    total: {
      income: string;
      expense: string;
      allTime: string;
    };
    notFoundScreen: {
      header: string;
      mainMessage: string;
    };
  };
};
