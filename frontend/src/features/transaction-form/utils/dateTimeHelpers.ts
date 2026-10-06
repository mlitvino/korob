export function formatDateInput(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function uses12HourClock(language: string) {
  return language.startsWith('en');
}

export function formatTimeInput(date: Date, use12Hours: boolean) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (!use12Hours) {
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  const period = hours < 12 ? 'AM' : 'PM';
  return `${String(hours % 12 || 12).padStart(2, '0')}:${minutes} ${period}`;
}
