import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const statusPillVariants = cva(
  'inline-flex items-center gap-1.5 border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        success: 'border-success/30 bg-success/10 text-success',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        danger: 'border-destructive/30 bg-destructive/10 text-destructive',
        info: 'border-info/30 bg-info/10 text-info',
        neutral: 'border-border bg-secondary text-muted-foreground',
      },
      size: {
        sm: 'h-5 text-[11px]',
        md: 'h-6 text-xs',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {
  dot?: boolean;
}

export function StatusPill({
  variant,
  size,
  dot = true,
  className,
  children,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn(statusPillVariants({ variant, size }), 'rounded-sm', className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'danger' && 'bg-destructive',
            variant === 'info' && 'bg-info',
            variant === 'neutral' && 'bg-muted-foreground'
          )}
        />
      )}
      {children}
    </span>
  );
}
