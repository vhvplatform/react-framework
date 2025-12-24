import React, { HTMLAttributes, forwardRef } from 'react';

/**
 * Card props
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card title
   */
  title?: string;

  /**
   * Card padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Shadow size
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Hoverable effect
   */
  hoverable?: boolean;

  /**
   * Children
   */
  children: React.ReactNode;
}

/**
 * Get padding classes
 */
function getPaddingClasses(padding: CardProps['padding']): string {
  const paddings: Record<NonNullable<CardProps['padding']>, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  return paddings[padding || 'md'];
}

/**
 * Get shadow classes
 */
function getShadowClasses(shadow: CardProps['shadow']): string {
  const shadows: Record<NonNullable<CardProps['shadow']>, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  return shadows[shadow || 'md'];
}

/**
 * Card component with Tailwind CSS styling
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      padding = 'md',
      shadow = 'md',
      hoverable = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const paddingClasses = getPaddingClasses(padding);
    const shadowClasses = getShadowClasses(shadow);
    const hoverClass = hoverable ? 'hover:shadow-lg transition-shadow' : '';

    const baseClasses = 'bg-white rounded-lg border border-gray-200';
    const classes = `${baseClasses} ${shadowClasses} ${hoverClass} ${className}`;

    return (
      <div ref={ref} className={classes} {...props}>
        {title && (
          <div className={`border-b border-gray-200 ${paddingClasses} font-semibold text-lg`}>
            {title}
          </div>
        )}
        <div className={title ? paddingClasses : paddingClasses}>{children}</div>
      </div>
    );
  }
);

Card.displayName = 'Card';
