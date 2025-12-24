import { useState, useCallback } from 'react';
import { FormMode } from '../types';

/**
 * Hook for managing CRUD form state
 */
export function useCrudForm<T>(initialData?: T) {
  const [mode, setMode] = useState<FormMode>('create');
  const [data, setData] = useState<Partial<T>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  // Set field touched
  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [field as string]: isTouched }));
  }, []);

  // Set field error
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field as string]: error }));
  }, []);

  // Validate field
  const validateField = useCallback(
    (field: keyof T, value: any, rules?: ValidationRule[]): string | null => {
      if (!rules) return null;

      for (const rule of rules) {
        const error = rule.validator(value);
        if (error) {
          return error;
        }
      }

      return null;
    },
    []
  );

  // Reset form
  const reset = useCallback((newData?: Partial<T>) => {
    setData(newData || initialData || {});
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialData]);

  // Set form mode
  const setFormMode = useCallback((newMode: FormMode) => {
    setMode(newMode);
  }, []);

  // Load data for editing
  const loadData = useCallback((item: T) => {
    setData(item);
    setMode('edit');
    setErrors({});
    setTouched({});
  }, []);

  // Check if form has errors
  const hasErrors = Object.keys(errors).length > 0;

  // Check if form is dirty
  const isDirty = JSON.stringify(data) !== JSON.stringify(initialData || {});

  return {
    mode,
    data,
    errors,
    touched,
    isSubmitting,
    hasErrors,
    isDirty,
    setValue,
    setFieldTouched,
    setFieldError,
    validateField,
    setIsSubmitting,
    reset,
    setFormMode,
    loadData,
  };
}

/**
 * Validation rule
 */
export interface ValidationRule {
  validator: (value: any) => string | null;
  message?: string;
}

/**
 * Common validation rules
 */
export const validators = {
  required: (message = 'This field is required'): ValidationRule => ({
    validator: (value) => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      return null;
    },
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (typeof value === 'string' && value.length < min) {
        return message || `Minimum ${min} characters required`;
      }
      return null;
    },
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (typeof value === 'string' && value.length > max) {
        return message || `Maximum ${max} characters allowed`;
      }
      return null;
    },
  }),

  email: (message = 'Invalid email address'): ValidationRule => ({
    validator: (value) => {
      if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message;
      }
      return null;
    },
  }),

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    validator: (value) => {
      if (typeof value === 'string' && !regex.test(value)) {
        return message;
      }
      return null;
    },
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (typeof value === 'number' && value < min) {
        return message || `Minimum value is ${min}`;
      }
      return null;
    },
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (typeof value === 'number' && value > max) {
        return message || `Maximum value is ${max}`;
      }
      return null;
    },
  }),

  custom: (validator: (value: any) => boolean, message: string): ValidationRule => ({
    validator: (value) => {
      if (!validator(value)) {
        return message;
      }
      return null;
    },
  }),
};
