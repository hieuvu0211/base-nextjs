import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/user-store'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

// Create axios instance
export const api = axios.create({
  baseURL: isMockMode ? '/mock-api' : BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token for mock mode
    if (isMockMode) {
      return config
    }

    const token = useUserStore.getState().accessToken

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Skip interceptor for mock mode
    if (isMockMode) {
      return Promise.reject(error)
    }

    // Handle 401 Unauthorized - Token refresh logic
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh the token
        const refreshToken = useUserStore.getState().refreshToken

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Call refresh token endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data.data

        // Update tokens in store
        useUserStore.getState().setTokens({
          accessToken,
          refreshToken: newRefreshToken || refreshToken,
        })

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        useUserStore.getState().logout()

        // Redirect to login page (client-side only)
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      }
    }

    // Handle other HTTP errors
    if (error.response?.status) {
      const status = error.response.status
      const message = (error.response.data as { message?: string })?.message || error.message

      switch (status) {
        case 400:
          console.error('Bad Request:', message)
          break
        case 403:
          console.error('Forbidden:', message)
          break
        case 404:
          console.error('Not Found:', message)
          break
        case 429:
          console.error('Too Many Requests:', message)
          break
        case 500:
          console.error('Internal Server Error:', message)
          break
        default:
          console.error(`HTTP Error ${status}:`, message)
      }
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network Error:', error.message)
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request Timeout:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
