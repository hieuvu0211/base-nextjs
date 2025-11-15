'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  WifiOff,
  CheckCircle,
  Server,
  FileText,
  Shield,
  Bug,
  ArrowRight,
  TestTube,
  Activity,
  Lock,
  RefreshCw,
  Eye,
  Wrench,
  Timer,
} from 'lucide-react'

export default function ErrorScenariosPage() {
  const errorScenarios = [
    {
      title: 'Network Errors',
      description:
        'Simulate various network error conditions including timeouts, connection failures, and DNS issues',
      href: '/test/error-scenarios/network-errors',
      icon: WifiOff,
      color: 'bg-blue-500',
      features: [
        'Adjustable error probability',
        'Network latency simulation',
        'Request timeout testing',
        'Batch and stress testing',
        'Real-time statistics',
      ],
    },
    {
      title: 'Validation Errors',
      description:
        'Test form validation with complex rules, real-time feedback, and error handling patterns',
      href: '/test/error-scenarios/validation-errors',
      icon: CheckCircle,
      color: 'bg-yellow-500',
      features: [
        'Real-time validation',
        'Custom validation rules',
        'Field-level error messages',
        'Form state management',
        'Password strength testing',
      ],
    },
    {
      title: 'Server Errors',
      description:
        'Simulate HTTP server errors and monitor system performance under various error conditions',
      href: '/test/error-scenarios/server-errors',
      icon: Server,
      color: 'bg-red-500',
      features: [
        'HTTP status code testing',
        'Server metrics monitoring',
        'Error rate simulation',
        'Load and stress testing',
        'Request logging and analysis',
      ],
    },
    {
      title: 'General Error Handling',
      description: 'Comprehensive error boundary testing and error handling pattern demonstrations',
      href: '/test/error-handling',
      icon: Shield,
      color: 'bg-purple-500',
      features: [
        'Error boundary testing',
        'Async error handling',
        'Custom error components',
        'Error recovery patterns',
        'Error logging and tracking',
      ],
    },
  ]

  const errorTypes = [
    { name: 'Client Errors (4xx)', count: 9, color: 'text-yellow-600' },
    { name: 'Server Errors (5xx)', count: 7, color: 'text-red-600' },
    { name: 'Success Codes (2xx)', count: 3, color: 'text-green-600' },
    { name: 'Network Errors', count: 8, color: 'text-blue-600' },
    { name: 'Validation Rules', count: 15, color: 'text-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Bug className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Scenarios Testing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive testing suite for various error conditions. Test your application&apos;s
            resilience and error handling capabilities.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {errorTypes.map((type) => (
            <Card key={type.name} className="text-center">
              <CardContent className="p-4">
                <div className={`text-2xl font-bold ${type.color} mb-1`}>{type.count}</div>
                <div className="text-sm text-gray-600">{type.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Error Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {errorScenarios.map((scenario) => {
            const Icon = scenario.icon
            return (
              <Card
                key={scenario.title}
                className="group hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 ${scenario.color} rounded-lg text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{scenario.description}</p>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Features:</div>
                    <ul className="space-y-1">
                      {scenario.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={scenario.href}>
                    <Button className="w-full group-hover:bg-blue-600 transition-colors">
                      <TestTube className="w-4 h-4 mr-2" />
                      Test {scenario.title}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <WifiOff className="w-4 h-4 mr-2" />
                  Network Errors
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Connection refused</li>
                  <li>• DNS resolution failed</li>
                  <li>• SSL/TLS handshake error</li>
                  <li>• Request timeout</li>
                  <li>• Gateway timeout</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Validation Errors
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Required field validation</li>
                  <li>• Format validation (email, phone)</li>
                  <li>• Length constraints</li>
                  <li>• Password strength</li>
                  <li>• Custom validation rules</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Server className="w-4 h-4 mr-2" />
                  Server Errors
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 500 Internal Server Error</li>
                  <li>• 502 Bad Gateway</li>
                  <li>• 503 Service Unavailable</li>
                  <li>• 504 Gateway Timeout</li>
                  <li>• Database connection errors</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Error Patterns
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Error boundaries</li>
                  <li>• Retry mechanisms</li>
                  <li>• Graceful degradation</li>
                  <li>• Error logging</li>
                  <li>• User feedback</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Best Practices */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Testing Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Test All Error Paths',
                  description: 'Ensure every possible error condition is tested',
                  icon: Eye,
                },
                {
                  title: 'Simulate Real Conditions',
                  description: 'Test with realistic network conditions and timeouts',
                  icon: Activity,
                },
                {
                  title: 'Monitor Performance',
                  description: 'Track how errors impact application performance',
                  icon: Timer,
                },
                {
                  title: 'Test Recovery',
                  description: 'Verify application can recover from errors',
                  icon: RefreshCw,
                },
                {
                  title: 'User Experience',
                  description: 'Ensure error messages are clear and helpful',
                  icon: FileText,
                },
                {
                  title: 'Security Testing',
                  description: 'Test error handling doesn&apos;t expose sensitive data',
                  icon: Lock,
                },
              ].map((practice) => {
                const Icon = practice.icon
                return (
                  <div
                    key={practice.title}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">{practice.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{practice.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
