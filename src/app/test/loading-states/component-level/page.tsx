'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui'
import { SkeletonCard, SkeletonTable, SkeletonForm } from '@/components/ui/skeleton-card'
import { ButtonLoading } from '@/components/ui/loading-overlay'
import { User as Avatar, Lock, Mail, Settings } from 'lucide-react'

function ComponentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function ButtonStatesDemo() {
  const [loadingStates, setLoadingStates] = useState({
    normal: false,
    success: false,
    error: false,
    disabled: false,
  })

  const simulateLoading = (state: keyof typeof loadingStates) => {
    setLoadingStates({ ...loadingStates, [state]: true })
    setTimeout(() => {
      setLoadingStates({ ...loadingStates, [state]: false })
      if (state === 'success') {
        // Show success for a moment then reset
        setTimeout(() => {
          setLoadingStates({ ...loadingStates, success: false })
        }, 2000)
      }
    }, 2000)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ButtonLoading isLoading={loadingStates.normal} onClick={() => simulateLoading('normal')}>
        Normal Loading
      </ButtonLoading>

      <ButtonLoading
        isLoading={loadingStates.success}
        onClick={() => simulateLoading('success')}
        className="bg-green-600 hover:bg-green-700"
      >
        Success State
      </ButtonLoading>

      <ButtonLoading
        isLoading={loadingStates.error}
        onClick={() => simulateLoading('error')}
        className="bg-red-600 hover:bg-red-700"
      >
        Error State
      </ButtonLoading>

      <ButtonLoading
        isLoading={loadingStates.disabled}
        disabled
        className="opacity-50 cursor-not-allowed"
      >
        Disabled
      </ButtonLoading>
    </div>
  )
}

function CardStatesDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)

  const handleLoadData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowSkeleton(true)
      setTimeout(() => setShowSkeleton(false), 2000)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleLoadData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load Card Data'}
      </Button>

      {showSkeleton ? (
        <SkeletonCard avatar lines={4} button />
      ) : (
        <ComponentCard title="Sample Card">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12" />
              <div>
                <h3 className="font-medium">John Doe</h3>
                <p className="text-sm text-gray-600">john@example.com</p>
              </div>
            </div>
            <p className="text-gray-700">
              This is sample content that appears after loading. The card shows user information
              with avatar, name, and email.
            </p>
            <div className="flex justify-end space-x-2">
              <Button size="sm">Edit</Button>
              <Button size="sm">Delete</Button>
            </div>
          </div>
        </ComponentCard>
      )}
    </div>
  )
}

function FormStatesDemo() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setFormData({ email: '', password: '' })
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-4">
      {isSubmitting ? (
        <SkeletonForm fields={2} />
      ) : (
        <ComponentCard title="Sample Form">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
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
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
            </div>
            <ButtonLoading isLoading={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </ButtonLoading>
          </form>
        </ComponentCard>
      )}
    </div>
  )
}

function ListStatesDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<string[]>([])

  const loadItems = () => {
    setIsLoading(true)
    setItems([])

    setTimeout(() => {
      setItems(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <Button onClick={loadItems} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load List Items'}
      </Button>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>{item}</span>
              </div>
              <Button size="sm">Action</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function IconStatesDemo() {
  const icons = [
    { name: 'Avatar', Icon: Avatar, description: 'User avatar icon' },
    { name: 'Lock', Icon: Lock, description: 'Security lock icon' },
    { name: 'Mail', Icon: Mail, description: 'Email icon' },
    { name: 'Settings', Icon: Settings, description: 'Settings gear icon' },
  ]

  const [loadingIcon, setLoadingIcon] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {icons.map(({ name, Icon, description }) => (
        <Card
          key={name}
          className={`cursor-pointer transition-all ${
            loadingIcon === name ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
          }`}
          onClick={() => {
            setLoadingIcon(name)
            setTimeout(() => setLoadingIcon(null), 2000)
          }}
        >
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <Icon
                className={`h-8 w-8 text-gray-600 ${
                  loadingIcon === name ? 'animate-spin text-blue-600' : ''
                }`}
              />
            </div>
            <h4 className="font-medium text-sm">{name}</h4>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ComponentLevelLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Component-Level Loading States</h1>
          <p className="mt-2 text-gray-600">
            Individual component loading patterns with skeleton screens and state transitions
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Button States</h2>
            <ComponentCard title="Button Loading Variations">
              <div className="space-y-2">
                <p className="text-gray-600 mb-4">
                  Different button states during loading actions:
                </p>
                <ButtonStatesDemo />
              </div>
            </ComponentCard>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Card Skeletons</h2>
            <CardStatesDemo />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Form Skeletons</h2>
            <FormStatesDemo />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">List Skeletons</h2>
            <ListStatesDemo />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Icon Animations</h2>
            <ComponentCard title="Loading Icon States">
              <div className="space-y-2">
                <p className="text-gray-600 mb-4">Icons with loading animations:</p>
                <IconStatesDemo />
              </div>
            </ComponentCard>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Advanced Skeleton Patterns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComponentCard title="Table Skeleton">
                <SkeletonTable rows={5} />
              </ComponentCard>

              <ComponentCard title="Profile Card Skeleton">
                <SkeletonCard avatar lines={3} button />
              </ComponentCard>

              <ComponentCard title="Form Skeleton">
                <SkeletonForm fields={4} />
              </ComponentCard>

              <ComponentCard title="Card with Actions">
                <SkeletonCard avatar lines={4} button />
              </ComponentCard>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Best Practices</h2>
            <ComponentCard title="Loading Best Practices">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold">Component Loading Guidelines:</h3>
                <ul>
                  <li>Use skeleton screens that match the final layout</li>
                  <li>Maintain the same dimensions as loaded content</li>
                  <li>Use subtle animations to indicate loading</li>
                  <li>Provide clear visual hierarchy</li>
                  <li>Consider the loading duration for animation speed</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Animation Timing:</h3>
                <ul>
                  <li>Fast loads (under 1s): Use subtle fade or pulse</li>
                  <li>Medium loads (1-3s): Use skeleton with pulse</li>
                  <li>Slow loads (3+ seconds): Use progress indicators</li>
                  <li>Avoid jarring animations that distract users</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Accessibility:</h3>
                <ul>
                  <li>Include screen reader announcements</li>
                  <li>Maintain focus management</li>
                  <li>Use ARIA labels for loading states</li>
                  <li>Provide keyboard navigation</li>
                  <li>Ensure sufficient color contrast</li>
                </ul>
              </div>
            </ComponentCard>
          </section>

          {/* Back Navigation */}
          <div className="mt-8">
            <Button variant="outline" onClick={() => window.history.back()}>
              ← Back to Test Hub
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
