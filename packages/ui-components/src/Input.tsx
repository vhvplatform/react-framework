import { InputHTMLAttributes, forwardRef } from 'react';

/**
 * Input props
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label
   */
  label?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Full width
   */
  fullWidth?: boolean;

  /**
   * Input size
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Get size classes
 */
function getSizeClasses(size: InputProps['size']): string {
  const sizes: Record<NonNullable<InputProps['size']>, string> = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };
  return sizes[size || 'md'];
}

/**
 * Input component with label and error handling
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      size = 'md',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const sizeClasses = getSizeClasses(size);
    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

    const baseClasses =
      'block rounded-md border focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed';

    const inputClasses = `${baseClasses} ${sizeClasses} ${widthClass} ${errorClass} ${className}`;

    return (
      <div className={widthClass}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input ref={ref} id={inputId} className={inputClasses} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
