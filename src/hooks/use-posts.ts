import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { getInfinitePosts, getPostStats } from '@/services/post-service'

export const postQueryKeys = {
  all: ['posts'] as const,
  infinite: (limit?: number) => [...postQueryKeys.all, 'infinite', limit] as const,
  stats: () => [...postQueryKeys.all, 'stats'] as const,
}

// Simplified infinite query implementation
export function useInfinitePosts(limit: number = 10) {
  return useInfiniteQuery({
    queryKey: postQueryKeys.infinite(limit),
    queryFn: ({ pageParam }) =>
      getInfinitePosts(pageParam ? pageParam.toString() : undefined, limit),
    initialPageParam: '0',
    getNextPageParam: (lastPage: unknown) => {
      const nextCursor = (lastPage as { data?: { nextCursor?: string } })?.data?.nextCursor
      return nextCursor
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function usePostStats() {
  return useQuery({
    queryKey: postQueryKeys.stats(),
    queryFn: () => getPostStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useToggleLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => {
      console.log('Toggle like for post:', postId)
      return getPostStats() // Mock function
    },
    onSuccess: () => {
      // Invalidate to trigger refetch
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => {
      // Mock delete
      console.log('Deleting post:', postId)
      return Promise.resolve({ message: 'Post deleted successfully' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.infinite() })
    },
  })
}
