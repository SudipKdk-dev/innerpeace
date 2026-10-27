import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'border-ink/10 bg-sand/70 text-ink/70',
  secondary: 'border-ink/5 bg-ink/5 text-ink/60',
  success: 'border-green-200 bg-green-100 text-green-700',
  warning: 'border-amber-200 bg-amber-100 text-amber-700',
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
