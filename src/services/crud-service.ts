import { AxiosResponse } from 'axios'
import { api } from '@/configs/axios-config'
import { ApiResponse } from '@/types/api-response'

const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
const TIMEOUT = 500

export interface MockDataConfig<T, CreateT, UpdateT> {
  getAllData: () => T[]
  getById: (id: string) => T | undefined
  create: (data: CreateT) => T
  update: (id: string, data: UpdateT) => T | undefined
  delete: (id: string) => boolean
}

// Generic CRUD operations
export async function getAll<T>(
  endpoint: string,
  page: number = 1,
  limit: number = 10,
  mockConfig?: MockDataConfig<T, unknown, unknown>
): Promise<ApiResponse<T[]>> {
  if (isMockMode && mockConfig) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const data = mockConfig.getAllData()
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = data.slice(startIndex, endIndex)

    return {
      message: `${endpoint} retrieved successfully`,
      data: paginatedData,
      metadata: {
        total: data.length,
        page,
        pageCount: Math.ceil(data.length / limit),
        limit,
      },
    }
  }

  // Real API call with axios
  try {
    const response: AxiosResponse<ApiResponse<T[]>> = await api.get(endpoint, {
      params: {
        page,
        limit,
      },
    })

    return response.data
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error)
    throw error
  }
}

export async function getById<T>(
  endpoint: string,
  id: string,
  mockConfig?: MockDataConfig<T, unknown, unknown>
): Promise<ApiResponse<T>> {
  if (isMockMode && mockConfig) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const data = mockConfig.getById(id)
    if (!data) {
      throw new Error(`${endpoint} with id ${id} not found`)
    }

    return {
      message: `${endpoint} retrieved successfully`,
      data,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(`${endpoint}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}/${id}:`, error)
    throw error
  }
}

export async function create<T, CreateT>(
  endpoint: string,
  data: CreateT,
  mockConfig?: MockDataConfig<T, CreateT, unknown>
): Promise<ApiResponse<T>> {
  if (isMockMode && mockConfig) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const newItem = mockConfig.create(data)
    return {
      message: `${endpoint} created successfully`,
      data: newItem,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.post(endpoint, data)
    return response.data
  } catch (error) {
    console.error(`Failed to create ${endpoint}:`, error)
    throw error
  }
}

export async function update<T, UpdateT>(
  endpoint: string,
  id: string,
  data: UpdateT,
  mockConfig?: MockDataConfig<T, unknown, UpdateT>
): Promise<ApiResponse<T>> {
  if (isMockMode && mockConfig) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const updatedItem = mockConfig.update(id, data)
    if (!updatedItem) {
      throw new Error(`${endpoint} with id ${id} not found`)
    }

    return {
      message: `${endpoint} updated successfully`,
      data: updatedItem,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.put(`${endpoint}/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Failed to update ${endpoint}/${id}:`, error)
    throw error
  }
}

export async function deleteById<T>(
  endpoint: string,
  id: string,
  mockConfig?: MockDataConfig<T, unknown, unknown>
): Promise<ApiResponse<void>> {
  if (isMockMode && mockConfig) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const deleted = mockConfig.delete(id)
    if (!deleted) {
      throw new Error(`${endpoint} with id ${id} not found`)
    }

    return {
      message: `${endpoint} deleted successfully`,
      data: undefined,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`${endpoint}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Failed to delete ${endpoint}/${id}:`, error)
    throw error
  }
}
