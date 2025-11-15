import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  customMessage?: string
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9),
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Here you would typically send error to an error reporting service
    // logErrorToService(error, errorInfo, this.state.errorId);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, errorId } = this.state
      const { customMessage, showDetails = process.env.NODE_ENV === 'development' } = this.props

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Error Header */}
              <div className="bg-red-600 px-6 py-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-white mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                    <p className="text-red-100">
                      {customMessage ||
                        'An unexpected error occurred while rendering this component'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Body */}
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Error Reference: {errorId}
                  </h2>
                  <p className="text-gray-600">
                    We apologize for the inconvenience. This error has been logged and our team will
                    look into it.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={this.handleReset}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </button>
                </div>

                {/* Error Details (Development Only) */}
                {showDetails && error && (
                  <details className="mt-6 border border-gray-200 rounded-lg">
                    <summary className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center">
                      <Bug className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Technical Details (Development Only)
                      </span>
                    </summary>
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Error Message:</h4>
                        <pre className="text-sm text-red-600 bg-red-50 p-3 rounded overflow-x-auto">
                          {error.toString()}
                        </pre>
                      </div>

                      {errorInfo && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            Component Stack:
                          </h4>
                          <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Stack Trace:</h4>
                        <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </div>
                    </div>
                  </details>
                )}

                {/* Contact Support */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">Need help?</h3>
                  <p className="text-sm text-blue-700">
                    If this problem persists, please contact our support team and reference error
                    ID: <strong>{errorId}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Simpler error boundary for specific components
interface SimpleErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  resetOnPropsChange?: boolean
}

export function SimpleErrorBoundary({ children, fallback }: SimpleErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-red-800">
                This component failed to load. Please try refreshing the page.
              </span>
            </div>
          </div>
        )
      }
      showDetails={false}
    >
      {children}
    </ErrorBoundary>
  )
}

// Async Error Boundary for handling promises and async operations
interface AsyncErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface AsyncErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error) => void
}

export class AsyncErrorBoundary extends Component<
  AsyncErrorBoundaryProps,
  AsyncErrorBoundaryState
> {
  constructor(props: AsyncErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): AsyncErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-6 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-red-900 mb-2">Operation Failed</h3>
              <p className="text-sm text-red-700 mb-3">
                {this.state.error?.message || 'An error occurred while processing your request'}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="text-sm text-red-800 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  return (error: Error) => {
    // You can integrate this with an error reporting service
    console.error('Error caught by error handler:', error)

    // In production, you might want to:
    // - Send to error reporting service (Sentry, Bugsnag, etc.)
    // - Show a toast notification
    // - Log to analytics
  }
}
