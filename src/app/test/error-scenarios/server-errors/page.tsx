'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Server,
  Database,
  Cloud,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  Power,
  FileText,
  Lock,
  Users,
  Shield,
  Code,
  Bug,
} from 'lucide-react'

// HTTP Status Codes
const HTTP_STATUS_CODES = {
  // Success
  200: { message: 'OK', description: 'Request successful', type: 'success' },
  201: { message: 'Created', description: 'Resource created successfully', type: 'success' },
  204: {
    message: 'No Content',
    description: 'Request successful, no content returned',
    type: 'success',
  },

  // Client Errors
  400: { message: 'Bad Request', description: 'Invalid request syntax', type: 'client' },
  401: { message: 'Unauthorized', description: 'Authentication required', type: 'client' },
  403: { message: 'Forbidden', description: 'Access denied', type: 'client' },
  404: { message: 'Not Found', description: 'Resource not found', type: 'client' },
  405: { message: 'Method Not Allowed', description: 'HTTP method not supported', type: 'client' },
  408: {
    message: 'Request Timeout',
    description: 'Server timed out waiting for request',
    type: 'client',
  },
  409: { message: 'Conflict', description: 'Request conflicts with current state', type: 'client' },
  422: { message: 'Unprocessable Entity', description: 'Validation failed', type: 'client' },
  429: { message: 'Too Many Requests', description: 'Rate limit exceeded', type: 'client' },

  // Server Errors
  500: { message: 'Internal Server Error', description: 'Unexpected server error', type: 'server' },
  501: { message: 'Not Implemented', description: 'Feature not implemented', type: 'server' },
  502: {
    message: 'Bad Gateway',
    description: 'Invalid response from upstream server',
    type: 'server',
  },
  503: {
    message: 'Service Unavailable',
    description: 'Server temporarily unavailable',
    type: 'server',
  },
  504: { message: 'Gateway Timeout', description: 'Gateway timed out', type: 'server' },
  507: { message: 'Insufficient Storage', description: 'Server storage exceeded', type: 'server' },
} as const

// Server metrics interface
interface ServerMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  activeConnections: number
  uptime: number
  requestsPerSecond: number
  errorRate: number
}

// Error log interface
interface ErrorLog {
  id: string
  timestamp: string
  status: number
  message: string
  endpoint: string
  duration: number
  errorType: 'client' | 'server' | 'success'
}

// Mock API Server
class MockApiServer {
  private isRunning: boolean = false
  private metrics: ServerMetrics
  private errorRate: number = 0
  private latency: number = 100
  private logs: ErrorLog[] = []

  constructor() {
    this.metrics = {
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0,
      activeConnections: 0,
      uptime: 0,
      requestsPerSecond: 0,
      errorRate: 0,
    }
  }

  start() {
    this.isRunning = true
    this.simulateServerActivity()
  }

  stop() {
    this.isRunning = false
  }

  setErrorRate(rate: number) {
    this.errorRate = Math.max(0, Math.min(1, rate))
    this.metrics.errorRate = this.errorRate * 100
  }

  setLatency(ms: number) {
    this.latency = Math.max(0, ms)
  }

  private simulateServerActivity() {
    if (!this.isRunning) return

    // Simulate metrics changes
    this.metrics.cpu = Math.random() * 100
    this.metrics.memory = Math.random() * 100
    this.metrics.disk = Math.random() * 100
    this.metrics.network = Math.random() * 100
    this.metrics.activeConnections = Math.floor(Math.random() * 1000)
    this.metrics.uptime += 1
    this.metrics.requestsPerSecond = Math.floor(Math.random() * 500)

    setTimeout(() => this.simulateServerActivity(), 1000)
  }

