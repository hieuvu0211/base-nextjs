'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Download,
  Server,
  Globe,
  Clock,
  Timer,
  Zap,
  Activity,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'

// Network error simulator
class NetworkErrorSimulator {
  private static instance: NetworkErrorSimulator
  private errorProbability: number = 0
  private latency: number = 0
  private timeout: number = 0

  static getInstance(): NetworkErrorSimulator {
    if (!NetworkErrorSimulator.instance) {
      NetworkErrorSimulator.instance = new NetworkErrorSimulator()
    }
    return NetworkErrorSimulator.instance
  }

  setErrorProbability(probability: number): void {
    this.errorProbability = Math.max(0, Math.min(1, probability))
  }

  setLatency(ms: number): void {
    this.latency = Math.max(0, ms)
  }

  setTimeout(ms: number): void {
    this.timeout = Math.max(0, ms)
  }

  async simulateRequest<T>(endpoint: string): Promise<T> {
    // Simulate latency
    if (this.latency > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.latency))
    }

    // Simulate timeout
    if (this.timeout > 0) {
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout: The server took too long to respond'))
        }, this.timeout)
      })
    }

    // Simulate network errors
    if (Math.random() < this.errorProbability) {
      const errors = [
        {
          name: 'Network Error',
          message: 'Failed to fetch: Network request failed',
          icon: WifiOff,
        },
        {
          name: 'Connection Refused',
          message: 'Connection refused: Unable to connect to server',
          icon: XCircle,
        },
        {
          name: 'DNS Resolution Failed',
          message: 'DNS resolution failed: Unable to resolve hostname',
          icon: Globe,
        },
        {
          name: 'SSL/TLS Error',
          message: 'SSL handshake failed: Certificate verification failed',
          icon: AlertTriangle,
        },
        {
          name: 'Server Unavailable',
          message: 'Service unavailable: Server is currently down',
          icon: Server,
        },
        {
          name: 'Connection Reset',
          message: 'Connection reset: The server closed the connection',
          icon: RefreshCw,
        },
        {
          name: 'Proxy Error',
          message: 'Proxy error: Unable to connect through proxy server',
          icon: Globe,
        },
        { name: 'Gateway Timeout', message: 'Gateway timeout: API gateway timed out', icon: Timer },
      ]

      const randomError = errors[Math.floor(Math.random() * errors.length)]
      throw new Error(`${randomError.name}: ${randomError.message}`)
    }

    // Success response
    return {
      endpoint,
      timestamp: new Date().toISOString(),
      data: { success: true, message: 'Request completed successfully' },
    } as T
  }

  reset(): void {
    this.errorProbability = 0
    this.latency = 0
    this.timeout = 0
  }
}

// Request status interface
interface RequestStatus {
  id: string
  endpoint: string
  status: 'pending' | 'success' | 'error'
  error?: string
  duration: number
  timestamp: string
}

