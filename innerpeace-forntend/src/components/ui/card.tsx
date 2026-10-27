import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-ink/8 bg-cream/80 p-6 shadow-card transition-shadow duration-normal', className)}
      {...props}
    />
  );
}

