import type { LocaleResource } from './types';

const fi: LocaleResource = {
  translation: {
    common: {
      done: 'Valmis',
    },
    home: {
      balance: 'Saldo',
    },
    transaction: {
      addIncome: 'Lisää tulo',
      addExpense: 'Lisää meno',
      enterAmount: 'Syötä summa',
      selectDate: 'Päivä',
      selectTime: 'Aika',
    },
    settings: {
      title: 'Asetukset',
      appearance: 'Ulkoasu',
      currency: 'Valuutta',
      language: 'Kieli',
    },
    currency: {
      title: 'Valuutta',
      eur: 'Euro (EUR)',
      usd: 'Yhdysvaltain dollari (USD)',
    },
    appearance: {
      title: 'Ulkoasu',
      black: 'Musta',
      light: 'Vaalea',
      dark: 'Tumma',
      black_yellow: 'Must Kultainen',
    },
    nav: {
      home: 'Koti',
      transactions: 'Tapahtumat',
      settings: 'Asetukset',
    },
    total: {
      income: 'Tulot',
      expense: 'Menot',
      allTime: 'kaikki ajat',
    },
    notFoundScreen: {
      header: 'Hups! Ei löytynyt!',
      mainMessage: 'Palaa kotisivulle',
    },
  },
};

export default fi;
