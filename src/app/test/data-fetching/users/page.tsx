'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DataFetchingUsersPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSimulateLoad = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const handleSimulateError = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setLoading(false)
      setError('Failed to fetch users')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">
            Paginated user CRUD operations - This route should be implemented
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User Management System</h2>
            <p className="text-gray-600 mb-6">
              This page should contain a paginated user list with CRUD operations
            </p>
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={handleSimulateLoad}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Simulate Data Loading'}
            </button>
            <button
              onClick={handleSimulateError}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              Simulate Error
            </button>
          </div>

          {loading && (
            <div className="mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Fetching users...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
              <button
                onClick={handleSimulateLoad}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          <div className="text-left bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Expected Implementation:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Paginated user list (10 items per page)</li>
              <li>Loading skeleton for table rows</li>
              <li>Empty state illustration</li>
              <li>Error state with retry button</li>
              <li>Search/filter functionality with debouncing</li>
              <li>Sorting capabilities</li>
              <li>Create, Edit, Delete operations</li>
            </ul>
          </div>

          <div className="mt-6 flex gap-4 justify-center">
            <Link
              href="/test/data-fetching/users/create"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create User (Implemented)
            </Link>
            <Link
              href="/test/crud/users"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              View CRUD Example (Implemented)
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
