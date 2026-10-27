import React from 'react';
import { cn } from '@/lib/utils';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full rounded-2xl border border-ink/10 bg-cream/70 px-4 py-2 text-sm outline-none transition focus:border-cocoa/60',
          className
        )}
        {...props}
      />
    );
  }
);

Select.displayName = 'Select';
