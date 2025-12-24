/**
 * Spinner props
 */
export interface SpinnerProps {
  /**
   * Spinner size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Spinner color
   */
  color?: 'primary' | 'secondary' | 'white' | 'gray';

  /**
   * Show text
   */
  text?: string;

  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * Get size classes
 */
function getSizeClasses(size: SpinnerProps['size']): string {
  const sizes: Record<NonNullable<SpinnerProps['size']>, string> = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  return sizes[size || 'md'];
}

/**
 * Get color classes
 */
function getColorClasses(color: SpinnerProps['color']): string {
  const colors: Record<NonNullable<SpinnerProps['color']>, string> = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };
  return colors[color || 'primary'];
}

/**
 * Spinner component with Tailwind CSS styling
 */
export function Spinner({ size = 'md', color = 'primary', text, className = '' }: SpinnerProps) {
  const sizeClasses = getSizeClasses(size);
  const colorClasses = getColorClasses(color);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses} ${colorClasses}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <p className={`mt-2 text-sm ${colorClasses}`}>{text}</p>}
    </div>
  );
}
