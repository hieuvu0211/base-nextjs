'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUsers, useDeleteUser } from '@/hooks/use-users'
import { Button } from '@/components/ui'
import { SkeletonTable } from '@/components/ui/skeleton-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  Search,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Eye,
} from 'lucide-react'

interface UserListTableProps {
  page: number
  limit: number
  onPageChange: (page: number) => void
  search?: string
  onSearchChange: (search: string) => void
}

function UserListTable({ page, limit, onPageChange, search, onSearchChange }: UserListTableProps) {
  const router = useRouter()
  const { data: usersData, isLoading, error, refetch } = useUsers(page, limit, search)

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      console.log('User deleted successfully')
    },
    onError: (error) => {
      console.error('Failed to delete user:', error)
    },
  })

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await deleteUserMutation.mutateAsync(userId)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleViewUser = (userId: string) => {
    router.push(`/test/crud/users/${userId}`)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Users...</CardTitle>
          <CardDescription>Please wait while we fetch the user data</CardDescription>
        </CardHeader>
        <CardContent>
          <SkeletonTable rows={limit} />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Error Loading Users</CardTitle>
          <CardDescription className="text-red-600">
            {error instanceof Error ? error.message : 'Failed to load user data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-red-700">
              There was an error loading the user data. Please try again.
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const users = usersData?.data || []
  const metadata = usersData?.metadata
  const hasNextPage = metadata ? page < metadata.pageCount : false
  const hasPreviousPage = page > 1

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              {metadata
                ? `Showing ${metadata.total} users (page ${page} of ${metadata.pageCount})`
                : 'Manage application users'}
            </CardDescription>
          </div>
          <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 max-w-md flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={search || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Users Table */}
        {users.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">
              {search
                ? 'No users match your search criteria.'
                : 'Get started by creating your first user.'}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewUser(user.id)}
                          title="View user details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewUser(user.id)}
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          loading={deleteUserMutation.isPending}
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          size="sm"
                          variant="destructive"
                          disabled={deleteUserMutation.isPending}
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {metadata && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, metadata.total)} of{' '}
                  {metadata.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={!hasPreviousPage || isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm">
                    Page {page} of {metadata.pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={!hasNextPage || isLoading}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function UsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const limit = 10

  // Debounce search to avoid excessive API calls
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page when searching
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            View, search, and manage application users with pagination
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Search Feature</p>
                  <p className="text-2xl font-bold text-gray-900">Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <RefreshCw className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Auto Refresh</p>
                  <p className="text-2xl font-bold text-gray-900">5 min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User List Table */}
        <UserListTable
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          search={debouncedSearch}
          onSearchChange={setSearch}
        />

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Features Demonstrated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold">TanStack Query Integration:</h3>
              <ul>
                <li>Data fetching with automatic caching and invalidation</li>
                <li>Pagination support with query keys dependent on page number</li>
                <li>Optimistic updates for user deletion</li>
                <li>Automatic refetching on window focus</li>
                <li>Error handling and retry functionality</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">UI Features:</h3>
              <ul>
                <li>Search with debouncing to reduce API calls</li>
                <li>Loading states with skeleton screens</li>
                <li>Error states with retry functionality</li>
                <li>Pagination controls with proper state management</li>
                <li>Responsive design for mobile devices</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Best Practices:</h3>
              <ul>
                <li>Separate query keys for easy cache management</li>
                <li>Type-safe mutations with proper error handling</li>
                <li>Proper loading and error states for better UX</li>
                <li>Debounced search to prevent excessive API calls</li>
                <li>Confirmation dialogs for destructive actions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Back Navigation */}
        <div className="mt-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Back to Test Hub
          </Button>
        </div>
      </div>
    </div>
  )
}
