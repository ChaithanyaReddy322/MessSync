import React from 'react'
import { cn } from '../../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  gradient?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, gradient = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 shadow-card',
          {
            'hover:shadow-premium-hover hover:translate-y-[-2px]': hoverable,
            'bg-gradient-to-tr from-brand-light/30 to-white': gradient
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
export default Card
