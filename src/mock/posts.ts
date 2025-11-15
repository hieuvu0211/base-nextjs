import { ApiResponse } from '@/types/api-response'

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    email: string
  }
  category: string
  tags: string[]
  coverImage?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  readTime: number
  likes: number
  comments: number
  views: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// Enhanced data generator for more realistic testing
const generatePostId = (index: number): string => `post-${index + 1}`

const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const generateExcerpt = (content: string, maxLength: number = 150): string => {
  const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const generateReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

const generateRandomDate = (daysBack: number = 30): string => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
  return date.toISOString()
}

const categories = [
  'Technology',
  'Development',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'DevOps',
  'Security',
  'Mobile',
  'Web Development',
  'AI & ML',
  'Cloud Computing',
  'Database',
  'Testing',
  'Frontend',
]

const tags = [
  'javascript',
  'typescript',
  'react',
  'nextjs',
  'nodejs',
  'python',
  'database',
  'api',
  'frontend',
  'backend',
  'devops',
  'design',
  'ui',
  'ux',
  'mobile',
  'web',
  'cloud',
  'security',
  'performance',
  'testing',
  'tutorial',
  'guide',
  'news',
  'tips',
  'trends',
  'best-practices',
]

const authors = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    email: 'john@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    email: 'jane@example.com',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    email: 'bob@example.com',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    email: 'sarah@example.com',
  },
  {
    id: '5',
    name: 'Tom Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
    email: 'tom@example.com',
  },
]

const postTemplates = [
  {
    title: 'Getting Started with {category}',
    content: `<h2>Introduction</h2><p>This comprehensive guide covers the fundamentals of {category}. Whether you're a beginner or looking to refresh your knowledge, this article will provide valuable insights into modern {category} practices.</p><h3>What You'll Learn</h3><ul><li>Core concepts and principles</li><li>Practical implementation tips</li><li>Common pitfalls and how to avoid them</li><li>Best practices from industry experts</li></ul>`,
  },
  {
    title: 'Advanced {category} Techniques',
    content: `<h2>Advanced Concepts</h2><p>Take your {category} skills to the next level with these advanced techniques. We'll explore complex scenarios and solutions that experienced developers face in production environments.</p><h3>Topics Covered</h3><ul><li>Performance optimization strategies</li><li>Scalability considerations</li><li>Security best practices</li><li>Maintenance and monitoring</li></ul>`,
  },
  {
    title: '{category} Trends in 2024',
    content: `<h2>Latest Developments</h2><p>Stay ahead of the curve with the latest {category} trends and innovations. This article analyzes the current landscape and predicts future developments in the field.</p><h3>Key Trends</h3><ul><li>Emerging technologies</li><li>Industry adoption patterns</li><li>Future predictions</li><li>Skill requirements</li></ul>`,
  },
  {
    title: 'Building Scalable {category} Solutions',
    content: `<h2>Architecture Patterns</h2><p>Learn how to build {category} solutions that can scale with your business needs. This guide covers architectural patterns, design principles, and implementation strategies.</p><h3>Architecture Considerations</h3><ul><li>Microservices vs monolith</li><li>Database design patterns</li><li>API design principles</li><li>Deployment strategies</li></ul>`,
  },
  {
    title: 'Security Best Practices for {category}',
    content: `<h2>Security Fundamentals</h2><p>Security should be a top priority in any {category} project. This comprehensive guide covers essential security practices, common vulnerabilities, and how to protect your applications.</p><h3>Security Topics</h3><ul><li>Authentication and authorization</li><li>Data protection</li><li>Network security</li><li>Compliance requirements</li></ul>`,
  },
]

// Generate comprehensive mock posts
export const mockPosts: Post[] = Array.from({ length: 100 }, (_, index) => {
  const template = postTemplates[index % postTemplates.length]
  const category = categories[index % categories.length]
  const author = authors[index % authors.length]
  const title = template.title.replace('{category}', category)
  const content = template.content.replace(/{category}/g, category)
  const isPublished = Math.random() > 0.15 // 85% published
  const isFeatured = Math.random() > 0.85 // 15% featured

  const id = generatePostId(index)
  const createdAt = generateRandomDate(90)
  const updatedAt = generateRandomDate(30)
  const publishedAt = isPublished ? generateRandomDate(60) : undefined

  return {
    id,
    title,
    slug: generateSlug(title),
    excerpt: generateExcerpt(content),
    content,
    author,
    category,
    tags: tags.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 4)),
    coverImage: `https://picsum.photos/800/400?random=${index + 1}`,
    status: isPublished ? 'published' : 'draft',
    featured: isFeatured,
    readTime: generateReadTime(content),
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 5000),
    createdAt,
    updatedAt,
    publishedAt,
  }
})

// API Response format
export const mockPostsResponse: ApiResponse<Post[]> = {
  message: 'Posts retrieved successfully',
  data: mockPosts,
  metadata: {
    total: mockPosts.length,
    page: 1,
    pageCount: 1,
    limit: 10,
  },
}
