# Next.js 15 Frontend Architecture Documentation

## 🏗️ Architecture Overview

This document outlines the frontend architecture for Next.js 15 applications built with React 19, utilizing modern patterns and best practices for scalable, maintainable web applications.

## 🎯 Core Architectural Principles

### 1. **Server-First Architecture with Client Capabilities**

- **Server Components by Default**: Leverage Next.js 15 App Router server components for optimal performance
- **Client Components When Needed**: Mark with `"use client"` for interactivity, state management, and browser APIs
- **Progressive Enhancement**: Start with server-rendered content, enhance with client-side features
- **Partial Prerendering**: Utilize Next.js 15 PPR for optimal loading performance

### 2. **Data Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Components     │───▶│  State Management │───▶│    Services     │
│                  │    │     Layer       │    │                 │
│ - Server Pages   │    │ - TanStack Query │    │ - API Services  │
│ - Client UI      │    │ - Zustand Store │    │ - Auth Layer    │
│ - Layouts        │    │ - Form States   │    │ - Data Layer    │
│ - Forms          │    │ - Local State   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│    User UI       │    │   Cache Layer    │    │    Backend      │
│                  │    │                  │    │                 │
│ - Tables         │    │ - Query Cache    │    │ - REST API      │
│ - Forms          │    │ - Optimistic      │    │ - GraphQL       │
│ - Lists          │    │   Updates        │    │ - WebSockets    │
│ - Notifications  │    │ - Background      │    │ - Server Actions│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 3. **Layer-Based Architecture**

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
│                    Business Logic Layer                         │
├─────────────────────────────────────────────────────────────┤
│ • Custom Hooks (domain logic, reusable logic)               │
│ • Server Actions (data mutations)                           │
│ • Form Handling (React Hook Form, Zod validation)           │
│ • Guards (authorization & permissions)                       │
│ • Error Handling                                               │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Management Layer                     │
├─────────────────────────────────────────────────────────────┤
│ • TanStack Query (server state)                             │
│ • Zustand (client state)                                   │
│ • Form State (React Hook Form)                             │
│ • Local State (useState, useReducer)                       │
│ • Cache Management                                           │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service & Infrastructure Layer           │
├─────────────────────────────────────────────────────────────┤
│ • API Services (REST/GraphQL)                              │
│ • Authentication (NextAuth)                                │
│ • Error Handling                                               │
│ • HTTP Client (Axios with interceptors)                     │
│ • Environment Configuration                                 │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack

### Core Framework

- **Next.js 15.4.6+** - React framework with App Router and Turbopack
- **React 19.1.0+** - UI library with Server Components and enhanced hooks
- **TypeScript 5+** - Static typing with strict mode

### Data & State Management

- **TanStack Query v5** - Server state management and caching
- **Zustand v5** - Lightweight client state management
- **React Hook Form** - Form state management with validation
- **Zod** - Schema validation and TypeScript inference

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Headless UI components for accessibility
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **tailwindcss-animate** - Animation utilities

### Authentication & Security

- **NextAuth v4** - Authentication solution
- **JOSE** - JWT token handling
- **Zod validation** - Input validation and sanitization

### Development Tools

- **ESLint 9** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Jest & Testing Library** - Unit testing
- **Playwright** - End-to-end testing
- **Lint-staged** - Pre-commit linting

## 📁 Current Project Structure

