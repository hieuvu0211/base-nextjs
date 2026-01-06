# Next.js 15 Frontend Template

A modern, scalable frontend application template built with Next.js 15, React 19, and TypeScript. This template follows best practices for enterprise-grade applications with a focus on performance, maintainability, and developer experience.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fe-template

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture Overview

This template implements a modern, layered architecture for Next.js 15 applications:

### Core Architectural Principles

1. **Server-First Architecture with Client Capabilities**
   - Server Components by default for optimal performance
   - Client Components when needed for interactivity
   - Progressive enhancement approach
   - Partial Prerendering (PPR) support

2. **Layer-Based Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                         │
├─────────────────────────────────────────────────────────────┤
│ • Server Components (Pages, Layouts)                          │
│ • Client Components (UI, Interactive Elements)               │
│ • Routes (Next.js App Router)                               │
│ • Layouts (Root Layout with Providers)                       │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
├─────────────────────────────────────────────────────────────┤
│ • Custom Hooks (domain logic, reusable logic)               │
│ • Server Actions (data mutations)                           │
│ • Form Handling (React Hook Form, Zod validation)           │
│ • Error Handling                                             │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Management Layer                   │
├─────────────────────────────────────────────────────────────┤
│ • TanStack Query (server state)                            │
│ • Zustand (client state)                                   │
│ • Form State (React Hook Form)                             │
│ • Cache Management                                          │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack

### Core Framework

- **Next.js 15.4.6+** - React framework with App Router and Turbopack
- **React 19.1.0+** - UI library with Server Components
- **TypeScript 5+** - Static typing with strict mode

### Data & State Management

- **TanStack Query v5** - Server state management and caching
- **Zustand v5** - Lightweight client state management
- **React Hook Form** - Form state management with validation
- **Zod** - Schema validation and TypeScript inference

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Headless UI components for accessibility
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Development Tools

- **ESLint 9** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Jest & Testing Library** - Unit testing
- **Playwright** - End-to-end testing

## 📁 Project Structure

```
my-app/
├── src/                                    # Source code directory
│   ├── app/                               # Next.js 15 App Router
│   │   ├── globals.css                    # Global styles
│   │   ├── layout.tsx                     # Root layout
│   │   ├── providers.tsx                  # App providers
│   │   ├── page.tsx                       # Home page
│   │   └── test/                          # Test pages for components
│   │
│   ├── components/                        # Reusable components
│   │   ├── commons/                       # Common UI components
│   │   │   ├── common-button.tsx         # Button component
│   │   │   ├── common-input.tsx          # Input component
│   │   │   ├── common-table.tsx          # Table component
│   │   │   ├── common-modal.tsx          # Modal component
│   │   │   └── error-boundary.tsx        # Error boundary
│   │   ├── forms/                         # Form components
│   │   └── ui/                           # Base UI components
│   │
│   ├── hooks/                             # Custom React hooks
│   │   ├── use-base-router.tsx           # Custom router hook
│   │   ├── use-posts.ts                  # Posts management hook
│   │   ├── use-users.ts                  # User management hook
│   │   └── index.ts                      # Hook exports
│   │
│   ├── stores/                            # Zustand stores
│   │   ├── user-store.ts                 # User state management
│   │   ├── loading-store.ts              # Loading state management
│   │   └── index.ts                      # Store exports
│   │
│   ├── services/                           # External service integrations
│   │   ├── axios-config.ts               # Axios configuration
│   │   ├── crud-service.ts               # Generic CRUD service
│   │   ├── user-service.ts               # User API service
│   │   └── post-service.ts               # Post API service
│   │
│   ├── mock/                              # Mock data for development
│   │   ├── users.ts                       # User mock data
│   │   ├── posts.ts                       # Post mock data
│   │   └── index.ts                      # Mock data exports
│   │
│   ├── types/                             # Type definitions
│   │   ├── api-response.ts               # API response types
│   │   ├── common.ts                     # Common types
│   │   └── index.ts                      # Type exports
│   │
│   ├── utils/                             # Utility functions
│   │   ├── tw-merge.ts                   # Tailwind merge utility
│   │   ├── format.ts                     # Formatting utilities
│   │   ├── constants.ts                  # Application constants
│   │   └── index.ts                      # Utility exports
│   │
│   └── validations/                       # Zod schemas
│       ├── auth.ts                       # Auth validation
│       └── index.ts                      # Validation exports
│
├── docs/                                   # Documentation
├── plans/                                 # Implementation plans
└── __tests__/                             # Test files
```

## 🎯 Key Features

### 1. **Common Components**

- **CommonButton**: Support for multiple variants (primary, secondary, outline, ghost), loading states, and sizes
- **CommonInput**: Flexible input component with validation, error handling, and multiple types
- **CommonTable**: Advanced table with sorting, pagination, row selection, and filtering
- **CommonModal**: Accessible modal with multiple sizes and animations

### 2. **Data Fetching Patterns**

- TanStack Query for server state management
- Automatic caching and background refetching
- Optimistic updates for better UX
- Error and loading state handling

### 3. **Mock Data Support**

- Toggle between real API and mock data
- Realistic mock responses for development
- Easy testing without backend dependency

### 4. **Type Safety**

- Full TypeScript coverage
- Strict mode enabled
- Type inference from Zod schemas
- API response type definitions

### 5. **Error Handling**

- Global error boundaries
- Comprehensive error messages
- Toast notifications for user feedback
- Graceful degradation

## 🛠️ Development Workflow

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier

# Testing
pnpm test         # Run unit tests
pnpm test:e2e     # Run E2E tests with Playwright
```

### Environment Configuration

Create a `.env.local` file with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_MOCK_MODE=true  # Enable/disable mock mode

# Authentication (if using NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Mock Mode

The template includes a comprehensive mock system for frontend development:

```typescript
// Enable mock mode
process.env.NEXT_PUBLIC_MOCK_MODE = 'true'

// Services will automatically use mock data
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: () => userService.getUsers(), // Returns mock data when enabled
})
```

## 📊 Testing Pages

The template includes comprehensive test pages at `/test` to demonstrate and test all components:

- **Common Components**: Interactive showcase of all common components
- **Loading States**: Various loading patterns and skeletons
- **Data Fetching**: CRUD operations with pagination and filtering
- **Error Scenarios**: Network errors, validation errors, server errors
- **Forms & Validation**: Complex forms with multi-step wizards
- **Mock Controls**: Dashboard to control mock data and error injection

Visit [http://localhost:3000/test](http://localhost:3000/test) to explore all test scenarios.

## 🔒 Security Best Practices

1. **Input Validation**: All inputs validated with Zod schemas
2. **Type Safety**: Strict TypeScript configuration
3. **Environment Variables**: Sensitive data not exposed to client
4. **Error Handling**: No sensitive information leaked in error messages
5. **Authentication**: Ready for NextAuth.js integration

## 🚀 Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Dynamic Imports**: Lazy loading for heavy components
3. **Image Optimization**: Next.js Image component usage
4. **Caching**: TanStack Query with smart caching strategies
5. **Bundle Analysis**: Built-in bundle analyzer support

## 📚 Documentation

- [Frontend Architecture Documentation](./docs/FRONTEND_ARCHITECTURE.md) - Detailed architecture guide
- [Test Implementation Plan](./plans/test-implementation.md) - Testing strategy and progress

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [TanStack Query](https://tanstack.com/query) - Powerful server-state management library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - Small, fast, and scalable state management
- [Zod](https://zod.dev/) - TypeScript-first schema validation

---

Built with ❤️ using Next.js 15, React 19, and TypeScript
