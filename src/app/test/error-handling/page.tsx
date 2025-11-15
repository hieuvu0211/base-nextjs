/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState } from 'react'
import {
  ErrorBoundary,
  SimpleErrorBoundary,
  AsyncErrorBoundary,
  useErrorHandler,
} from '@/components/ui/error-boundary'
import { Button } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Bug, RefreshCw, Zap, FileText, Database } from 'lucide-react'

// Component that throws an error
function ProblematicComponent({ shouldError }: { shouldError: boolean }) {
  if (shouldError) {
    throw new Error('This is a simulated component error!')
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-800 font-medium">Component is working fine!</h3>
      <p className="text-green-600 text-sm mt-1">
        This component loads successfully when there's no error.
      </p>
    </div>
  )
}

// Component with async error
function AsyncProblematicComponent({ shouldError }: { shouldError: boolean }) {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Simulate API call that might fail
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (shouldError) {
        throw new Error('Async operation failed: Network error occurred')
      }

      setData('Data loaded successfully!')
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={fetchData} disabled={loading}>
        {loading ? (
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Database className="w-4 h-4 mr-2" />
        )}
        {loading ? 'Loading...' : 'Load Data'}
      </Button>

      {data && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">{data}</p>
        </div>
      )}
    </div>
  )
}

