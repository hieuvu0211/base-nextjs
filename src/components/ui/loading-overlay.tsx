import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/tw-merge'

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  message?: string
  size?: 'sm' | 'md' | 'lg'
  blur?: boolean
}

export function LoadingOverlay({
  isLoading,
  children,
  message = 'Loading...',
  size = 'md',
  blur = true,
}: LoadingOverlayProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10',
            blur && 'bg-black/20'
          )}
        >
          <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
          {message && <p className="mt-4 text-sm text-gray-600 font-medium">{message}</p>}
        </div>
      )}
    </div>
  )
}

interface PageLoadingProps {
  message?: string
  progress?: number
}

export function PageLoading({ message = 'Loading...', progress }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-8 p-8">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-t-blue-600 rounded-full animate-spin absolute top-0"></div>
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
          <p className="text-gray-600">Please wait while we prepare your content</p>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Loading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Loading Dots */}
        <div className="flex space-x-2">
          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-sm text-gray-500">
        <p>This may take a few seconds</p>
      </div>
    </div>
  )
}

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
}

interface ButtonLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function ButtonLoading({
  isLoading,
  children,
  className,
  disabled,
  onClick,
}: ButtonLoadingProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
        (isLoading || disabled) && 'opacity-75 cursor-not-allowed',
        className
      )}
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      {isLoading && <Spinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}
