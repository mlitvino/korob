import type { LocaleResource } from './LocaleResource';

const ru: LocaleResource = {
  translation: {
    common: {
      done: 'Готово',
      cancel: 'Отмена',
      loading: 'Загрузка',
    },
    home: {
      balance: 'Баланс',
    },
    transaction: {
      addIncome: 'Добавить доход',
      addExpense: 'Добавить расход',
      enterAmount: 'Введите сумму',
      amount: 'Сумма',
      selectDate: 'Дата',
      selectTime: 'Время',
      selectCategory: 'Категория',
      filterAll: 'Все',
      saveFailed: 'Не удалось сохранить транзакцию',
    },
    category: {
      salary: 'Зарплата',
      freelance: 'Фриланс',
      gift: 'Подарок',
      investment: 'Инвестиции',
      food: 'Еда',
      transport: 'Транспорт',
      housing: 'Жильё',
      entertainment: 'Развлечения',
      shopping: 'Покупки',
      health: 'Здоровье',
      other: 'Другое',
    },
    settings: {
      title: 'Настройки',
      appearance: 'Оформление',
      currency: 'Валюта',
      language: 'Язык',
    },
    currency: {
      title: 'Валюта',
      eur: 'Евро (EUR)',
      usd: 'Доллар США (USD)',
    },
    appearance: {
      title: 'Оформление',
      black: 'Чёрная',
      light: 'Светлая',
      dark: 'Тёмная',
      black_yellow: 'Чёрно-жёлтая',
    },
    nav: {
      home: 'Главная',
      openMenu: 'Открыть меню',
      back: 'Назад',
      transactions: 'Транзакции',
      settings: 'Настройки',
    },
    total: {
      income: 'Доходы',
      expense: 'Расходы',
      allTime: 'за всё время',
    },
    notFoundScreen: {
      header: 'Ой! Не найдено!',
      mainMessage: 'Вернуться на главный экран',
    },
  },
};

export default ru;
