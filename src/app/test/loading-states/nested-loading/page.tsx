'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui'
import { SkeletonCard, SkeletonForm } from '@/components/ui/skeleton-card'
import { ButtonLoading, LoadingOverlay, Spinner } from '@/components/ui/loading-overlay'
import { User, Settings, Download, RefreshCw } from 'lucide-react'

interface NestedCardProps {
  title: string
  children: React.ReactNode
  isLoading?: boolean
  loadingMessage?: string
}

function NestedCard({ title, children, isLoading, loadingMessage }: NestedCardProps) {
  return (
    <LoadingOverlay isLoading={isLoading || false} message={loadingMessage}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {title}
            {isLoading && <Spinner size="sm" />}
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </LoadingOverlay>
  )
}

function DashboardSection() {
  const [isDashboardLoading, setIsDashboardLoading] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(false)
  const [isActivityLoading, setIsActivityLoading] = useState(false)
  const [isSettingsLoading, setIsSettingsLoading] = useState(false)
  const [showContent, setShowContent] = useState({
    users: false,
    activity: false,
    settings: false,
  })

  const loadDashboard = () => {
    setIsDashboardLoading(true)
    setTimeout(() => {
      setIsDashboardLoading(false)
      // Trigger nested loading
      loadNestedContent()
    }, 1500)
  }

  const loadNestedContent = () => {
    // Load user section
    setIsUserLoading(true)
    setTimeout(() => {
      setIsUserLoading(false)
      setShowContent((prev) => ({ ...prev, users: true }))
    }, 1000)

    // Load activity section with delay
    setTimeout(() => {
      setIsActivityLoading(true)
      setTimeout(() => {
        setIsActivityLoading(false)
        setShowContent((prev) => ({ ...prev, activity: true }))
      }, 800)
    }, 500)

    // Load settings section with more delay
    setTimeout(() => {
      setIsSettingsLoading(true)
      setTimeout(() => {
        setIsSettingsLoading(false)
        setShowContent((prev) => ({ ...prev, settings: true }))
      }, 600)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Dashboard Overview</h3>
        <ButtonLoading isLoading={isDashboardLoading} onClick={loadDashboard}>
          <RefreshCw className="w-4 h-4 mr-2" />
          {isDashboardLoading ? 'Loading...' : 'Refresh Dashboard'}
        </ButtonLoading>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics Section */}
        <NestedCard
          title="User Statistics"
          isLoading={isUserLoading}
          loadingMessage="Loading user data..."
        >
          {showContent.users ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Total Users</p>
                    <p className="text-sm text-gray-600">Active this month</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">1,234</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>New Users</span>
                  <span className="font-medium">+123</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Users</span>
                  <span className="font-medium">892</span>
                </div>
              </div>
            </div>
          ) : (
            <SkeletonCard avatar lines={3} />
          )}
        </NestedCard>

        {/* Recent Activity Section */}
        <NestedCard
          title="Recent Activity"
          isLoading={isActivityLoading}
          loadingMessage="Loading activity..."
        >
          {showContent.activity ? (
            <div className="space-y-3">
              {[
                { icon: User, text: 'New user registered', time: '2 min ago' },
                { icon: Settings, text: 'Settings updated', time: '5 min ago' },
                { icon: Download, text: 'Report downloaded', time: '10 min ago' },
              ].map(({ icon: Icon, text, time }, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{text}</p>
                    <p className="text-xs text-gray-500">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SkeletonCard lines={3} />
          )}
        </NestedCard>

        {/* Settings Section */}
        <NestedCard
          title="System Settings"
          isLoading={isSettingsLoading}
          loadingMessage="Loading settings..."
        >
          {showContent.settings ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <Button size="sm" variant="outline">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Data Backup</span>
                <Button size="sm" variant="outline">
                  Manage
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>API Keys</span>
                <Button size="sm" variant="outline">
                  View Keys
                </Button>
              </div>
            </div>
          ) : (
            <SkeletonForm fields={3} />
          )}
        </NestedCard>

        {/* Quick Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'API Response', value: '98ms', status: 'good' },
                { label: 'Error Rate', value: '0.1%', status: 'good' },
                { label: 'Uptime', value: '99.9%', status: 'good' },
                { label: 'Load Time', value: '1.2s', status: 'warning' },
              ].map(({ label, value, status }, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${
                    status === 'good'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <p className="text-xs text-gray-600">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FormWithNestedLoading() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Step 1: Validate form
    setIsValidating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsValidating(false)

    // Step 2: Save to database
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)

    // Complete
    setIsSubmitting(false)
    setFormData({ name: '', email: '', phone: '' })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Multi-Step Form Submission</h3>

      <LoadingOverlay
        isLoading={isSubmitting}
        message={
          isValidating
            ? 'Validating information...'
            : isSaving
              ? 'Saving to database...'
              : 'Processing...'
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>User Registration</CardTitle>
            <CardDescription>
              This form demonstrates nested loading states during validation and saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isValidating && <Spinner size="xs" className="mr-2 inline" />}
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isValidating && <Spinner size="xs" className="mr-2 inline" />}
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isValidating && <Spinner size="xs" className="mr-2 inline" />}
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                  disabled={isSubmitting}
                />
              </div>

              <ButtonLoading isLoading={isSubmitting} className="w-full">
                {isValidating ? 'Validating...' : isSaving ? 'Saving...' : 'Register User'}
              </ButtonLoading>
            </form>
          </CardContent>
        </Card>
      </LoadingOverlay>
    </div>
  )
}

function DataFlowWithDependencies() {
  const [stages, setStages] = useState({
    fetching: false,
    processing: false,
    transforming: false,
    displaying: false,
  })
  const [data, setData] = useState<{
    records: number
    processed: boolean
    timestamp: string
  } | null>(null)

  const runDataPipeline = () => {
    setStages({
      fetching: true,
      processing: false,
      transforming: false,
      displaying: false,
    })
    setData(null)

    // Stage 1: Fetch data
    setTimeout(() => {
      setStages((prev) => ({ ...prev, fetching: false, processing: true }))

      // Stage 2: Process data
      setTimeout(() => {
        setStages((prev) => ({ ...prev, processing: false, transforming: true }))

        // Stage 3: Transform data
        setTimeout(() => {
          setStages((prev) => ({ ...prev, transforming: false, displaying: true }))
          setData({
            records: 1234,
            processed: true,
            timestamp: new Date().toISOString(),
          })

          // Reset after display
          setTimeout(() => {
            setStages((prev) => ({ ...prev, displaying: false }))
          }, 2000)
        }, 800)
      }, 1000)
    }, 1500)
  }

  const pipelineStages = [
    { key: 'fetching', label: 'Fetching Data', icon: Download, color: 'blue' },
    { key: 'processing', label: 'Processing Records', icon: Settings, color: 'yellow' },
    { key: 'transforming', label: 'Transforming Format', icon: RefreshCw, color: 'purple' },
    { key: 'displaying', label: 'Displaying Results', icon: User, color: 'green' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Data Pipeline with Dependencies</h3>
        <Button onClick={runDataPipeline} disabled={Object.values(stages).some((s) => s)}>
          Run Pipeline
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineStages.map(({ key, label, icon: Icon, color }) => {
          const isActive = stages[key as keyof typeof stages]
          const isCompleted = data && key === 'displaying'

          return (
            <Card
              key={key}
              className={`relative transition-all duration-300 ${
                isActive
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : isCompleted
                    ? 'ring-2 ring-green-500 bg-green-50'
                    : 'bg-gray-50'
              }`}
            >
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  {isActive ? (
                    <Spinner className={`text-${color}-600`} />
                  ) : (
                    <Icon
                      className={`w-8 h-8 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}
                    />
                  )}
                </div>
                <h4 className="font-medium text-sm">{label}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {isActive ? 'In Progress...' : isCompleted ? 'Complete' : 'Waiting...'}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {data && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-green-800 mb-2">Pipeline Complete!</h4>
            <pre className="text-sm text-green-700">{JSON.stringify(data, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function NestedLoadingStates() {
  const [activeDemo, setActiveDemo] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nested Loading States</h1>
          <p className="mt-2 text-gray-600">
            Complex loading scenarios with multiple dependent states and cascading operations
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'dashboard', label: 'Dashboard Loading' },
              { id: 'form', label: 'Multi-Step Form' },
              { id: 'pipeline', label: 'Data Pipeline' },
            ].map(({ id, label }) => (
              <Button
                key={id}
                variant={activeDemo === id ? 'default' : 'outline'}
                onClick={() => setActiveDemo(id)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Demo */}
        <div className="space-y-8">
          {activeDemo === 'dashboard' && <DashboardSection />}
          {activeDemo === 'form' && <FormWithNestedLoading />}
          {activeDemo === 'pipeline' && <DataFlowWithDependencies />}
        </div>

        {/* Best Practices */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Nested Loading Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold">Sequential Loading:</h3>
              <ul>
                <li>Show progress for each distinct step</li>
                <li>Use descriptive messages for each phase</li>
                <li>Maintain context of what&apos;s happening</li>
                <li>Allow cancellation at appropriate points</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Dependency Management:</h3>
              <ul>
                <li>Clearly show dependent relationships</li>
                <li>Indicate which steps can run in parallel</li>
                <li>Use visual indicators for progress flow</li>
                <li>Handle failures gracefully at each stage</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">UX Considerations:</h3>
              <ul>
                <li>Avoid overwhelming users with too many spinners</li>
                <li>Group related operations into logical phases</li>
                <li>Provide estimated completion times when possible</li>
                <li>Show partial results when available</li>
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
