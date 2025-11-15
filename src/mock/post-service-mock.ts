import { Post, mockPostsResponse } from './posts'
import { MockDataConfig } from '@/services/crud-service'

export interface CreatePostInput {
  title: string
  content: string
  authorId: string
  published?: boolean
}

export interface UpdatePostInput {
  title?: string
  content?: string
  published?: boolean
}

const posts = [...mockPostsResponse.data] // Create mutable copy for CRUD operations

export const postMockConfig: MockDataConfig<Post, CreatePostInput, UpdatePostInput> = {
  getAllData: () => posts,

  getById: (id: string) => posts.find((p) => p.id === id),

  create: (postData: CreatePostInput) => {
    // Mock author name based on ID
    const authorNames: Record<string, string> = {
      '1': 'John Doe',
      '2': 'Jane Smith',
      '3': 'Bob Johnson',
    }

    const newPost: Post = {
      id: (posts.length + 1).toString(),
      slug: postData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-'),
      title: postData.title,
      excerpt: postData.content.substring(0, 150) + '...',
      content: postData.content,
      author: {
        id: postData.authorId,
        name: authorNames[postData.authorId] || 'Unknown Author',
        email: `${postData.authorId}@example.com`,
      },
      category: 'Technology',
      tags: ['mock', 'test'],
      status: postData.published ? 'published' : 'draft',
      featured: false,
      readTime: Math.max(1, Math.ceil(postData.content.split(/\s+/).length / 200)),
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: postData.published ? new Date().toISOString() : undefined,
    }

    posts.push(newPost)
    return newPost
  },

  update: (id: string, postData: UpdatePostInput) => {
    const index = posts.findIndex((p) => p.id === id)
    if (index === -1) return undefined

    posts[index] = {
      ...posts[index],
      ...postData,
      updatedAt: new Date().toISOString(),
    }

    return posts[index]
  },

  delete: (id: string) => {
    const index = posts.findIndex((p) => p.id === id)
    if (index === -1) return false

    posts.splice(index, 1)
    return true
  },
}
