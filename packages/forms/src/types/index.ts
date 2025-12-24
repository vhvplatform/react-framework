/**
 * Field value type
 */
export type FieldValue = string | number | boolean | Date | null | undefined | File | File[];

/**
 * Validation rule function
 */
export type ValidationRule<T = any> = (value: T, formData?: Record<string, any>) => string | null | Promise<string | null>;

/**
 * Field configuration
 */
export interface FieldConfig<T = any> {
  /** Field name */
  name: string;
  
  /** Initial value */
  initialValue?: T;
  
  /** Validation rules */
  rules?: ValidationRule<T>[];
  
  /** Async validation */
  asyncValidation?: (value: T) => Promise<string | null>;
  
  /** Validate on change */
  validateOnChange?: boolean;
  
  /** Validate on blur */
  validateOnBlur?: boolean;
  
  /** Transform value before setting */
  transform?: (value: T) => T;
  
  /** Dependent fields (validate these when this changes) */
  dependents?: string[];
}

/**
 * Form configuration
 */
export interface FormConfig<T extends Record<string, any> = Record<string, any>> {
  /** Initial values */
  initialValues?: Partial<T>;
  
  /** Field configurations */
  fields?: Record<keyof T, FieldConfig>;
  
  /** Form-level validation */
  validate?: (values: Partial<T>) => Record<string, string> | Promise<Record<string, string>>;
  
  /** Submit handler */
  onSubmit?: (values: T) => void | Promise<void>;
  
  /** Reset after submit */
  resetOnSubmit?: boolean;
  
  /** Validate on change */
  validateOnChange?: boolean;
  
  /** Validate on blur */
  validateOnBlur?: boolean;
  
  /** Validate on mount */
  validateOnMount?: boolean;
}

/**
 * Field state
 */
export interface FieldState<T = any> {
  /** Current value */
  value: T;
  
  /** Error message */
  error: string | null;
  
  /** Touched state */
  touched: boolean;
  
  /** Dirty state (value changed) */
  dirty: boolean;
  
  /** Validating state */
  validating: boolean;
  
  /** Valid state */
  valid: boolean;
}

/**
 * Form state
 */
export interface FormState<T extends Record<string, any> = Record<string, any>> {
  /** Field values */
  values: Partial<T>;
  
  /** Field errors */
  errors: Partial<Record<keyof T, string>>;
  
  /** Touched fields */
  touched: Partial<Record<keyof T, boolean>>;
  
  /** Dirty state */
  dirty: boolean;
  
  /** Validating state */
  validating: boolean;
  
  /** Valid state */
  valid: boolean;
  
  /** Submitting state */
  submitting: boolean;
  
  /** Submit count */
  submitCount: number;
}

/**
 * Form actions
 */
export interface FormActions<T extends Record<string, any> = Record<string, any>> {
  /** Set field value */
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;
  
  /** Set multiple values */
  setValues: (values: Partial<T>) => void;
  
  /** Set field error */
  setError: <K extends keyof T>(name: K, error: string) => void;
  
  /** Set multiple errors */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  
  /** Set field touched */
  setTouched: <K extends keyof T>(name: K, touched: boolean) => void;
  
  /** Validate field */
  validateField: <K extends keyof T>(name: K) => Promise<boolean>;
  
  /** Validate form */
  validateForm: () => Promise<boolean>;
  
  /** Reset form */
  reset: (values?: Partial<T>) => void;
  
  /** Submit form */
  submit: () => Promise<void>;
  
  /** Get field props */
  getFieldProps: <K extends keyof T>(name: K) => {
    name: K;
    value: T[K];
    onChange: (value: T[K]) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
  
  /** Register field */
  register: <K extends keyof T>(name: K, config?: FieldConfig<T[K]>) => void;
  
  /** Unregister field */
  unregister: <K extends keyof T>(name: K) => void;
}

/**
 * Form hook return type
 */
export interface FormHook<T extends Record<string, any> = Record<string, any>>
  extends FormState<T>,
    FormActions<T> {}

/**
 * Validator function type
 */
export type Validator = <T = any>(params?: any) => ValidationRule<T>;

/**
 * Field type
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'color'
  | 'range';

/**
 * Form field component props
 */
export interface FormFieldProps<T = any> {
  /** Field name */
  name: string;
  
  /** Field label */
  label?: string;
  
  /** Field type */
  type?: FieldType;
  
  /** Placeholder */
  placeholder?: string;
  
  /** Required */
  required?: boolean;
  
  /** Disabled */
  disabled?: boolean;
  
  /** Help text */
  help?: string;
  
  /** Options for select/radio */
  options?: Array<{ label: string; value: any }>;
  
  /** Multiple (for select/file) */
  multiple?: boolean;
  
  /** Min value (for number/date) */
  min?: number | string;
  
  /** Max value (for number/date) */
  max?: number | string;
  
  /** Step (for number/range) */
  step?: number;
  
  /** Custom validation rules */
  rules?: ValidationRule<T>[];
  
  /** Custom render */
  render?: (props: any) => React.ReactNode;
}

/**
 * Form builder field definition
 */
export interface FormBuilderField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  rules?: ValidationRule[];
  colSpan?: number;
  visible?: boolean | ((values: any) => boolean);
}

/**
 * Form builder configuration
 */
export interface FormBuilderConfig {
  fields: FormBuilderField[];
  columns?: number;
  onSubmit: (values: any) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
}