// Component that triggers different types of errors
function ErrorTriggerButtons({ onTriggerError }: { onTriggerError: (type: string) => void }) {
  const triggers = [
    { type: 'render', label: 'Trigger Render Error', icon: AlertTriangle, color: 'red' },
    { type: 'async', label: 'Trigger Async Error', icon: Zap, color: 'yellow' },
    { type: 'network', label: 'Trigger Network Error', icon: Database, color: 'blue' },
    { type: 'validation', label: 'Trigger Validation Error', icon: FileText, color: 'purple' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {triggers.map(({ type, label, icon: Icon, color }) => (
        <Button
          key={type}
          variant="outline"
          onClick={() => onTriggerError(type)}
          className={`flex items-center justify-start border-${color}-300 text-${color}-700 hover:bg-${color}-50`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  )
}

function CustomErrorFallback() {
  return (
    <div className="p-6 border-2 border-purple-300 rounded-lg bg-purple-50">
      <div className="flex items-center">
        <Bug className="w-8 h-8 text-purple-600 mr-3" />
        <div>
          <h3 className="text-lg font-bold text-purple-900">Custom Error Boundary</h3>
          <p className="text-purple-700">This is a custom fallback UI for errors.</p>
        </div>
      </div>
      <Button
        onClick={() => window.location.reload()}
        className="mt-4 bg-purple-600 hover:bg-purple-700"
      >
        Reload Application
      </Button>
    </div>
  )
}

export default function ErrorHandlingPage() {
  const [shouldError1, setShouldError1] = useState(false)
  const [shouldError2, setShouldError2] = useState(false)
  const [shouldError3, setShouldError3] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const handleError = useErrorHandler()

  const triggerError = (type: string) => {
    setErrorCount((prev) => prev + 1)

    switch (type) {
      case 'render':
        setShouldError1(true)
        setTimeout(() => setShouldError1(false), 100)
        break
      case 'async':
        setShouldError2(true)
        break
      case 'network':
        handleError(new Error('Network request failed: Unable to connect to server'))
        break
      case 'validation':
        alert('Validation Error: Required fields are missing')
        break
    }
  }

  const resetAll = () => {
    setShouldError1(false)
    setShouldError2(false)
    setShouldError3(false)
    setErrorCount(0)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Error Handling & Boundaries</h1>
          <p className="mt-2 text-gray-600">
            Demonstration of React Error Boundaries and various error handling patterns
          </p>
        </div>

        {/* Error Statistics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Error Statistics</CardTitle>
            <CardDescription>Track errors during this session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-gray-600">Total Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {3 - [shouldError1, shouldError2, shouldError3].filter(Boolean).length}
                </div>
                <div className="text-sm text-gray-600">Working Components</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {[shouldError1, shouldError2, shouldError3].filter(Boolean).length}
                </div>
                <div className="text-sm text-gray-600">Failed Components</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Trigger Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Error Triggers</CardTitle>
            <CardDescription>Click buttons to trigger different types of errors</CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorTriggerButtons onTriggerError={triggerError} />
            <div className="mt-6 flex justify-end">
              <Button onClick={resetAll} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All Errors
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Error Boundary */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Error Boundary</CardTitle>
              <CardDescription>
                Standard error boundary with full error page fallback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <ProblematicComponent shouldError={shouldError1} />
              </ErrorBoundary>
              <div className="mt-4">
                <Button
                  onClick={() => setShouldError1(!shouldError1)}
                  variant={shouldError1 ? 'destructive' : 'default'}
                  size="sm"
                >
                  {shouldError1 ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Error Active
                    </>
                  ) : (
                    'Toggle Error'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Simple Error Boundary */}
          <Card>
            <CardHeader>
              <CardTitle>Simple Error Boundary</CardTitle>
              <CardDescription>Minimal error boundary with inline fallback UI</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleErrorBoundary>
                <ProblematicComponent shouldError={shouldError2} />
              </SimpleErrorBoundary>
              <div className="mt-4">
                <Button
                  onClick={() => setShouldError2(!shouldError2)}
                  variant={shouldError2 ? 'destructive' : 'default'}
                  size="sm"
                >
                  {shouldError2 ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Error Active
                    </>
                  ) : (
                    'Toggle Error'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Async Error Boundary */}
          <Card>
            <CardHeader>
              <CardTitle>Async Error Boundary</CardTitle>
              <CardDescription>Handles errors in async operations and promises</CardDescription>
            </CardHeader>
            <CardContent>
              <AsyncErrorBoundary>
                <AsyncProblematicComponent shouldError={shouldError3} />
              </AsyncErrorBoundary>
              <div className="mt-4">
                <Button
                  onClick={() => setShouldError3(!shouldError3)}
                  variant={shouldError3 ? 'destructive' : 'default'}
                  size="sm"
                >
                  {shouldError3 ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Error Active
                    </>
                  ) : (
                    'Toggle Error'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Error Fallback */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Error Fallback</CardTitle>
              <CardDescription>Error boundary with custom fallback component</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary fallback={<CustomErrorFallback />}>
                <ProblematicComponent shouldError={shouldError2} />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </div>

        {/* Best Practices Documentation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Error Handling Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold">Error Boundaries:</h3>
              <ul>
                <li>Wrap components that might fail in error boundaries</li>
                <li>Provide meaningful error messages to users</li>
                <li>Include error recovery options (retry, reset)</li>
                <li>Log errors for debugging and monitoring</li>
                <li>Use different error boundaries for different component hierarchies</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Error Recovery:</h3>
              <ul>
                <li>Always provide a way for users to recover from errors</li>
                <li>Implement retry mechanisms for transient failures</li>
                <li>Save user state when possible to prevent data loss</li>
                <li>Offer alternative ways to complete tasks</li>
                <li>Provide clear contact information for support</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Development vs Production:</h3>
              <ul>
                <li>Show detailed error information in development</li>
                <li>Hide technical details from users in production</li>
                <li>Include error IDs for support reference</li>
                <li>Send errors to monitoring services in production</li>
                <li>Provide developers with stack traces and context</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Async Error Handling:</h3>
              <ul>
                <li>Handle promise rejections properly</li>
                <li>Use try-catch blocks for async operations</li>
                <li>Implement timeout handling for network requests</li>
                <li>Show loading states during async operations</li>
                <li>Clean up resources when errors occur</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Back Navigation */}
        <div className="mt-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Back to Test Hub
          </Button>
        </div>
      </div>
    </div>
  )
}
