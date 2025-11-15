import { ApiResponse } from '@/types/api-response'

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
]

export const mockUsersResponse: ApiResponse<User[]> = {
  message: 'Users retrieved successfully',
  data: mockUsers,
  metadata: {
    total: mockUsers.length,
    page: 1,
    pageCount: 1,
    limit: 10,
  },
}
