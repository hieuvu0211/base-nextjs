'use client'

import { useState } from 'react'

export default function MockControlsPage() {
  const [mockMode, setMockMode] = useState(true)
  const [apiDelay, setApiDelay] = useState(0)
  const [errorRate, setErrorRate] = useState(0)
  const [selectedError, setSelectedError] = useState('none')
  const [requestLog, setRequestLog] = useState<
    Array<{
      id: number
      endpoint: string
      status: 'pending' | 'success' | 'error'
      timestamp: string
      error?: string
      duration?: string
    }>
  >([])

  const simulateApiCall = (endpoint: string) => {
    const id = Date.now()

    setRequestLog((prev) => [
      ...prev,
      {
        id,
        endpoint,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString(),
      },
    ])

    setTimeout(() => {
      const delay = Math.random() * apiDelay * 1000
      const shouldError = Math.random() * 100 < errorRate

      if (shouldError) {
        setRequestLog((prev) =>
          prev.map((req) =>
            req.id === id
              ? { ...req, status: 'error', error: selectedError, duration: `${delay.toFixed(2)}ms` }
              : req
          )
        )
      } else {
        setRequestLog((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: 'success', duration: `${delay.toFixed(2)}ms` } : req
          )
        )
      }
    }, apiDelay * 1000)
  }

  const clearLog = () => {
    setRequestLog([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Dashboard</h1>
          <p className="text-gray-600">Control mock data and error injection for testing</p>
        </div>

        {/* Mock Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Mock Mode Toggle */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mock Mode</h2>
            <button
              onClick={() => setMockMode(!mockMode)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                mockMode
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {mockMode ? '✓ Mock Mode ON' : '✗ Mock Mode OFF'}
            </button>
            <p className="text-sm text-gray-600 mt-2">Toggle mock data on/off</p>
          </div>

          {/* API Delay Controller */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">API Delay</h2>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="10"
                value={apiDelay}
                onChange={(e) => setApiDelay(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-900">{apiDelay}s</span>
                <p className="text-sm text-gray-600">Delay per request</p>
              </div>
            </div>
          </div>

          {/* Error Injection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Error Injection</h2>
            <div className="space-y-3">
              <select
                value={selectedError}
                onChange={(e) => setSelectedError(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="none">No Error</option>
                <option value="network">Network Error</option>
                <option value="timeout">Timeout</option>
                <option value="404">Not Found</option>
                <option value="500">Server Error</option>
                <option value="validation">Validation Error</option>
              </select>
              <input
                type="range"
                min="0"
                max="100"
                value={errorRate}
                onChange={(e) => setErrorRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center">
                <span className="font-bold text-gray-900">{errorRate}%</span>
                <p className="text-sm text-gray-600">Error rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Testing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => simulateApiCall('/api/users')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              GET /users
            </button>
            <button
              onClick={() => simulateApiCall('/api/posts')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              GET /posts
            </button>
            <button
              onClick={() => simulateApiCall('/api/auth/login')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              POST /login
            </button>
            <button
              onClick={() => simulateApiCall('/api/data/upload')}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              POST /upload
            </button>
          </div>
        </div>

        {/* Request Log */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Request Log</h2>
            <button
              onClick={clearLog}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Log
            </button>
          </div>

          {requestLog.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No requests made yet. Click the API test buttons above to see logs.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requestLog.map((req) => (
                    <tr key={req.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {req.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {req.endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            req.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : req.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {req.status}
                        </span>
                        {req.error && (
                          <span className="ml-2 text-xs text-red-600">({req.error})</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {req.duration || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {requestLog.filter((r) => r.status !== 'pending').length}
            </div>
            <p className="text-gray-600 mt-1">Total Requests</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {requestLog.filter((r) => r.status === 'success').length}
            </div>
            <p className="text-gray-600 mt-1">Success</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {requestLog.filter((r) => r.status === 'error').length}
            </div>
            <p className="text-gray-600 mt-1">Errors</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {requestLog.filter((r) => r.status === 'pending').length}
            </div>
            <p className="text-gray-600 mt-1">Pending</p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800 mb-1">✅ Implemented</h3>
              <p className="text-sm text-green-700">Mock mode toggle</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800 mb-1">✅ Implemented</h3>
              <p className="text-sm text-green-700">API delay controller</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800 mb-1">✅ Implemented</h3>
              <p className="text-sm text-green-700">Error injection panel</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800 mb-1">✅ Implemented</h3>
              <p className="text-sm text-green-700">Request/response logger</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-semibold text-yellow-800 mb-1">○ To Add</h3>
              <p className="text-sm text-yellow-700">Data manipulation tools</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-semibold text-yellow-800 mb-1">○ To Add</h3>
              <p className="text-sm text-yellow-700">Session management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
