import { ApiResponse } from '@/types/api-response';

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    content: 'Next.js 15 introduces many exciting features including improved App Router and Server Components...',
    authorId: '1',
    authorName: 'John Doe',
    published: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    content: 'Learn about advanced React patterns that can help you build better applications...',
    authorId: '2',
    authorName: 'Jane Smith',
    published: true,
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    title: 'TypeScript Best Practices',
    content: 'TypeScript can greatly improve your development experience when used correctly...',
    authorId: '3',
    authorName: 'Bob Johnson',
    published: false,
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
];

export const mockPostsResponse: ApiResponse<Post[]> = {
  message: 'Posts retrieved successfully',
  data: mockPosts,
  metadata: {
    total: mockPosts.length,
    page: 1,
    pageCount: 1,
    limit: 10,
  },
};