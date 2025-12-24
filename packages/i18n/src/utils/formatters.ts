import { Language } from '../types';

export function formatDate(date: Date, language: Language): string {
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  return new Intl.DateTimeFormat(locale).format(date);
}

export function formatCurrency(amount: number, language: Language): string {
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(amount);
}