```
my-app/
├── src/                                    # Source code directory
│   ├── app/                               # Next.js 15 App Router
│   │   ├── globals.css                    # Global styles
│   │   ├── layout.tsx                     # Root layout
│   │   ├── providers.tsx                  # App providers (React Query, etc.)
│   │   ├── page.tsx                       # Home page
│   │   └── dashboard/                     # Main application routes
│   │       ├── page.tsx
│   │       └── settings/
│   │
│   ├── components/                        # Reusable components
│   │   ├── commons/                       # Common UI components
│   │   │   ├── loading.tsx               # Loading component
│   │   │   └── error-boundary.tsx       # Error boundary
│   │   ├── forms/                         # Form components
│   │   │   ├── form-input.tsx            # Input component
│   │   │   ├── form-button.tsx           # Button component
│   │   │   └── form-wrapper.tsx          # Form wrapper with validation
│   │   └── ui/                           # Base UI components
│   │       ├── button.tsx                # Button component
│   │       └── index.ts                  # Component exports
│   │
│   ├── hooks/                             # Custom React hooks
│   │   ├── use-base-router.tsx           # Custom router hook
│   │   ├── use-infinite-scroll.ts        # Infinite scroll hook
│   │   └── index.ts                      # Hook exports
│   │
│   ├── stores/                            # Zustand stores
│   │   ├── user-store.ts                 # User state management
│   │   ├── loading-store.ts              # Loading state management
│   │   └── index.ts                      # Store exports
│   │
│   ├── services/                           # External service integrations
│   │   ├── api/                          # API layer
│   │   │   ├── axios-config.ts           # Axios configuration
│   │   │   ├── endpoints.ts              # API endpoints
│   │   │   └── types.ts                  # API type definitions
│   │   ├── auth-service.ts               # Authentication service
│   │   └── crud-service.ts               # Generic CRUD service
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
│   ├── validations/                       # Zod schemas
│   │   ├── auth.ts                       # Auth validation
│   │   └── index.ts                      # Validation exports
│   │
│   ├── utils/                             # Utility functions
│   │   ├── tw-merge.ts                   # Tailwind merge utility
│   │   ├── format.ts                     # Formatting utilities
│   │   ├── constants.ts                  # Application constants
│   │   └── index.ts                      # Utility exports
│   │
│   ├── configs/                           # Configuration files
│   │   ├── axios-config.ts               # Axios instance configuration
│   │   ├── error-handler.ts               # Error handling configuration
│   │   └── index.ts                       # Config exports
│   │
│   └── assets/                            # Static assets
│       ├── fonts/                        # Font files
│       └── images/                       # Image assets
│
├── docs/                                   # Documentation
├── __tests__/                             # Test files
├── .env.example                           # Environment variables example
└── package.json                           # Dependencies and scripts
```

## 🔧 Hook Architecture Details

### 1. **Custom Hook Organization**

Custom hooks are organized by functionality and reusability:

```typescript
// hooks/use-infinite-scroll.ts - Complex logic hook
export function useInfiniteScroll(
  fetchMore: () => Promise<void>,
  hasMore: boolean
) {
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    // ... intersection observer logic
  }, [loading, hasMore]);

  return { lastElementRef, loading };
}

// Note: For debounce functionality, use an external library like 'use-debounce'
```

### 2. **Service Integration Hooks**

```typescript
// hooks/use-api.ts - API integration hook
export function useApi<T>() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: CreateData<T>) => apiService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      showToast.success('Created successfully!');
    },
    onError: (error) => {
      showToast.error(error.message);
    }
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: UpdateData<T>) => apiService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData(['items']);
      // Optimistic update logic
      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['items'], context?.previous);
      showToast.error('Update failed');
    },
    onSuccess: () => {
      showToast.success('Updated successfully!');
    }
  });

  const remove = useMutation({
    mutationFn: async (id: string) => apiService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      showToast.success('Deleted successfully!');
    }
  });

  return { create, update, remove };
}
```

## 🔄 Data Flow Patterns

### 1. **CRUD Operations with TanStack Query**

```typescript
// Example: User Management
function UserManagement() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { create, update, remove } = useApi<User>();

  const handleCreateUser = async (userData: CreateUserData) => {
    create.mutate(userData);
  };

  const handleUpdateUser = async (id: string, userData: UpdateUserData) => {
    update.mutate({ id, data: userData });
  };

  const handleDeleteUser = async (id: string) => {
    remove.mutate(id);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay error={error} />;

  const users = data?.data || [];

  return (
    <div>
      <UserForm onSubmit={handleCreateUser} />
      {/* Table component should be defined separately */}
    </div>
  );
}
```

### 2. **Server Actions with Form Handling**

