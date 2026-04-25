export type LocaleResource = {
  translation: {
    common: {
      done: string;
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
      filterAll: string;
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
