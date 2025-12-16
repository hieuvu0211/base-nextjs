'use client'

import Link from 'next/link'

export default function CreateUserDataFetchingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create User (Data Fetching)</h1>
          <p className="text-gray-600">
            User creation with validation - This route should be implemented
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create User Form</h2>
            <p className="text-gray-600 mb-6">
              This page should contain a user creation form with validation
            </p>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Expected Implementation:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Multi-field form with real-time validation</li>
              <li>Button states: idle, loading, success, error</li>
              <li>Form submission with optimistic updates</li>
              <li>Validation error display</li>
              <li>Success confirmation with navigation</li>
              <li>Image upload with preview</li>
              <li>Role selection</li>
            </ul>
          </div>

          <div className="mt-6 flex gap-4 justify-center">
            <Link
              href="/test/data-fetching/users"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Users
            </Link>
            <Link
              href="/test/crud/users/create"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              View Create Example (Implemented)
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
