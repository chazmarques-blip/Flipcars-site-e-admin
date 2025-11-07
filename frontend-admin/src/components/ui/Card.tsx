import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white shadow-sm border border-gray-200',
  elevated: 'bg-white shadow-md border border-gray-200',
  bordered: 'bg-white border border-gray-300',
  interactive: 'bg-white shadow-sm border border-gray-200 hover:shadow-md hover:border-gold/30 cursor-pointer',
};

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  variant = 'default',
  padding = 'md',
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg transition-shadow duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={clsx('flex items-start justify-between mb-4', className)}
      {...props}
    >
      <div className="flex-1">
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={clsx('text-gray-800 text-sm', className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={clsx('flex items-center gap-3 mt-4 pt-4 border-t border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}
