'use client'

import { useState } from 'react'

export default function ServerErrorsPage() {
  const [errorType, setErrorType] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const simulateError = (type: string) => {
    setErrorType(type)
    setTimeout(() => {
      setShowDetails(true)
    }, 500)
  }

  const errorMessages: Record<string, { title: string; message: string; details: string }> = {
    '400': {
      title: 'Bad Request',
      message: 'The server could not understand the request',
      details: 'Error code: 400. Invalid request parameters or malformed JSON.',
    },
    '401': {
      title: 'Unauthorized',
      message: 'Authentication is required to access this resource',
      details: 'Error code: 401. Please log in to continue.',
    },
    '403': {
      title: 'Forbidden',
      message: "You don't have permission to access this resource",
      details: 'Error code: 403. Contact your administrator for access.',
    },
    '404': {
      title: 'Not Found',
      message: 'The requested resource was not found',
      details: 'Error code: 404. The URL may be incorrect or the resource may have been deleted.',
    },
    '429': {
      title: 'Too Many Requests',
      message: 'Rate limit exceeded',
      details: 'Error code: 429. Please wait before making more requests.',
    },
    '500': {
      title: 'Internal Server Error',
      message: 'Something went wrong on our end',
      details: 'Error code: 500. Our team has been notified and is working on a fix.',
    },
    '502': {
      title: 'Bad Gateway',
      message: 'The server received an invalid response',
      details: 'Error code: 502. Try refreshing the page in a few minutes.',
    },
    '503': {
      title: 'Service Unavailable',
      message: "We're currently down for maintenance",
      details: "Error code: 503. We'll be back shortly. Thank you for your patience.",
    },
  }

  const currentError = errorType ? errorMessages[errorType] : null

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Server Errors</h1>
          <p className="text-gray-600">Test HTTP error responses and server-side error handling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(errorMessages).map(([code, error]) => (
            <button
              key={code}
              onClick={() => simulateError(code)}
              disabled={errorType !== null}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow disabled:opacity-50"
            >
              <div className="text-2xl font-bold text-gray-900 mb-1">{code}</div>
              <div className="text-sm text-gray-600">{error.title}</div>
            </button>
          ))}
        </div>

        {/* Error Display */}
        {currentError && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Error Header */}
            <div
              className={`p-6 ${
                errorType && parseInt(errorType) < 500
                  ? 'bg-orange-50 border-b border-orange-200'
                  : 'bg-red-50 border-b border-red-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {errorType} - {currentError.title}
                  </h2>
                  <p className="text-gray-700">{currentError.message}</p>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    errorType && parseInt(errorType) < 500 ? 'bg-orange-200' : 'bg-red-200'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Actions */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => setErrorType(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Go Back
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  {showDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>
            </div>

            {/* Error Details */}
            {showDetails && (
              <div className="p-6 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2">Error Details</h3>
                <div className="bg-gray-800 text-gray-100 p-4 rounded font-mono text-sm">
                  <div>Timestamp: {new Date().toISOString()}</div>
                  <div>Request ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}</div>
                  <div>User Agent: {navigator.userAgent.substring(0, 60)}...</div>
                  <div className="mt-2">{currentError.details}</div>
                </div>

                {errorType === '401' && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Authentication Options:</h4>
                    <div className="space-y-2">
                      <button className="block w-full text-left px-4 py-2 bg-white border rounded hover:bg-gray-50">
                        <div className="font-medium">Sign In</div>
                        <div className="text-sm text-gray-600">Use your existing account</div>
                      </button>
                      <button className="block w-full text-left px-4 py-2 bg-white border rounded hover:bg-gray-50">
                        <div className="font-medium">Create Account</div>
                        <div className="text-sm text-gray-600">Register for a new account</div>
                      </button>
                    </div>
                  </div>
                )}

                {errorType === '429' && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Rate Limit Info:</h4>
                    <div className="text-sm text-gray-600">
                      <p>• Limit: 100 requests per hour</p>
                      <p>• Reset in: 45 minutes</p>
                      <p>• Upgrade to Pro for higher limits</p>
                    </div>
                  </div>
                )}

                {errorType === '503' && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Maintenance Schedule:</h4>
                    <div className="text-sm text-gray-600">
                      <p>• Started: 2:00 AM UTC</p>
                      <p>• Expected completion: 3:30 AM UTC</p>
                      <p>• Follow updates on our status page</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Common Error Handling Patterns */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Handling Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">Client-Side Handling</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Toast notifications</li>
                <li>• Inline error messages</li>
                <li>• Error boundaries</li>
                <li>• Retry mechanisms</li>
              </ul>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">Server-Side Handling</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Structured error responses</li>
                <li>• Error logging</li>
                <li>• Rate limiting</li>
                <li>• Circuit breakers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clear Button */}
        {errorType && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setErrorType(null)
                setShowDetails(false)
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Error
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
