import { ValidationRule } from '../types';

export const validators = {
  required: (message = 'This field is required'): ValidationRule => {
    return (value) => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      return null;
    };
  },

  email: (message = 'Invalid email address'): ValidationRule<string> => {
    return (value) => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : message;
    };
  },

  minLength: (min: number, message?: string): ValidationRule<string> => {
    return (value) => {
      if (!value) return null;
      return value.length >= min ? null : message || `Minimum ${min} characters`;
    };
  },

  maxLength: (max: number, message?: string): ValidationRule<string> => {
    return (value) => {
      if (!value) return null;
      return value.length <= max ? null : message || `Maximum ${max} characters`;
    };
  },

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule<string> => {
    return (value) => {
      if (!value) return null;
      return regex.test(value) ? null : message;
    };
  },

  min: (min: number, message?: string): ValidationRule<number> => {
    return (value) => {
      if (value === null || value === undefined) return null;
      return value >= min ? null : message || `Minimum value is ${min}`;
    };
  },

  max: (max: number, message?: string): ValidationRule<number> => {
    return (value) => {
      if (value === null || value === undefined) return null;
      return value <= max ? null : message || `Maximum value is ${max}`;
    };
  },
};
