import React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-ink/10 bg-cream/60 px-4 py-3 text-sm text-ink outline-none transition-all duration-normal ease-out-expo placeholder:text-ink/40 focus:border-cocoa/40 focus:bg-cream/80 focus:shadow-sm focus:ring-2 focus:ring-cocoa/10',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

