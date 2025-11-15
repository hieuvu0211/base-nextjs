export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  createdAt: string
  updatedAt: string
}
