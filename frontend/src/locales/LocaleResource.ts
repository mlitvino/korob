export type LocaleResource = {
  translation: {
    common: {
      done: string;
      cancel: string;
      loading: string;
    };
    home: {
      balance: string;
    };
    transaction: {
      addIncome: string;
      addExpense: string;
      enterAmount: string;
      amountRequired: string;
      amount: string;
      selectDate: string;
      selectTime: string;
      comment: string;
      commentPlaceholder: string;
      save: string;
      selectCategory: string;
      noCategories: string;
      filterAll: string;
      delete: string;
      deleteTitle: string;
      deleteMessage: string;
      deleteFailed: string;
      select: string;
      selectHint: string;
      selectedCount: string;
      selectAll: string;
      deselectAll: string;
      cancelSelection: string;
      deleteSelected: string;
      deleteSelectedTitle: string;
      saveFailed: string;
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
      categories: string;
      appearance: string;
      currency: string;
      language: string;
    };
    categories: {
      add: string;
      newTitle: string;
      editTitle: string;
      name: string;
      save: string;
      delete: string;
      deleteLabel: string;
      deleteTitle: string;
      deleteMessage: string;
      errorEmpty: string;
      errorDuplicate: string;
      saveFailed: string;
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
      openMenu: string;
      back: string;
      transactions: string;
      updates: string;
      updatesNew: string;
      settings: string;
    };
    total: {
      income: string;
      expense: string;
      allTime: string;
    };
    startupError: {
      title: string;
      message: string;
      retry: string;
    };
    notFoundScreen: {
      header: string;
      mainMessage: string;
    };
  };
};
