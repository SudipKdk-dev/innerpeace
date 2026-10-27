import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-normal ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cocoa/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<string, string> = {
  primary: 'bg-ink text-cream hover:bg-ink/90 shadow-md hover:shadow-lg active:scale-[0.98]',
  secondary: 'bg-sand text-ink hover:bg-sand/80 active:scale-[0.98]',
  ghost: 'bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5',
  outline: 'border border-ink/20 bg-transparent text-ink hover:bg-ink/5 hover:border-ink/30',
};

const sizes = {
  default: 'px-5 py-2.5 text-sm',
  sm: 'px-3.5 py-1.5 text-xs',
  lg: 'px-8 py-3.5 text-base',
  icon: 'h-10 w-10 p-0',
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  to?: string;
};

export function Button({ variant = 'primary', size = 'default', className, to, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        {props.children}
      </Link>
    );
  }

  return <button className={classes} {...props} />;
}