  async makeRequest(endpoint: string): Promise<{ status: number; message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          const isError = Math.random() < this.errorRate

          let status: number
          const statusCodeKeys = Object.keys(HTTP_STATUS_CODES)

          if (isError) {
            // Return a random error status
            const errorCodes = statusCodeKeys
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((code) => (HTTP_STATUS_CODES as any)[parseInt(code)].type !== 'success')
              .map((code) => parseInt(code))
            status = errorCodes[Math.floor(Math.random() * errorCodes.length)]
          } else {
            // Return a random success status
            const successCodes = statusCodeKeys
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((code) => (HTTP_STATUS_CODES as any)[parseInt(code)].type === 'success')
              .map((code) => parseInt(code))
            status = successCodes[Math.floor(Math.random() * successCodes.length)]
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const statusInfo = (HTTP_STATUS_CODES as any)[status]
          const log: ErrorLog = {
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            status,
            message: statusInfo.message,
            endpoint,
            duration: this.latency + Math.random() * 100,
            errorType: statusInfo.type,
          }

          this.logs.unshift(log)
          if (this.logs.length > 100) {
            this.logs = this.logs.slice(0, 100)
          }

          if (status >= 400) {
            reject(new Error(`${status} ${statusInfo.message}`))
          } else {
            resolve({ status, message: statusInfo.message })
          }
        },
        this.latency + Math.random() * 200
      )
    })
  }

  getMetrics(): ServerMetrics {
    return { ...this.metrics }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export default function ServerErrorsPage() {
  const [server, setServer] = useState<MockApiServer>(new MockApiServer())
  const [isServerRunning, setIsServerRunning] = useState(false)
  const [errorRate, setErrorRate] = useState(0)
  const [latency, setLatency] = useState(100)
  const [metrics, setMetrics] = useState<ServerMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    activeConnections: 0,
    uptime: 0,
    requestsPerSecond: 0,
    errorRate: 0,
  })
  const [logs, setLogs] = useState<ErrorLog[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Update server settings
  useEffect(() => {
    server.setErrorRate(errorRate)
    server.setLatency(latency)
  }, [errorRate, latency, server])

  // Update metrics and logs
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(server.getMetrics())
      setLogs(server.getLogs())
    }, 1000)

    return () => clearInterval(interval)
  }, [server])

  const toggleServer = () => {
    if (isServerRunning) {
      server.stop()
      setIsServerRunning(false)
    } else {
      server.start()
      setIsServerRunning(true)
    }
  }

  const testEndpoint = async (endpoint: string) => {
    setIsLoading(true)
    try {
      const result = await server.makeRequest(endpoint)
      console.log('Success:', result)
    } catch (error) {
      console.error('Error:', error)
    }
    setIsLoading(false)
  }

  const runStressTest = async () => {
    setIsLoading(true)
    const endpoints = [
      '/api/users',
      '/api/posts',
      '/api/comments',
      '/api/notifications',
      '/api/analytics',
    ]

    const promises = Array.from({ length: 20 }, () => {
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]
      return server.makeRequest(endpoint)
    })

    await Promise.allSettled(promises)
    setIsLoading(false)
  }

  const clearLogs = () => {
    server.clearLogs()
    setLogs([])
  }

  const resetServer = () => {
    server.stop()
    const newServer = new MockApiServer()
    setServer(newServer)
    setIsServerRunning(false)
    setErrorRate(0)
    setLatency(100)
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600'
    if (status >= 400 && status < 500) return 'text-yellow-600'
    if (status >= 500) return 'text-red-600'
    return 'text-gray-600'
  }

  const getMetricColor = (value: number) => {
    if (value < 50) return 'text-green-600'
    if (value < 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Server Error Testing</h1>
          <p className="text-gray-600">
            Simulate various server errors and monitor system performance under load
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Server Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Server className="w-5 h-5 mr-2" />
                    Server Status
                  </span>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isServerRunning ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={toggleServer}
                  className={`w-full ${isServerRunning ? 'bg-red-600 hover:bg-red-700' : ''}`}
                >
                  {isServerRunning ? (
                    <>
                      <Power className="w-4 h-4 mr-2" />
                      Stop Server
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-2" />
                      Start Server
                    </>
                  )}
                </Button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Error Rate: {(errorRate * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={errorRate}
                    onChange={(e) => setErrorRate(parseFloat(e.target.value))}
                    disabled={!isServerRunning}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latency: {latency}ms
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={latency}
                    onChange={(e) => setLatency(parseInt(e.target.value))}
                    disabled={!isServerRunning}
                    className="w-full"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <Button
                    onClick={runStressTest}
                    disabled={!isServerRunning || isLoading}
                    loading={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Stress Test
                  </Button>
                  <Button onClick={resetServer} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Server
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Server Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="w-5 h-5 mr-2" />
                  Server Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: 'CPU Usage',
                    value: metrics.cpu,
                    icon: Cpu,
                    color: getMetricColor(metrics.cpu),
                  },
                  {
                    label: 'Memory',
                    value: metrics.memory,
                    icon: MemoryStick,
                    color: getMetricColor(metrics.memory),
                  },
                  {
                    label: 'Disk',
                    value: metrics.disk,
                    icon: HardDrive,
                    color: getMetricColor(metrics.disk),
                  },
                  { label: 'Network', value: metrics.network, icon: Wifi, color: 'text-blue-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </div>
                      <span className={`text-sm font-medium ${color}`}>{value.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          value < 50 ? 'bg-green-600' : value < 80 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Connections</span>
                    <span className="font-medium">{metrics.activeConnections}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Requests/sec</span>
                    <span className="font-medium">{metrics.requestsPerSecond}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-medium">{metrics.uptime}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Error Rate</span>
                    <span
                      className={`font-medium ${metrics.errorRate > 10 ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {metrics.errorRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  API Endpoints Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { endpoint: '/api/users', description: 'Get all users', icon: Users },
                    { endpoint: '/api/posts', description: 'Get all posts', icon: FileText },
                    { endpoint: '/api/auth/login', description: 'User authentication', icon: Lock },
                    { endpoint: '/api/upload', description: 'File upload', icon: Cloud },
                    { endpoint: '/api/admin/panel', description: 'Admin access', icon: Shield },
                    { endpoint: '/api/analytics', description: 'Analytics data', icon: Activity },
                    { endpoint: '/api/database', description: 'Database query', icon: Server },
                    { endpoint: '/api/health', description: 'Health check', icon: CheckCircle },
                  ].map(({ endpoint, description, icon: Icon }) => (
                    <Button
                      key={endpoint}
                      onClick={() => testEndpoint(endpoint)}
                      disabled={!isServerRunning || isLoading}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-start"
                    >
                      <div className="flex items-center w-full">
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium truncate">{endpoint}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{description}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Request Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Request Logs
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{logs.length} logs</span>
                    <Button
                      onClick={clearLogs}
                      variant="outline"
                      size="sm"
                      disabled={logs.length === 0}
                    >
                      Clear
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="text-center py-12">
                    <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                    <p className="text-gray-600">
                      Start the server and test endpoints to see request logs here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {logs.map((log) => {
                      const Icon =
                        log.errorType === 'success'
                          ? CheckCircle
                          : log.errorType === 'client'
                            ? AlertTriangle
                            : XCircle
                      return (
                        <div
                          key={log.id}
                          className={`p-3 rounded-lg border ${
                            log.errorType === 'success'
                              ? 'bg-green-50 border-green-200'
                              : log.errorType === 'client'
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Icon
                                className={`w-4 h-4 ${
                                  log.errorType === 'success'
                                    ? 'text-green-600'
                                    : log.errorType === 'client'
                                      ? 'text-yellow-600'
                                      : 'text-red-600'
                                }`}
                              />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">{log.endpoint}</span>
                                  <span
                                    className={`font-mono text-xs px-1.5 py-0.5 rounded ${getStatusColor(
                                      log.status
                                    )}`}
                                  >
                                    {log.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{log.duration.toFixed(0)}ms</div>
                              <div className="text-xs text-gray-600">{log.message}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* HTTP Status Codes Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="w-5 h-5 mr-2" />
                  HTTP Status Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(HTTP_STATUS_CODES).map(([code, info]) => (
                    <div
                      key={code}
                      className={`p-3 rounded-lg border ${
                        info.type === 'success'
                          ? 'bg-green-50 border-green-200'
                          : info.type === 'client'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-bold">{code}</span>
                        {info.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : info.type === 'client' ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="font-medium text-sm">{info.message}</div>
                      <div className="text-xs text-gray-600 mt-1">{info.description}</div>
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
