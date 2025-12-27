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

export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + suffix;
}

export function randomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function pluralize(word: string, count: number, customPlural?: string): string {
  if (count === 1) return word;
  if (customPlural) return customPlural;
  if (word.endsWith('y')) return word.slice(0, -1) + 'ies';
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) return word + 'es';
  return word + 's';
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(part => part.length > 0);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  // Return first and last initial
  return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
}
