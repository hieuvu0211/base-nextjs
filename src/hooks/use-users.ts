/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  CreateUserInput,
} from '@/services/user-service'
import { ApiResponse } from '@/types/api-response'
import { User } from '@/mock/users'

// Query keys for TanStack Query
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (page: number, limit: number, search?: string) =>
    [...userQueryKeys.lists(), page, limit, search] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
}

// Types for query options
type UsersQueryOptions = Omit<UseQueryOptions<ApiResponse<User[]>>, 'queryKey' | 'queryFn'>
type UserQueryOptions = Omit<UseQueryOptions<ApiResponse<User>>, 'queryKey' | 'queryFn'>
type CreateUserMutationOptions = UseMutationOptions<ApiResponse<User>, Error, CreateUserInput>
type UpdateUserMutationOptions = UseMutationOptions<
  ApiResponse<User>,
  Error,
  Partial<User> & { id: string }
>
type DeleteUserMutationOptions = UseMutationOptions<ApiResponse<void>, Error, string>

/**
 * Hook to fetch users with pagination and search
 */
export function useUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  options?: UsersQueryOptions
) {
  return useQuery({
    queryKey: userQueryKeys.list(page, limit, search),
    queryFn: () => getUsers(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    ...options,
  })
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: string, options?: UserQueryOptions) {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id, // Only run query if ID exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Hook to create a new user
 */
export function useCreateUser(options?: CreateUserMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: CreateUserInput) => createUser(userData),
    onSuccess: (_data, _variables, _context) => {
      // Invalidate the users list to refetch
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
    },
    ...options,
  })
}

/**
 * Hook to update an existing user
 */
export function useUpdateUser(options?: UpdateUserMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...userData }: Partial<User> & { id: string }) => updateUser(id, userData),
    onSuccess: (_data, variables, _context) => {
      // Invalidate the specific user query
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(variables.id) })

      // Invalidate the users list
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
    },
    ...options,
  })
}

/**
 * Hook to delete a user
 */
export function useDeleteUser(options?: DeleteUserMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (_data, variables, _context) => {
      // Invalidate the specific user query
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(variables) })

      // Invalidate the users list
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
    },
    ...options,
  })
}

/**
 * Hook to prefetch user data (useful for optimistic UI)
 */
export function usePrefetchUser() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: userQueryKeys.detail(id),
      queryFn: () => getUserById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}

/**
 * Hook to prefetch next page of users (useful for pagination)
 */
export function usePrefetchNextPage() {
  const queryClient = useQueryClient()

  return (page: number, limit: number = 10, search?: string) => {
    queryClient.prefetchQuery({
      queryKey: userQueryKeys.list(page + 1, limit, search),
      queryFn: () => getUsers(page + 1, limit),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}

/**
 * Hook to invalidate all user queries
 */
export function useInvalidateUsers() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
  }
}

/**
 * Hook to set user data in the cache (useful for optimistic updates)
 */
export function useSetUsersCache() {
  const queryClient = useQueryClient()

  return (page: number, limit: number, data: ApiResponse<User[]>) => {
    queryClient.setQueryData(userQueryKeys.list(page, limit), data)
  }
}
