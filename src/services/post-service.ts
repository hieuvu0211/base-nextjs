/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from 'axios'
import { api } from '@/configs/axios-config'
import { ApiResponse } from '@/types/api-response'
import { Post, mockPostsResponse } from '@/mock/posts'

const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
const TIMEOUT = 800 // Slightly longer for posts

// Post interfaces for API operations
export interface CreatePostInput {
  title: string
  content: string
  excerpt?: string
  category: string
  tags: string[]
  coverImage?: string
  status: 'draft' | 'published'
  featured?: boolean
}

export interface UpdatePostInput {
  title?: string
  content?: string
  excerpt?: string
  category?: string
  tags?: string[]
  coverImage?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
}

export interface PostFilters {
  category?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  author?: string
  tags?: string[]
  search?: string
}

export interface PostPaginationOptions {
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'views' | 'likes' | 'title'
  sortOrder?: 'asc' | 'desc'
  filters?: PostFilters
}

// Get posts with pagination, filtering, and sorting
export async function getPosts(options: PostPaginationOptions = {}): Promise<ApiResponse<Post[]>> {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', filters = {} } = options

  if (isMockMode) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    // Apply filters
    let filteredPosts = [...mockPostsResponse.data]

    // Status filter
    if (filters.status) {
      filteredPosts = filteredPosts.filter((post) => post.status === filters.status)
    }

    // Category filter
    if (filters.category) {
      filteredPosts = filteredPosts.filter((post) => post.category === filters.category)
    }

    // Featured filter
    if (filters.featured !== undefined) {
      filteredPosts = filteredPosts.filter((post) => post.featured === filters.featured)
    }

    // Author filter
    if (filters.author) {
      filteredPosts = filteredPosts.filter((post) => post.author.name === filters.author)
    }

    // Tags filter (posts that have ALL specified tags)
    if (filters.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter((post) =>
        filters.tags!.every((tag) => post.tags.includes(tag))
      )
    }

    // Search filter (search in title, excerpt, content)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm)
      )
    }

    // Sort
    filteredPosts.sort((a, b) => {
      let aValue: unknown = a[sortBy]
      let bValue: unknown = b[sortBy]

      // Handle dates
      if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'publishedAt') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      if (sortOrder === 'asc') {
        return (aValue as number) > (bValue as number) ? 1 : -1
      } else {
        return (aValue as number) < (bValue as number) ? 1 : -1
      }
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filteredPosts.slice(startIndex, endIndex)

    return {
      message: 'Posts retrieved successfully',
      data: paginatedData,
      metadata: {
        total: filteredPosts.length,
        page,
        pageCount: Math.ceil(filteredPosts.length / limit),
        limit,
      },
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<Post[]>> = await api.get('/posts', {
      params: { page, limit, sortBy, sortOrder, ...filters },
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch posts')
  }
}

// Get infinite scroll posts (for infinite loading)
export async function getInfinitePosts(
  cursor?: string,
  limit: number = 10
): Promise<
  ApiResponse<{
    posts: Post[]
    nextCursor?: string
    hasMore: boolean
  }>
> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const posts = [...mockPostsResponse.data]
    const startIndex = cursor ? parseInt(cursor) : 0
    const endIndex = startIndex + limit
    const paginatedPosts = posts.slice(startIndex, endIndex)

    return {
      message: 'Posts retrieved successfully',
      data: {
        posts: paginatedPosts,
        nextCursor: endIndex < posts.length ? endIndex.toString() : undefined,
        hasMore: endIndex < posts.length,
      },
    }
  }

  try {
    const response: AxiosResponse<
      ApiResponse<{
        posts: Post[]
        nextCursor?: string
        hasMore: boolean
      }>
    > = await api.get('/posts/infinite', {
      params: { cursor, limit },
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch posts')
  }
}

// Get single post by ID
export async function getPostById(id: string): Promise<ApiResponse<Post>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const post = mockPostsResponse.data.find((p) => p.id === id)
    if (!post) {
      throw new Error('Post not found')
    }

    return {
      message: 'Post retrieved successfully',
      data: post,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<Post>> = await api.get(`/posts/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch post')
  }
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const post = mockPostsResponse.data.find((p) => p.slug === slug)
    if (!post) {
      throw new Error('Post not found')
    }

    return {
      message: 'Post retrieved successfully',
      data: post,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<Post>> = await api.get(`/posts/slug/${slug}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch post')
  }
}

// Create new post
export async function createPost(postData: CreatePostInput): Promise<ApiResponse<Post>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const newPost: Post = {
      id: `post-${mockPostsResponse.data.length + 1}`,
      slug: postData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-'),
      title: postData.title,
      excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
      content: postData.content,
      author: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      },
      category: postData.category,
      tags: postData.tags,
      coverImage: postData.coverImage,
      status: postData.status,
      featured: postData.featured || false,
      readTime: Math.max(1, Math.ceil(postData.content.split(/\s+/).length / 200)),
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: postData.status === 'published' ? new Date().toISOString() : undefined,
    }

    mockPostsResponse.data.push(newPost)

    return {
      message: 'Post created successfully',
      data: newPost,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<Post>> = await api.post('/posts', postData)
    return response.data
  } catch (error) {
    throw new Error('Failed to create post')
  }
}

