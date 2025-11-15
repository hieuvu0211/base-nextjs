'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'relative cursor-pointer inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:cursor-not-allowed overflow-hidden'

    // Variant styles
    const variantStyles = {
      primary: {
        default: 'bg-blue-600 text-white hover:bg-blue-700 border border-transparent shadow-sm',
        disabled: 'bg-gray-400 text-gray-100 cursor-not-allowed shadow-sm',
        loading: 'bg-blue-500 text-gray-200 shadow-sm',
      },
      secondary: {
        default:
          'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 hover:border-gray-400',
        disabled: 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed',
        loading: 'bg-gray-100 !text-gray-400 border-gray-300',
      },
      outline: {
        default:
          'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 hover:border-blue-700',
        disabled: 'bg-transparent text-gray-500 border-gray-300 cursor-not-allowed',
        loading: 'bg-transparent !text-gray-400 border-gray-300',
      },
      ghost: {
        default: 'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100',
        disabled: 'bg-transparent text-gray-400 cursor-not-allowed',
        loading: 'bg-transparent !text-gray-400',
      },
    }

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm h-8 rounded',
      md: 'px-4 py-2 text-sm h-10 rounded-md',
      lg: 'px-6 py-3 text-base h-12 rounded-lg',
    }

    // Get current variant styles
    const currentVariant = disabled
      ? variantStyles[variant].disabled
      : loading
        ? variantStyles[variant].loading
        : variantStyles[variant].default

    // Combine all styles
    const buttonClasses = cn(
      baseStyles,
      currentVariant,
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    )

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return
      onClick?.(e)
    }

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {/* Content container */}
        <div className={cn('flex items-center justify-center gap-2', loading && 'opacity-0')}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
