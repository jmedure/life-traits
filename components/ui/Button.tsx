'use client';

import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'default';
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        variant === 'default' && 'bg-black text-white hover:bg-black/90',
        variant === 'ghost' && 'text-black hover:bg-black/[0.06]',
        size === 'sm' && 'text-xs px-2 py-1',
        size === 'default' && 'h-9 px-4 py-2 text-sm',
        className
      )}
      {...props}
    />
  );
}