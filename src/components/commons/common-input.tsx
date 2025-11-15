'use client'

import { ReactNode, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Search, Eye, EyeOff } from 'lucide-react'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' | 'date' | 'time'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  showPasswordToggle?: boolean
  showSearchIcon?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      placeholder,
      error,
      hint,
      disabled = false,
      required = false,
      fullWidth = false,
      size = 'md',
      variant = 'default',
      leftIcon,
      rightIcon,
      showPasswordToggle = true,
      showSearchIcon = true,
      className,
      labelClassName,
      inputClassName,
      containerClassName,
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    // Determine actual input type
    const inputType = type === 'password' && showPassword ? 'text' : type

    // Size styles
    const sizeStyles = {
      sm: {
        input: 'h-8 px-3 py-1.5 text-xs',
        label: 'text-xs mb-1',
        iconSize: 16,
      },
      md: {
        input: 'h-11 px-4 py-3 text-sm',
        label: 'text-sm mb-1.5',
        iconSize: 18,
      },
      lg: {
        input: 'h-12 px-5 py-3.5 text-base',
        label: 'text-base mb-2',
        iconSize: 20,
      },
    }

    // Variant styles
    const variantStyles = {
      default: {
        container: 'bg-white border border-gray-300',
        input: 'bg-transparent',
        focus: 'ring-2 ring-blue-500 border-transparent',
        error: 'border-red-500 ring-2 ring-red-500/20',
      },
      filled: {
        container: 'bg-gray-100 border border-transparent',
        input: 'bg-transparent',
        focus: 'ring-2 ring-blue-500 border-blue-500',
        error: 'border-red-500 ring-2 ring-red-500/20',
      },
      outlined: {
        container: 'bg-transparent border-2 border-gray-300',
        input: 'bg-transparent',
        focus: 'border-blue-500 ring-0',
        error: 'border-red-500',
      },
    }

    // Base styles
    const baseInputStyles = cn(
      'w-full font-medium transition-all duration-200 focus:outline-none',
      'text-gray-900 placeholder:text-gray-500',
      'disabled:cursor-not-allowed disabled:opacity-60',
      sizeStyles[size].input,
      variantStyles[variant].input
    )

    const containerStyles = cn(
      'relative flex items-center rounded transition-all duration-200',
      variantStyles[variant].container,
      isFocused && !error && variantStyles[variant].focus,
      error && variantStyles[variant].error,
      disabled && 'opacity-60 cursor-not-allowed',
      fullWidth && 'w-full',
      containerClassName
    )

    const labelStyles = cn(
      'block font-medium text-gray-700',
      sizeStyles[size].label,
      disabled && 'text-gray-500',
      error && 'text-red-600',
      labelClassName
    )

    // Main wrapper styles
    const wrapperStyles = cn(
      'flex flex-col transition-all duration-300 ease-out',
      fullWidth && 'w-full',
      className
    )

    // Icon components using Lucide React
    const SearchIcon = () => <Search size={sizeStyles[size].iconSize} className="text-gray-400" />

    const EyeIcon = ({ show }: { show: boolean }) => {
      const IconComponent = show ? Eye : EyeOff
      return (
        <IconComponent size={sizeStyles[size].iconSize} className="text-gray-400 cursor-pointer" />
      )
    }

    // Determine which icons to show
    const showLeftIcon = leftIcon || (type === 'search' && showSearchIcon)
    const showRightIcon =
      rightIcon ||
      (type === 'password' && showPasswordToggle) ||
      (type === 'search' && showSearchIcon && !leftIcon)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    return (
      <div className={wrapperStyles}>
        {/* Label */}
        {label && (
          <label htmlFor={props.id} className={labelStyles}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className={containerStyles}>
          {/* Left Icon */}
          {showLeftIcon && (
            <div className="flex items-center justify-center pl-3">
              {leftIcon || (type === 'search' && <SearchIcon />)}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              baseInputStyles,
              showLeftIcon && 'pl-0',
              showRightIcon && 'pr-0',
              inputClassName
            )}
            {...props}
          />

          {/* Right Icon */}
          {showRightIcon && (
            <div className="flex items-center justify-center pr-3">
              {type === 'password' && showPasswordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon show={showPassword} />
                </button>
              ) : type === 'search' && showSearchIcon && !leftIcon ? (
                <SearchIcon />
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>

        {/* Message Container */}
        {(error || hint) && (
          <div className="mt-1">
            {/* Error Message */}
            {error && <p className="text-red-600 text-xs leading-tight">{error}</p>}

            {/* Hint Message */}
            {hint && !error && <p className="text-gray-500 text-xs leading-tight">{hint}</p>}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