```typescript
// app/dashboard/users/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { userService } from '@/services/user-service';

const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
});

export async function createUser(prevState: any, formData: FormData) {
  try {
    const validatedFields = UserSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const user = await userService.create(validatedFields.data);
    revalidatePath('/dashboard/users');
    redirect(`/dashboard/users/${user.id}`);
  } catch (error) {
    return { error: 'Failed to create user' };
  }
}

// app/dashboard/users/page.tsx
export default function UsersPage() {
  return (
    <div>
      <h1>User Management</h1>
      <CreateUserForm />
      <UserList />
    </div>
  );
}
```

### 3. **State Management with Zustand**

```typescript
// stores/user-store.ts
interface UserStore {
  user: User | null;
  preferences: UserPreferences;
  setUser: (user: User) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        preferences: {
          theme: 'system',
          language: 'en',
          notifications: true,
        },
        setUser: (user) => set({ user }),
        updatePreferences: (newPreferences) =>
          set((state) => ({
            preferences: { ...state.preferences, ...newPreferences },
          })),
        logout: () => set({ user: null }),
      }),
      {
        name: 'user-store',
      }
    )
  )
);

// Usage in component
function UserProfile() {
  const { user, updatePreferences } = useUserStore();

  const handleThemeChange = (theme: string) => {
    updatePreferences({ theme });
  };

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <ThemeSelector onChange={handleThemeChange} />
    </div>
  );
}
```

## 🔒 Security Architecture

### 1. **Authentication Flow with NextAuth**

```typescript
// pages/api/auth/[...nextauth].ts
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;
        const user = await authService.login({ email, password });
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
});
```

### 2. **Route Protection with Middleware**

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

### 3. **Input Validation with Zod**

```typescript
// validations/user.ts
export const UserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .transform(val => val.trim()),
  email: z.string()
    .email('Invalid email address')
    .transform(val => val.toLowerCase()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
           'Password must contain at least one uppercase, lowercase, and number'),
  role: z.enum(['user', 'admin']).default('user'),
});

// Type inference from schema
export type CreateUserInput = z.infer<typeof UserSchema>;
```

## 🚀 Performance Optimizations

### 1. **Code Splitting & Dynamic Imports**

```typescript
// Dynamic imports for client components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <SkeletonLoader />,
  ssr: false,
});

// Route-level code splitting (automatic with App Router)
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <AdminPanelSkeleton />,
});
```

### 2. **Image & Asset Optimization**

```typescript
// Next.js Image component
import Image from 'next/image';

function UserAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="rounded-full"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      priority={false}
    />
  );
}
```

### 3. **Caching Strategies**

```typescript
// TanStack Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

// Next.js caching with fetch
async function getUsers(): Promise<User[]> {
  const res = await fetch('https://api.example.com/users', {
    next: {
      revalidate: 300, // 5 minutes
      tags: ['users'],
    },
  });

  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}
```

## 🎯 Mock Data & Environment Configuration

### 1. **Environment Setup**

```bash
# .env.local
NEXT_PUBLIC_MOCK_MODE=true  # Enable mock mode
NEXT_PUBLIC_API_BASE_URL=https://api.example.com  # Real API URL
```

### 2. **Mock Data Layer**

```typescript
// mock/users.ts
import { ApiResponse } from '@/types/api-response';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export const mockUsersResponse: ApiResponse<User[]> = {
  message: 'Users retrieved successfully',
  data: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    },
    // ... more users
  ],
  metadata: {
    total: 10,
    page: 1,
    pageCount: 1,
    limit: 10,
  },
};
```

### 3. **Service Layer with Mock Support**

```typescript
// services/user-service.ts
import { ApiResponse } from '@/types/api-response';
import { mockUsersResponse } from '@/mock/users';

const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export class UserService {
  async getUsers(): Promise<ApiResponse<User[]>> {
    if (isMockMode) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUsersResponse;
    }

    // Real API call
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }

  async createUser(userData: CreateUserInput): Promise<ApiResponse<User>> {
    if (isMockMode) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Simulate creating a user
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
      };
      return {
        message: 'User created successfully',
        data: newUser,
      };
    }

    // Real API call
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
}
```

