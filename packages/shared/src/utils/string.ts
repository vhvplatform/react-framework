/**
 * String utility functions
 */

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toTitleCase(str: string): string {
  if (!str) return '';
  return str.split(' ').map((word) => capitalize(word)).join(' ');
}

export function toKebabCase(str: string): string {
  if (!str) return '';
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
}

export function toCamelCase(str: string): string {
  if (!str) return '';
  return str.replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : '')).replace(/^(.)/, (char) => char.toLowerCase());
}

export function toSnakeCase(str: string): string {
  if (!str) return '';
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
}

export function truncate(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function randomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function pluralize(word: string, count: number): string {
  if (count === 1) return word;
  if (word.endsWith('y')) return word.slice(0, -1) + 'ies';
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) return word + 'es';
  return word + 's';
}

export function getInitials(name: string): string {
  if (!name) return '';
  return name.split(' ').map((part) => part.charAt(0).toUpperCase()).join('').slice(0, 2);
}
