import { AxiosResponse } from 'axios'
import { api } from '@/configs/axios-config'
import { ApiResponse } from '@/types/api-response'
import { User, mockUsersResponse } from '@/mock/users'

const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
const TIMEOUT = 500

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin'
}

export interface UpdateUserInput {
  name?: string
  email?: string
  role?: 'user' | 'admin'
}

// Get all users with pagination
export async function getUsers(page: number = 1, limit: number = 10): Promise<ApiResponse<User[]>> {
  if (isMockMode) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    // Simulate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = mockUsersResponse.data.slice(startIndex, endIndex)

    return {
      message: mockUsersResponse.message,
      data: paginatedData,
      metadata: {
        total: mockUsersResponse.data.length,
        page,
        pageCount: Math.ceil(mockUsersResponse.data.length / limit),
        limit,
      },
    }
  }

  // Real API call with axios
  try {
    const response: AxiosResponse<ApiResponse<User[]>> = await api.get('/users', {
      params: {
        page,
        limit,
      },
    })

    return response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))
    const user = mockUsersResponse.data.find((u) => u.id === id)

    if (!user) {
      throw new Error('User not found')
    }

    return {
      message: 'User retrieved successfully',
      data: user,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<User>> = await api.get(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}

// Create new user
export async function createUser(userData: CreateUserInput): Promise<ApiResponse<User>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    // Simulate creating a user
    const newUser: User = {
      id: (mockUsersResponse.data.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return {
      message: 'User created successfully',
      data: newUser,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/users', userData)
    return response.data
  } catch (error) {
    console.error('Failed to create user:', error)
    throw error
  }
}

// Update existing user
export async function updateUser(
  id: string,
  userData: UpdateUserInput
): Promise<ApiResponse<User>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const existingUser = mockUsersResponse.data.find((u) => u.id === id)
    if (!existingUser) {
      throw new Error('User not found')
    }

    const updatedUser: User = {
      ...existingUser,
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    return {
      message: 'User updated successfully',
      data: updatedUser,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<User>> = await api.put(`/users/${id}`, userData)
    return response.data
  } catch (error) {
    console.error('Failed to update user:', error)
    throw error
  }
}

// Delete user
export async function deleteUser(id: string): Promise<ApiResponse<void>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const userExists = mockUsersResponse.data.find((u) => u.id === id)
    if (!userExists) {
      throw new Error('User not found')
    }

    return {
      message: 'User deleted successfully',
      data: undefined,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete user:', error)
    throw error
  }
}
