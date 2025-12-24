/**
 * Validation utility functions
 */

import { VALIDATION } from '../constants';

export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

export function isValidPassword(password: string): boolean {
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) return false;
  return VALIDATION.PASSWORD_REGEX.test(password);
}

export function isValidUsername(username: string): boolean {
  if (username.length < VALIDATION.USERNAME_MIN_LENGTH || username.length > VALIDATION.USERNAME_MAX_LENGTH) return false;
  return VALIDATION.USERNAME_REGEX.test(username);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}

export function maxLength(value: string, max: number): boolean {
  return value.length <= max;
}

export function getPasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  
  let level: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'medium';
  else if (score <= 5) level = 'strong';
  else level = 'very-strong';
  
  return { score, level };
}
