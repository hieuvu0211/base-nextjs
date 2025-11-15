'use client'

import { useState } from 'react'
import { PageLoading, LoadingOverlay, Button } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function LoadingScenario({
  title,
  description,
  duration,
  showProgress = false,
}: {
  title: string
  description: string
  duration: number
  showProgress?: boolean
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const startLoading = () => {
    setIsLoading(true)
    setProgress(0)

    if (showProgress) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, duration / 10)
    }

    setTimeout(() => {
      setIsLoading(false)
      if (showProgress) {
        setProgress(100)
      }
    }, duration)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoadingOverlay isLoading={isLoading} message="Processing..." blur>
          <div className="space-y-3">
            <p>This content is being loaded. The overlay will appear during loading.</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Sample content that gets hidden during loading:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• User data fetching</li>
                <li>• Initial setup</li>
                <li>• API communication</li>
              </ul>
            </div>
            {showProgress && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </LoadingOverlay>

        <Button onClick={startLoading} disabled={isLoading}>
          {isLoading ? 'Loading...' : `Load for ${duration / 1000}s`}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function PageLevelLoading() {
  const [fullPageLoading, setFullPageLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Loading your content...')
  const [loadingProgress, setLoadingProgress] = useState<number | undefined>()

  const triggerFullPageLoad = (message?: string, withProgress?: boolean) => {
    setFullPageLoading(true)
    setLoadingMessage(message || 'Loading your content...')

    if (withProgress) {
      setLoadingProgress(0)
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setLoadingProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setTimeout(() => setFullPageLoading(false), 500)
        }
      }, 300)
    } else {
      setTimeout(() => setFullPageLoading(false), 3000)
    }
  }

  if (fullPageLoading) {
    return <PageLoading message={loadingMessage} progress={loadingProgress} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Page-Level Loading States</h1>
          <p className="mt-2 text-gray-600">
            Demonstration of full-page loading patterns and overlays
          </p>
        </div>

        {/* Full Page Loading Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Full Page Loading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simple Page Loader</CardTitle>
                <CardDescription>Basic full-page loading without progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setFullPageLoading(true)}>Show Page Loader (3s)</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Loader with Progress</CardTitle>
                <CardDescription>Loading with percentage indicator</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => triggerFullPageLoad('Initializing application...', true)}>
                  Show Progress Loader
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Message Loader</CardTitle>
                <CardDescription>Page loader with custom message</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => triggerFullPageLoad('Fetching user data...')}>
                  Show Custom Message
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Long Loading Process</CardTitle>
                <CardDescription>Simulate a longer loading process</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => triggerFullPageLoad('Processing large dataset...', true)}>
                  Simulate 5s Loading
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Component Overlay Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Loading Overlays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingScenario
              title="Quick Overlay"
              description="Short loading with overlay"
              duration={1000}
            />
            <LoadingScenario
              title="Medium Overlay"
              description="3-second loading with blur"
              duration={3000}
            />
            <LoadingScenario
              title="Long Overlay"
              description="5-second loading with progress"
              duration={5000}
              showProgress
            />
          </div>
        </div>

        {/* Loading States Information */}
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold">When to use page-level loading:</h3>
              <ul>
                <li>Initial application load</li>
                <li>Route transitions with heavy data</li>
                <li>Authentication flows</li>
                <li>File upload processing</li>
                <li>Complex data transformations</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Loading UX Tips:</h3>
              <ul>
                <li>Always provide loading feedback within 200ms</li>
                <li>Show progress for operations longer than 3 seconds</li>
                <li>Allow cancellation when possible</li>
                <li>Use skeleton screens for content-heavy pages</li>
                <li>Maintain context with descriptive messages</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Performance Considerations:</h3>
              <ul>
                <li>Use loading states to prevent multiple submissions</li>
                <li>Implement optimistic updates for better UX</li>
                <li>Cache responses to reduce loading times</li>
                <li>Use Web Workers for heavy computations</li>
                <li>Load progressively with lazy loading</li>
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
