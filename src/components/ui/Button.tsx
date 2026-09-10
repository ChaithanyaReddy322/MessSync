import React from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'brand'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          {
            // Variants
            'bg-brand hover:bg-brand-hover text-white shadow-sm': variant === 'brand',
            'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm': variant === 'primary',
            'bg-slate-100 hover:bg-slate-200 text-slate-800': variant === 'secondary',
            'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700': variant === 'outline',
            'hover:bg-slate-50 text-slate-600': variant === 'ghost',
            'bg-red-500 hover:bg-red-600 text-white shadow-sm': variant === 'danger',
            
            // Sizes
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-5 py-2.5 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon'
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
