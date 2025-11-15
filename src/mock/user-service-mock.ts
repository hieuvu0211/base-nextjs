import { User, mockUsersResponse } from './users'
import { CreateUserInput, UpdateUserInput } from '@/services/user-service'
import { MockDataConfig } from '@/services/crud-service'

const users = [...mockUsersResponse.data] // Create mutable copy for CRUD operations

export const userMockConfig: MockDataConfig<User, CreateUserInput, UpdateUserInput> = {
  getAllData: () => users,

  getById: (id: string) => users.find((u) => u.id === id),

  create: (userData: CreateUserInput) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)
    return newUser
  },

  update: (id: string, userData: UpdateUserInput) => {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return undefined

    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    return users[index]
  },

  delete: (id: string) => {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return false

    users.splice(index, 1)
    return true
  },
}
