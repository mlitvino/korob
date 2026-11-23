// Add a release here before each `eas update` that adds a feature (newest first).
// Entries are Russian only, whatever the app language; no bug fixes.

export type Release = {
  id: string;
  date: string;
  features: { title: string; howTo: string }[];
};

export const CHANGELOG: Release[] = [
  {
    id: '2026-11-23',
    date: '2026-11-23',
    features: [
      {
        title: 'Удаление нескольких транзакций',
        howTo: 'Удерживайте строку в списке, отметьте нужные транзакции и нажмите корзину. ' +
          '«Выбрать все» отмечает весь список.',
      },
      {
        title: 'Комментарий к транзакции',
        howTo: 'Добавьте комментарий в форме новой транзакции. ' +
          'Нажмите на транзакцию в списке, чтобы увидеть или изменить его.',
      },
    ],
  },
];