## 🎨 Component Architecture Patterns

### 1. **Render Props & Children Props**

```typescript
// components/forms/form-wrapper.tsx
interface FormWrapperProps<T> {
  initialValues: T;
  validationSchema: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
  children: (props: FormRenderProps<T>) => React.ReactNode;
}

function FormWrapper<T>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: FormWrapperProps<T>) {
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (values: T) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {children({
        register: form.register,
        errors: form.formState.errors,
        isSubmitting: form.formState.isSubmitting,
        getFieldProps: (field) => ({
          ...form.register(field),
          error: form.formState.errors[field]?.message,
        }),
      })}
    </form>
  );
}
```

### 3. **Error Boundaries**

```typescript
// components/commons/error-boundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Report to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Usage in layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

## 📊 Monitoring & Error Handling

### 1. **Comprehensive Error Handling**

```typescript
// utils/error-handler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    showToast.error(error.message);
    if (!error.isRetryable) {
      // Log to monitoring service
      console.error('Non-retryable error:', error);
    }
  } else if (error instanceof Error) {
    showToast.error('An unexpected error occurred');
    console.error('Unexpected error:', error);
  } else {
    showToast.error('Something went wrong');
    console.error('Unknown error:', error);
  }
};
```

### 2. **Toast Notifications**

```typescript
// components/ui/toaster.tsx
import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export function ToasterProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme as 'light' | 'dark' | 'system'}
      position="top-right"
      richColors
      closeButton
      icons={{
        success: <CheckCircle className="text-green-500" />,
        error: <XCircle className="text-red-500" />,
        warning: <AlertTriangle className="text-yellow-500" />,
        info: <Info className="text-blue-500" />,
      }}
    />
  );
}
```

### 3. **Loading States**

```typescript
// components/commons/loading.tsx
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('animate-spin', sizeClasses[size])}>
      <Loader2 className="w-full h-full" />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
```

## 🧪 Testing Strategy

### 1. **Unit Testing with Jest**

```typescript
// __tests__/hooks/use-debounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/use-debounce';

describe('useDebounce', () => {
  it('should debounce the value', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'updated', delay: 500 });
    });

    expect(result.current).toBe('initial'); // Should not update immediately

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    expect(result.current).toBe('updated');
  });
});
```

### 2. **Component Testing**

```typescript
// __tests__/components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### 3. **E2E Testing with Playwright**

```typescript
// tests/e2e/user-management.spec.ts
import { test, expect } from '@playwright/test';

test('user management flow', async ({ page }) => {
  await page.goto('/dashboard/users');

  // Create user
  await page.click('[data-testid="create-user-button"]');
  await page.fill('[data-testid="user-name"]', 'John Doe');
  await page.fill('[data-testid="user-email"]', 'john@example.com');
  await page.click('[data-testid="submit-button"]');

  // Verify user is created
  await expect(page.locator('text=John Doe')).toBeVisible();
  await expect(page.locator('text=john@example.com')).toBeVisible();

  // Edit user
  await page.click('[data-testid="edit-user"]:first-child');
  await page.fill('[data-testid="user-name"]', 'Jane Doe');
  await page.click('[data-testid="submit-button"]');

  // Verify user is updated
  await expect(page.locator('text=Jane Doe')).toBeVisible();
});
```

This architecture ensures:

- ✅ **Scalability** - Modular structure with clear separation of concerns
- ✅ **Maintainability** - Consistent patterns and comprehensive documentation
- ✅ **Performance** - Optimized loading, caching, and code splitting
- ✅ **Developer Experience** - Type safety, testing utilities, and clear patterns
- ✅ **User Experience** - Loading states, error handling, and optimistic updates
- ✅ **Security** - Authentication, authorization, and input validation

The architecture is designed to handle complex web applications while maintaining clean, maintainable, and performant code that follows Next.js 15 and React 19 best practices.