export default function NetworkErrorsPage() {
  const [errorProbability, setErrorProbability] = useState(0)
  const [latency, setLatency] = useState(0)
  const [timeout, setTimeout] = useState(0)
  const [requests, setRequests] = useState<RequestStatus[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    averageResponseTime: 0,
  })

  const networkSimulator = NetworkErrorSimulator.getInstance()

  // Update simulator settings
  useEffect(() => {
    networkSimulator.setErrorProbability(errorProbability)
    networkSimulator.setLatency(latency)
    networkSimulator.setTimeout(timeout)
  }, [errorProbability, latency, timeout, networkSimulator])

  const makeRequest = async (endpoint: string) => {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const startTime = Date.now()

    // Add pending request
    setRequests((prev) => [
      ...prev,
      {
        id: requestId,
        endpoint,
        status: 'pending',
        duration: 0,
        timestamp: new Date().toISOString(),
      },
    ])

    try {
      await networkSimulator.simulateRequest(endpoint)
      const duration = Date.now() - startTime

      // Update request status
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: 'success', duration } : req))
      )

      // Update stats
      setStats((prev) => ({
        total: prev.total + 1,
        successful: prev.successful + 1,
        failed: prev.failed,
        averageResponseTime: Math.round(
          (prev.averageResponseTime * prev.total + duration) / (prev.total + 1)
        ),
      }))
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

      // Update request status
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: 'error', error: errorMessage, duration } : req
        )
      )

      // Update stats
      setStats((prev) => ({
        total: prev.total + 1,
        successful: prev.successful,
        failed: prev.failed + 1,
        averageResponseTime: Math.round(
          (prev.averageResponseTime * prev.total + duration) / (prev.total + 1)
        ),
      }))
    }
  }

  const runBatchRequests = async () => {
    setIsRunning(true)
    const endpoints = [
      '/api/users',
      '/api/posts',
      '/api/comments',
      '/api/notifications',
      '/api/analytics',
      '/api/search',
      '/api/upload',
      '/api/export',
    ]

    const promises = endpoints.map((endpoint) => makeRequest(endpoint))

    await Promise.allSettled(promises)
    setIsRunning(false)
  }

  const runStressTest = async () => {
    setIsRunning(true)
    const totalRequests = 50
    const endpoints = Array.from({ length: 10 }, (_, i) => `/api/endpoint${i + 1}`)

    for (let i = 0; i < totalRequests; i++) {
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]
      makeRequest(endpoint)

      // Add small delay between requests
      await new Promise<void>((resolve) => {
        const timer = global.setTimeout(() => {
          resolve()
        }, 100)
        return timer
      })
    }

    setIsRunning(false)
  }

  const clearRequests = () => {
    setRequests([])
    setStats({ total: 0, successful: 0, failed: 0, averageResponseTime: 0 })
  }

  const resetSettings = () => {
    setErrorProbability(0)
    setLatency(0)
    setTimeout(0)
    networkSimulator.reset()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Network Error Testing</h1>
          <p className="text-gray-600">
            Simulate various network error conditions to test application resilience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Error Simulation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Error Simulation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Error Probability: {(errorProbability * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={errorProbability}
                    onChange={(e) => setErrorProbability(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Network Latency: {latency}ms
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={latency}
                    onChange={(e) => setLatency(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Timeout: {timeout}ms
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={timeout}
                    onChange={(e) => setTimeout(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <Button onClick={resetSettings} variant="outline" className="w-full">
                    Reset Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Test Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Test Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={runBatchRequests}
                  disabled={isRunning}
                  loading={isRunning}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Run Batch Requests
                </Button>
                <Button
                  onClick={runStressTest}
                  disabled={isRunning}
                  loading={isRunning}
                  variant="outline"
                  className="w-full"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Stress Test (50 requests)
                </Button>
                <Button onClick={clearRequests} variant="outline" className="w-full">
                  Clear History
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Requests</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Successful</span>
                    <span className="font-medium text-green-600">{stats.successful}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Failed</span>
                    <span className="font-medium text-red-600">{stats.failed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-medium">
                      {stats.total > 0
                        ? `${((stats.successful / stats.total) * 100).toFixed(1)}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                    <span className="font-medium">{stats.averageResponseTime}ms</span>
                  </div>
                </div>

                {stats.total > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.successful / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Request History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Request History
                  </div>
                  <div className="text-sm text-gray-500">{requests.length} requests</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-12">
                    <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                    <p className="text-gray-600">
                      Configure error simulation settings and run tests to see results here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className={`p-3 rounded-lg border ${
                          request.status === 'pending'
                            ? 'bg-yellow-50 border-yellow-200'
                            : request.status === 'success'
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {request.status === 'pending' ? (
                              <Loader2 className="w-4 h-4 text-yellow-600 animate-spin" />
                            ) : request.status === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <div>
                              <div className="font-medium text-sm">{request.endpoint}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(request.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{request.duration}ms</div>
                            {request.error && (
                              <div className="text-xs text-red-600 mt-1 max-w-xs truncate">
                                {request.error}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Error Types Reference */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Error Types Being Simulated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Network Error',
                    'Connection Refused',
                    'DNS Resolution Failed',
                    'SSL/TLS Error',
                    'Server Unavailable',
                    'Connection Reset',
                    'Proxy Error',
                    'Gateway Timeout',
                  ].map((errorType) => (
                    <div
                      key={errorType}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                    >
                      <WifiOff className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{errorType}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
