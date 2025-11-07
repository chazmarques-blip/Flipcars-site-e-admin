import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-800 text-gray-300 border border-gray-700',
  primary: 'bg-gold/20 text-gold border border-gold/30',
  secondary: 'bg-gray-900 text-gray-400 border border-gray-800',
  success: 'bg-green-900/30 text-green-400 border border-green-700/50',
  warning: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50',
  danger: 'bg-red-900/30 text-red-400 border border-red-700/50',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs font-medium',
  md: 'px-2 py-0.5 text-xs font-medium',
  lg: 'px-2.5 py-1 text-sm font-medium',
};

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  primary: 'bg-gold',
  secondary: 'bg-gray-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  dot = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx('w-2 h-2 rounded-full', dotStyles[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
