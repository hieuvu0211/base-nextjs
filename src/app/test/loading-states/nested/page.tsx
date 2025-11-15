'use client'

import { useState } from 'react'

export default function NestedLoadingPage() {
  const [parentLoading, setParentLoading] = useState(false)
  const [childLoading, setChildLoading] = useState(false)
  const [grandchildLoading, setGrandchildLoading] = useState(false)

  const handleParentLoad = () => {
    setParentLoading(true)
    setTimeout(() => {
      setParentLoading(false)
    }, 3000)
  }

  const handleChildLoad = () => {
    setChildLoading(true)
    setTimeout(() => {
      setChildLoading(false)
    }, 2000)
  }

  const handleGrandchildLoad = () => {
    setGrandchildLoading(true)
    setTimeout(() => {
      setGrandchildLoading(false)
    }, 1000)
  }

  const handleSequentialLoad = () => {
    setParentLoading(true)
    setTimeout(() => {
      setParentLoading(false)
      setChildLoading(true)
      setTimeout(() => {
        setChildLoading(false)
        setGrandchildLoading(true)
        setTimeout(() => {
          setGrandchildLoading(false)
        }, 1000)
      }, 1500)
    }, 2000)
  }

  const handleParallelLoad = () => {
    setParentLoading(true)
    setChildLoading(true)
    setGrandchildLoading(true)

    setTimeout(() => setParentLoading(false), 3000)
    setTimeout(() => setChildLoading(false), 2000)
    setTimeout(() => setGrandchildLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nested Loading States</h1>
          <p className="text-gray-600">
            Test parent/child loading coordination and sequential/parallel loading patterns
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleParentLoad}
              disabled={parentLoading || childLoading || grandchildLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Load Parent Only (3s)
            </button>
            <button
              onClick={handleChildLoad}
              disabled={parentLoading || childLoading || grandchildLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              Load Child Only (2s)
            </button>
            <button
              onClick={handleGrandchildLoad}
              disabled={parentLoading || childLoading || grandchildLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              Load Grandchild Only (1s)
            </button>
            <button
              onClick={handleSequentialLoad}
              disabled={parentLoading || childLoading || grandchildLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
            >
              Sequential Loading
            </button>
            <button
              onClick={handleParallelLoad}
              disabled={parentLoading || childLoading || grandchildLoading}
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:bg-gray-400"
            >
              Parallel Loading
            </button>
            <button
              onClick={() => {
                setParentLoading(false)
                setChildLoading(false)
                setGrandchildLoading(false)
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Parent Component */}
        <div
          className={`relative rounded-lg border-2 p-6 mb-6 transition-all duration-300 ${
            parentLoading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Parent Component</h3>
            {parentLoading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-600">Loading...</span>
              </div>
            )}
          </div>

          {parentLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          ) : (
            <p className="text-gray-600 mb-4">
              Parent component content loaded successfully. This component manages child loading
              states.
            </p>
          )}

          {/* Child Component */}
          <div
            className={`relative rounded-lg border-2 p-6 mt-4 transition-all duration-300 ${
              childLoading ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900">Child Component</h4>
              {childLoading && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-sm text-green-600">Loading...</span>
                </div>
              )}
            </div>

            {childLoading ? (
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">
                Child component content loaded successfully. This component manages grandchild
                loading states.
              </p>
            )}

            {/* Grandchild Component */}
            <div
              className={`relative rounded-lg border-2 p-4 mt-4 transition-all duration-300 ${
                grandchildLoading ? 'border-purple-300 bg-purple-50' : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-gray-900">Grandchild Component</h5>
                {grandchildLoading && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                    <span className="text-xs text-purple-600">Loading...</span>
                  </div>
                )}
              </div>

              {grandchildLoading ? (
                <div className="h-2 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              ) : (
                <p className="text-sm text-gray-600">
                  Grandchild component content loaded successfully. This is the deepest nested
                  component.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Parent</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  parentLoading ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}
              >
                {parentLoading ? 'Loading' : 'Ready'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Child</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  childLoading ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'
                }`}
              >
                {childLoading ? 'Loading' : 'Ready'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Grandchild</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  grandchildLoading
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {grandchildLoading ? 'Loading' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