// Update existing post
export async function updatePost(
  id: string,
  postData: UpdatePostInput
): Promise<ApiResponse<Post>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const postIndex = mockPostsResponse.data.findIndex((p) => p.id === id)
    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const existingPost = mockPostsResponse.data[postIndex]
    const updatedPost: Post = {
      ...existingPost,
      ...postData,
      slug: postData.title
        ? postData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
        : existingPost.slug,
      updatedAt: new Date().toISOString(),
      publishedAt:
        postData.status === 'published' && existingPost.status !== 'published'
          ? new Date().toISOString()
          : existingPost.publishedAt,
    }

    mockPostsResponse.data[postIndex] = updatedPost

    return {
      message: 'Post updated successfully',
      data: updatedPost,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<Post>> = await api.put(`/posts/${id}`, postData)
    return response.data
  } catch (error) {
    throw new Error('Failed to update post')
  }
}

// Delete post
export async function deletePost(id: string): Promise<ApiResponse<void>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const postIndex = mockPostsResponse.data.findIndex((p) => p.id === id)
    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    mockPostsResponse.data.splice(postIndex, 1)

    return {
      message: 'Post deleted successfully',
      data: undefined,
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/posts/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to delete post')
  }
}

// Like/unlike post
export async function toggleLikePost(
  id: string
): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT / 2))

    const post = mockPostsResponse.data.find((p) => p.id === id)
    if (!post) {
      throw new Error('Post not found')
    }

    // Simulate random like state
    const liked = Math.random() > 0.5
    const likesCount = post.likes + (liked ? 1 : -1)
    post.likes = Math.max(0, likesCount)

    return {
      message: liked ? 'Post liked' : 'Post unliked',
      data: { liked, likesCount },
    }
  }

  try {
    const response: AxiosResponse<ApiResponse<{ liked: boolean; likesCount: number }>> =
      await api.post(`/posts/${id}/like`)
    return response.data
  } catch (error) {
    throw new Error('Failed to toggle like')
  }
}

// Get post statistics
export async function getPostStats(): Promise<
  ApiResponse<{
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalViews: number
    totalLikes: number
    totalComments: number
  }>
> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT))

    const posts = mockPostsResponse.data
    const totalPosts = posts.length
    const publishedPosts = posts.filter((p) => p.status === 'published').length
    const draftPosts = posts.filter((p) => p.status === 'draft').length
    const totalViews = posts.reduce((sum, p) => sum + p.views, 0)
    const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0)
    const totalComments = posts.reduce((sum, p) => sum + p.comments, 0)

    return {
      message: 'Statistics retrieved successfully',
      data: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews,
        totalLikes,
        totalComments,
      },
    }
  }

  try {
    const response: AxiosResponse<
      ApiResponse<{
        totalPosts: number
        publishedPosts: number
        draftPosts: number
        totalViews: number
        totalLikes: number
        totalComments: number
      }>
    > = await api.get('/posts/stats')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch post statistics')
  }
}
