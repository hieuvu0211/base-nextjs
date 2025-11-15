'use client'

import Link from 'next/link'
import { cn } from '@/utils/tw-merge'

interface TestSection {
  title: string
  description: string
  routes: {
    path: string
    label: string
    description: string
    status?: 'ready' | 'in-progress' | 'planned'
  }[]
}

const testSections: TestSection[] = [
  {
    title: 'Common Components',
    description: 'Test all common UI components',
    routes: [
      {
        path: '/test/common-components',
        label: 'Components Library',
        description: 'Button, Input, Table, Modal components',
        status: 'ready',
      },
    ],
  },
  {
    title: 'Loading States',
    description: 'Test all loading patterns and skeleton states',
    routes: [
      {
        path: '/test/loading-states/page-level',
        label: 'Page Level Loading',
        description: 'Full page loading with skeleton',
        status: 'ready',
      },
      {
        path: '/test/loading-states/component-level',
        label: 'Component Level',
        description: 'Individual component loading states',
        status: 'ready',
      },
      {
        path: '/test/loading-states/nested',
        label: 'Nested Loading',
        description: 'Parent/child loading coordination',
        status: 'ready',
      },
    ],
  },
  {
    title: 'Data Fetching',
    description: 'Test CRUD operations, pagination, and infinite scroll',
    routes: [
      {
        path: '/test/data-fetching/users',
        label: 'User Management',
        description: 'Paginated user CRUD operations',
        status: 'ready',
      },
      {
        path: '/test/data-fetching/users/create',
        label: 'Create User',
        description: 'User creation with validation',
        status: 'ready',
      },
      {
        path: '/test/data-fetching/posts',
        label: 'Posts Feed',
        description: 'Infinite scroll posts',
        status: 'ready',
      },
    ],
  },
  {
    title: 'Error Scenarios',
    description: 'Test error handling and recovery mechanisms',
    routes: [
      {
        path: '/test/error-scenarios/network',
        label: 'Network Errors',
        description: 'Connection failures & timeouts',
        status: 'ready',
      },
      {
        path: '/test/error-scenarios/validation',
        label: 'Validation Errors',
        description: 'Form validation failures',
        status: 'ready',
      },
      {
        path: '/test/error-scenarios/server',
        label: 'Server Errors',
        description: '500 and API errors',
        status: 'ready',
      },
    ],
  },
  {
    title: 'Forms & Validation',
    description: 'Test complex forms and validation patterns',
    routes: [
      {
        path: '/test/forms/create-user',
        label: 'Complex User Form',
        description: 'Multi-field user creation',
        status: 'ready',
      },
      {
        path: '/test/forms/multi-step',
        label: 'Multi-Step Form',
        description: 'Wizard-style form flow',
        status: 'ready',
      },
    ],
  },
  {
    title: 'Mock Controls',
    description: 'Control mock data and error injection',
    routes: [
      {
        path: '/test/mock-controls',
        label: 'Mock Dashboard',
        description: 'Control mock scenarios',
        status: 'ready',
      },
    ],
  },
]

function TestRouteCard({ route }: { route: TestSection['routes'][0] }) {
  const statusColors = {
    ready: 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    planned: 'bg-gray-100 text-gray-800',
  }

  return (
    <Link href={route.path}>
      <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{route.label}</h3>
          {route.status && (
            <span className={cn('px-2 py-1 text-xs rounded-full', statusColors[route.status])}>
              {route.status}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{route.description}</p>
      </div>
    </Link>
  )
}

export default function TestHub() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Next.js 15 Test Suite</h1>
          <p className="text-gray-600">
            Comprehensive testing for all application states and flows
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-blue-900 mb-2">Test Configuration</h2>
          <div className="text-sm text-blue-800">
            <p>
              Mock Mode:{' '}
              <strong>
                {process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ? 'Enabled' : 'Disabled'}
              </strong>
            </p>
            <p>
              API Base: <strong>{process.env.NEXT_PUBLIC_API_BASE_URL || 'Not configured'}</strong>
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {testSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              <p className="text-gray-600 mb-4">{section.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.routes.map((route) => (
                  <TestRouteCard key={route.path} route={route} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Built with Next.js 15, React 19, TanStack Query, Zustand, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}
