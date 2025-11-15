'use client'

import { useState } from 'react'

export default function NetworkErrorsPage() {
  const [simulatingError, setSimulatingError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const simulateError = (errorType: string) => {
    setSimulatingError(errorType)
    setTimeout(() => {
      setSimulatingError(null)
    }, 3000)
  }

  const handleRetry = () => {
    setRetryCount(retryCount + 1)
    simulateError('retry')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Network Errors</h1>
          <p className="text-gray-600">
            Test connection failures, timeouts, and network interruption scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Connection Timeout */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Connection Timeout</h2>
            <p className="text-gray-600 mb-4">Simulates a connection timeout after 10 seconds</p>
            <button
              onClick={() => simulateError('timeout')}
              disabled={simulatingError !== null}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              {simulatingError === 'timeout' ? 'Timing out...' : 'Simulate Timeout'}
            </button>
          </div>

          {/* Network Unreachable */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Network Unreachable</h2>
            <p className="text-gray-600 mb-4">Simulates offline mode or network disconnection</p>
            <button
              onClick={() => simulateError('offline')}
              disabled={simulatingError !== null}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
            >
              {simulatingError === 'offline' ? 'Checking...' : 'Simulate Offline'}
            </button>
          </div>

          {/* DNS Failure */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">DNS Resolution Failure</h2>
            <p className="text-gray-600 mb-4">Simulates unable to resolve server hostname</p>
            <button
              onClick={() => simulateError('dns')}
              disabled={simulatingError !== null}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400"
            >
              {simulatingError === 'dns' ? 'Resolving...' : 'Simulate DNS Error'}
            </button>
          </div>

          {/* CORS Error */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">CORS Error</h2>
            <p className="text-gray-600 mb-4">Simulates cross-origin resource sharing error</p>
            <button
              onClick={() => simulateError('cors')}
              disabled={simulatingError !== null}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {simulatingError === 'cors' ? 'Loading...' : 'Simulate CORS Error'}
            </button>
          </div>
        </div>

        {/* Error Display Area */}
        {simulatingError && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Simulated Error</h2>

            {simulatingError === 'timeout' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Connection Timeout</h3>
                <p className="text-red-700 mb-2">
                  Error: Failed to connect to server within 10 seconds
                </p>
                <p className="text-sm text-red-600">
                  Please check your network connection and try again.
                </p>
                <div className="mt-4">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Retry ({retryCount} attempts)
                  </button>
                </div>
              </div>
            )}

            {simulatingError === 'offline' && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Network Unreachable</h3>
                <p className="text-orange-700 mb-2">Error: Unable to connect to the internet</p>
                <p className="text-sm text-orange-600">Please check your network connection.</p>
                <div className="mt-4">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {simulatingError === 'dns' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">DNS Resolution Failed</h3>
                <p className="text-yellow-700 mb-2">Error: Unable to resolve server hostname</p>
                <p className="text-sm text-yellow-600">The server address could not be resolved.</p>
                <div className="mt-4">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {simulatingError === 'cors' && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">CORS Error</h3>
                <p className="text-purple-700 mb-2">Error: Cross-origin request blocked</p>
                <p className="text-sm text-purple-600">
                  The server does not allow cross-origin requests from this origin.
                </p>
                <div className="mt-4">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {simulatingError === 'retry' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Retrying Connection</h3>
                <p className="text-blue-700">Attempt {retryCount + 1} to reconnect...</p>
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Retry Strategies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Retry Strategies</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">Exponential Backoff</h3>
              <p className="text-gray-600">
                Wait time: 1s, 2s, 4s, 8s, 16s... with maximum 30 seconds
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">Linear Backoff</h3>
              <p className="text-gray-600">Wait time: 1s, 2s, 3s, 4s... with fixed increment</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">Cached Fallback</h3>
              <p className="text-gray-600">Show cached data while retrying in background</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">Circuit Breaker</h3>
              <p className="text-gray-600">Stop retrying after 5 consecutive failures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
