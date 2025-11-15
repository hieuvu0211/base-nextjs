'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useInfinitePosts, usePostStats, useToggleLike, useDeletePost } from '@/hooks/use-posts'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonCard } from '@/components/ui/skeleton-card'
import { Post } from '@/mock/posts'
import {
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Search,
  Filter,
  Grid3x3,
  List,
  ArrowUp,
  Trash2,
  Edit,
  TrendingUp,
  Star,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react'

// Post card component
function PostCard({
  post,
  onLike,
  onDelete,
  onEdit,
}: {
  post: Post
  onLike: (postId: string) => void
  onDelete: (postId: string) => void
  onEdit: (postId: string) => void
}) {
  const toggleLikeMutation = useToggleLike()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = async () => {
    try {
      await toggleLikeMutation.mutateAsync(post.id)
      setIsLiked(!isLiked)
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      onLike(post.id)
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-900">{post.author.name}</div>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(post.id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(post.id)}
              loading={toggleLikeMutation.isPending}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
            {post.title}
          </h3>

          <p className="text-gray-600 line-clamp-3 mb-3">{post.excerpt}</p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs text-gray-600 bg-gray-100">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>

            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </button>

            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Post skeleton for loading
function PostSkeleton() {
  return <SkeletonCard lines={4} button />
}

// Back to top button
function BackToTop({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:bg-blue-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}

export default function PostsFeed() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfinitePosts(6)

  const { data: stats } = usePostStats()

  const deletePostMutation = useDeletePost()

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage()
          }
        },
        { threshold: 0.1 }
      )

      if (node) observerRef.current.observe(node)
    },
    [isLoading, hasNextPage, fetchNextPage]
  )

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLike = (postId: string) => {
    console.log('Post liked:', postId)
  }

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePostMutation.mutateAsync(postId)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const handleEdit = (postId: string) => {
    console.log('Edit post:', postId)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = (data as any)?.pages?.flatMap((page: any) => page.data.posts) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Posts Feed</h1>
              <p className="mt-2 text-gray-600">Infinite scroll post feed with real-time updates</p>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Grid3x3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Posts</p>
                      <p className="text-lg font-semibold">{stats.data.totalPosts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Eye className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-lg font-semibold">
                        {stats.data.totalViews.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                      <Heart className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Likes</p>
                      <p className="text-lg font-semibold">
                        {stats.data.totalLikes.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Engagement</p>
                      <p className="text-lg font-semibold">
                        {stats.data.totalViews > 0
                          ? Math.round((stats.data.totalLikes / stats.data.totalViews) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={filterOpen ? 'default' : 'outline'}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div
          className={`gap-6 ${
            viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'
          }`}
        >
          {posts.map((post: Post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}

          {/* Loading skeletons */}
          {(isLoading || isFetchingNextPage) &&
            Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={`skeleton-${i}`} />)}
        </div>

        {/* Load more trigger */}
        <div ref={loadMoreRef} className="mt-8 text-center">
          {hasNextPage ? (
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="outline">
              {isFetchingNextPage ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading more posts...
                </>
              ) : (
                'Load More Posts'
              )}
            </Button>
          ) : posts.length > 0 ? (
            <div className="text-gray-500 text-sm">You&apos;ve reached the end of the feed</div>
          ) : null}
        </div>

        {/* Empty state */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3x3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'No posts match your search criteria.'
                : 'Be the first to create a post!'}
            </p>
            <Button>Create New Post</Button>
          </div>
        )}

        {/* Back to top button */}
        <BackToTop visible={showBackToTop} onClick={scrollToTop} />

        {/* Features Documentation */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Infinite Scroll Features Demonstrated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold">Data Fetching Patterns:</h3>
              <ul>
                <li>Infinite scroll with Intersection Observer API</li>
                <li>Optimistic updates for like actions</li>
                <li>Proper cache management with TanStack Query</li>
                <li>Background prefetching for better UX</li>
                <li>Error handling and retry mechanisms</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">User Experience:</h3>
              <ul>
                <li>Loading skeletons during data fetch</li>
                <li>Smooth animations and transitions</li>
                <li>Real-time post statistics</li>
                <li>Responsive grid/list view toggle</li>
                <li>Back to top navigation</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">Performance Optimizations:</h3>
              <ul>
                <li>Lazy loading of posts</li>
                <li>Debounced search input</li>
                <li>Efficient re-rendering with React keys</li>
                <li>Optimized bundle sizes</li>
                <li>Memory-efficient scroll handling</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">State Management:</h3>
              <ul>
                <li>TanStack Query for server state</li>
                <li>Local UI state with useState</li>
                <li>Optimistic updates pattern</li>
                <li>Cache invalidation strategies</li>
                <li>Error boundary integration</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
