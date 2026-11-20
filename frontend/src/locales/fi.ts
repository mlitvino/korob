import type { LocaleResource } from './LocaleResource';

const fi: LocaleResource = {
  translation: {
    common: {
      done: 'Valmis',
      cancel: 'Peruuta',
      loading: 'Ladataan',
    },
    home: {
      balance: 'Saldo',
    },
    transaction: {
      addIncome: 'Lisää tulo',
      addExpense: 'Lisää meno',
      enterAmount: 'Syötä summa',
      amount: 'Summa',
      selectDate: 'Päivä',
      selectTime: 'Aika',
      selectCategory: 'Kategoria',
      noCategories: 'Ei kategorioita',
      filterAll: 'Kaikki',
      delete: 'Poista',
      deleteTitle: 'Poistetaanko tapahtuma?',
      deleteMessage: 'Tätä ei voi perua.',
      deleteFailed: 'Tapahtuman poisto epäonnistui',
      saveFailed: 'Tapahtuman tallennus epäonnistui',
    },
    category: {
      salary: 'Palkka',
      freelance: 'Freelance',
      gift: 'Lahja',
      investment: 'Sijoitus',
      food: 'Ruoka',
      transport: 'Liikenne',
      housing: 'Asuminen',
      entertainment: 'Viihde',
      shopping: 'Ostokset',
      health: 'Terveys',
      other: 'Muu',
    },
    settings: {
      title: 'Asetukset',
      categories: 'Kategoriat',
      appearance: 'Ulkoasu',
      currency: 'Valuutta',
      language: 'Kieli',
    },
    categories: {
      add: 'Lisää kategoria',
      newTitle: 'Uusi kategoria',
      editTitle: 'Muokkaa kategoriaa',
      name: 'Nimi',
      save: 'Tallenna',
      delete: 'Poista',
      deleteLabel: 'Poista {{name}}',
      deleteTitle: 'Poistetaanko ”{{name}}”?',
      deleteMessage: 'Aiemmat tapahtumat säilyttävät nimen.',
      errorEmpty: 'Anna nimi',
      errorDuplicate: 'Samanniminen kategoria on jo olemassa',
      saveFailed: 'Kategorian tallennus epäonnistui',
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
      black_yellow: 'Musta-keltainen',
    },
    nav: {
      home: 'Koti',
      openMenu: 'Avaa valikko',
      back: 'Takaisin',
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
