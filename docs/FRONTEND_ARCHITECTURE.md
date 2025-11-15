# Frontend Architecture Documentation

## 🏗️ Architecture Overview

This document outlines the frontend architecture Management application built with Next.js 15, React 19, and React Query.

## 🎯 Core Architectural Principles

### 1. **Server-First Architecture with Client Capabilities**

- **Server Components by Default**: Leverage Next.js 15 App Router server components
- **Client Components When Needed**: Mark with `"use client"` for interactivity
- **Progressive Enhancement**: Start with server-rendered, enhance with client-side features

### 2. **Data Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Components     │───▶│  React Query     │───▶│    Services     │
│                  │    │     Hooks       │    │                 │
│ - UI Components  │    │ - useModel       │    │ - authService   │
│ - Pages          │    │ - useModelCrud   │    │ - modelService  │
│ - Layouts         │    │ - useAuth        │    │ - API Layer     │
│ - Live2D Viewer  │    │ - useAuthCrud     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│    User UI       │    │   Query Cache    │    │    Backend      │
│                  │    │                  │    │                 │
│ - Tables         │    │ - Optimistic      │    │ - REST API      │
│ - Forms          │    │   Updates        │    │ - File Upload    │
│ - Live2D Models  │    │ - Background      │    │ - Auth Service  │
│ - Toast Messages │    │   Refetching      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 3. **Layer-Based Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                         │
├─────────────────────────────────────────────────────────────┤
│ • UI Components (Button, Table, List, etc.)                    │
│ • Live2D Components (Viewer, Manager, Wrapper)               │
│ • Pages (Next.js App Router)                                   │
│ • Layouts (Root Layout with Live2D scripts)                     │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                         │
├─────────────────────────────────────────────────────────────┤
│ • React Query Hooks (data fetching & state)                  │
│   - Size-based organization (200 lines max)                   │
│ • Custom Hooks (domain logic)                                  │
│ • Guards (authorization & permissions)                         │
│ • Error Analysis System                                        │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                               │
├─────────────────────────────────────────────────────────────┤
│ • API Services (auth, models)                                 │
│ • Toast Notifications (Sonner)                                │
│ • Error Handling                                               │
│ • Live2D Cubism Integration                                   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                            │
├─────────────────────────────────────────────────────────────┤
│ • Axios Configuration with interceptors                         │
│ • API Endpoints                                               │
│ • Type Definitions                                           │
│ • Environment Configuration                                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack

### Core Framework

- **Next.js 15.5.6** - React framework with App Router
- **React 19.2.0** - UI library with Server Components
- **TypeScript** - Static typing (strict mode)

### Data & State Management

- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form state management
- **React Context** - Theme management (next-themes)

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **next-themes** - Theme management

### Live2D Integration

- **Live2D Cubism SDK** - 2D/3D model rendering
- **Custom Live2D Components** - Wrappers and utilities

### Development Tools

- **ESLint** - Code linting (unused vars disabled)
- **Prettier** - Code formatting
- **Husky** - Git hooks (conventional commits)

## 📁 Current Project Structure (2024)

```
live-2d-model/
├── src/                                    # Source code directory
│   ├── app/                               # Next.js 15 App Router
│   │   ├── globals.css                    # Global styles
│   │   ├── layout.tsx                     # Root layout with Live2D scripts
│   │   └── page.tsx                       # Home page
│   │
│   ├── components/                        # Reusable components
│   │   ├── ui/                             # Base UI components (7 components)
│   │   │   ├── Button.tsx                  # Button with variants
│   │   │   ├── EmptyState.tsx             # Empty state display
│   │   │   ├── ErrorBoundary.tsx          # Error catching wrapper
│   │   │   ├── List.tsx                    # List with pagination/infinite
│   │   │   ├── Skeleton.tsx                # Loading skeleton component
│   │   │   ├── Table.tsx                   # Table with pagination
│   │   │   ├── Toast.tsx                   # Sonner toast provider
│   │   │   └── index.ts                    # UI exports
│   │   │
│   │   └── Live2D/                         # Live2D specific components
│   │       ├── FloatingActionPanel.tsx    # Action panel component
│   │       ├── Live2DManager.tsx          # Live2D state manager
│   │       ├── Live2DViewer.tsx           # Live2D model viewer
│   │       ├── Live2DWrapper.tsx          # Live2D integration wrapper
│   │       └── modelConfig.ts              # Live2D configuration
│   │
│   ├── hooks/                              # Custom React hooks
│   │   ├── api/                            # React Query API hooks (7 hooks)
│   │   │   ├── index.ts                    # Central hook exports
│   │   │   ├── queries/                    # Query hooks
│   │   │   │   ├── useAuthQuery.ts         # Auth queries (190 lines)
│   │   │   │   ├── useModel.ts              # Single model (80 lines)
│   │   │   │   └── useModelList.ts         # Model list (120 lines)
│   │   │   └── mutations/                  # Mutation hooks
│   │   │       ├── useAuthCrud.ts          # Auth CRUD (110 lines)
│   │   │       ├── useAuthActions.ts       # Auth actions (140 lines)
│   │   │       ├── useModelCrud.ts         # Model CRUD (140 lines)
│   │   │       └── useModelActions.ts      # Model actions (130 lines)
│   │   │
│   │   ├── global/                         # Global application hooks
│   │   │   ├── useAuth.ts                  # Combined auth hook
│   │   │   └── index.ts                    # Global exports
│   │   │
│   │   ├── useBackgroundMode.ts            # Background mode hook
│   │   ├── useGuard.ts                     # Permission guard hook
│   │   ├── usePerformance.ts               # Performance optimization
│   │   └── index.ts                        # Hook exports
│   │
│   ├── guards/                             # Route and component guards
│   │   ├── Guard.tsx                       # Main guard component
│   │   ├── GuardChecker.tsx                # Guard verification
│   │   ├── GuardConfig.ts                  # Guard configuration
│   │   └── index.ts                        # Guard exports
│   │
│   ├── lib/                                # Utility libraries
│   │   ├── errorAnalyzer.ts                # Error analysis system
│   │   ├── toast.ts                        # Sonner toast utilities
│   │   ├── utils.ts                        # General utilities
│   │   └── api.ts                          # API configuration
│   │
│   ├── services/                           # External service integrations
│   │   ├── api/                            # API layer
│   │   │   ├── axios.ts                    # Axios with interceptors
│   │   │   ├── endpoints.ts                # API endpoints
│   │   │   └── types.ts                    # API type definitions
│   │   │
│   │   ├── authService.ts                 # Authentication service
│   │   └── modelService.ts                # Model management service
│   │
│   └── config/                             # Application configuration
│       └── env.ts                          # Environment variables
│
└── docs/                                   # Complete documentation
```

## 🔧 Hook Architecture Details

### 1. **Size-Based Hook Organization**

The hook structure follows a clear size-based approach:

```typescript
// Organization Rules:
if (fileSize < 200) {
  // Keep as single file
  // Example: useAuthQuery.ts (190 lines) - All auth queries together
} else if (fileSize > 200) {
  // Split by domain/functionality
  // Example: useModelsQuery.ts (263 lines) → Split into:
  //   - useModel.ts (80 lines) - Single model operations
  //   - useModelList.ts (120 lines) - List operations
}
```

### 2. **Hook Pattern Examples**

#### Single Hook Pattern (Preferred)

```typescript
// useAuthQuery.ts - Keeps related queries together
export const useAuth = (options: UseAuthProps) => {
  const user = useQuery({ enabled: options.include.user });
  const preferences = useQuery({ enabled: options.include.preferences });
  const permissions = useQuery({ enabled: !!options.permission });
  const stats = useQuery({ enabled: options.include.stats });

  return { user, preferences, permissions, stats };
};
```

#### Split Hook Pattern

```typescript
// Split by functionality when file is too large
// useModel.ts - Single model operations
export const useModel = ({ modelId, includeExpressions }) => {
  const model = useQuery({ enabled: !!modelId });
  const expressions = useQuery({ enabled: !!modelId && includeExpressions });
  // ...
};

// useModelList.ts - List operations
export const useModelList = ({ page, infinite }) => {
  const models = useQuery({ enabled: !infinite });
  const infiniteModels = useInfiniteQuery({ enabled: infinite });
  // ...
};
```

### 3. **Mutation Separation**

```typescript
// CRUD operations - Basic operations
useModelCrud(); // create, update, delete, updateConfig
useAuthCrud(); // login, register, logout, updateProfile

// Actions - Complex operations and preferences
useModelActions(); // rate, download, favorite, batch operations
useAuthActions(); // changePassword, updatePreferences, verifyEmail
```

## 🔄 Data Flow Patterns

### 1. **Query Data Flow**

```typescript
// Component requests data
function ModelList() {
  const { models, isLoading, error, fetchNextPage } = useModelList({
    page: 1,
    infinite: true,
    search: 'anime'
  });

  // Automatic loading states
  if (isLoading) return <Skeleton />;

  // Automatic error handling
  if (error) return <ErrorDisplay error={error} />;

  // Optimistic updates via mutations
  const { remove } = useModelCrud({
    onSuccess: () => showToast.success('Model deleted!')
  });

  return (
    <InfiniteList
      models={models}
      onLoadMore={fetchNextPage}
      onDelete={remove}
    />
  );
}
```

### 2. **Mutation Pattern with Optimistic Updates**

```typescript
// Mutation with optimistic update
const updateModel = useModelCrud({
  onMutate: async newData => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ["models"] });

    // Save previous state
    const previous = queryClient.getQueryData(["models"]);

    // Optimistic update
    queryClient.setQueryData(["models"], old => ({
      ...old,
      data: old.data.map(model =>
        model.id === newData.id ? { ...model, ...newData } : model
      ),
    }));

    return { previous };
  },
  onError: (error, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(["models"], context.previous);
    showToast.error(`Failed to update: ${error.message}`);
  },
  onSuccess: data => {
    // Success notification
    showToast.success("Model updated successfully!");
  },
});
```

### 3. **Live2D Integration Flow**

```typescript
// Live2D data flow
function Live2DWrapper({ modelId, expressions }) {
  // Get model data
  const { model } = useModel({ modelId });

  // Get expressions data
  const { data: expressions } = useModel({
    modelId,
    includeExpressions: true
  });

  // State management for Live2D
  const { currentExpression, setExpression } = useLive2DState();

  // Expression updates with optimistic updates
  const { updateExpressions } = useModelActions({
    onSuccess: (data) => {
      // Update Live2D model immediately
      setExpression(data.expressions[0]);
      showToast.success("Expressions updated!");
    }
  });

  return (
    <Live2DViewer
      model={model?.fileUrl}
      expressions={expressions}
      currentExpression={currentExpression}
      onExpressionChange={setExpression}
    />
  );
}
```

## 🔒 Security Architecture

### 1. **Authentication Flow**

```typescript
// Login flow
const login = useAuthCrud({
  onSuccess: ({ user, tokens }) => {
    // Store tokens automatically
    showToast.success(`Welcome back, ${user.name}!`);
    // Redirect to dashboard
    window.location.href = "/dashboard";
  },
  onError: error => {
    // Clear tokens on failed login
    authService.clearTokens();
    showToast.error("Invalid credentials");
  },
});
```

### 2. **Authorization with Guards**

```typescript
// Route-level protection
<Guard requireAuth>
  <Dashboard />
</Guard>

// Role-based protection
<Guard requireAuth roles={["admin"]}>
  <AdminPanel />
</Guard>

// Permission-based protection
<Guard permissions={["model:create"]}>
  <CreateModelButton />
</Guard>
```

### 3. **API Security**

```typescript
// JWT token management
- Automatic token refresh
- Token storage in httpOnly cookies
- Request interceptor adds Authorization header
- Response interceptor handles 401/403 errors
```

## 🚀 Performance Optimizations

### 1. **Code Splitting**

```typescript
// Dynamic imports for large components
const Live2DViewer = dynamic(() => import('./Live2DViewer'), {
  loading: () => <Live2DSkeleton />,
  ssr: false // Important for Live2D components
});
```

### 2. **Data Caching Strategy**

```typescript
// React Query cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Better UX
    },
  },
});
```

### 3. **Bundle Optimization**

```typescript
// Next.js automatic optimizations
- Route-based code splitting
- Dynamic imports for heavy components
- Tree shaking for unused code
- Minification and compression
- Live2D scripts loaded before interaction
```

## 🎨 Component Architecture Patterns

### 1. **Compound Components**

```typescript
// Reusable table component
<Table
  data={models}
  columns={columns}
  pagination={{ page, limit, total }}
  loading={isLoading}
  onRowClick={handleRowClick}
  actions={
    <Button onClick={handleEdit}>Edit</Button>
  }
/>
```

### 2. **Hook Composition**

```typescript
// Combine multiple hooks
function useModelManagement(modelId) {
  const model = useModel({ modelId });
  const { update, remove } = useModelCrud({ modelId });
  const { rate, favorite } = useModelActions();

  return {
    model,
    updateModel: update.mutate,
    deleteModel: remove.mutate,
    rateModel: rate.mutate,
    toggleFavorite: favorite.mutate,
  };
}
```

### 3. **Error Boundaries**

```typescript
// Error boundary with error analysis
function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallback={<ErrorDisplay />}
      onError={(error, errorInfo) => {
        const analysis = ErrorAnalyzer.analyzeError(error);
        reportError({ error, analysis });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## 📊 Monitoring & Error Handling

### 1. **Error Analysis System**

```typescript
// Comprehensive error analysis
const analysis = ErrorAnalyzer.analyzeError(error);
// Returns:
// - code: ErrorCode
// - message: User-friendly message
// - severity: ErrorSeverity
// - category: ErrorCategory
// - isRetryable: boolean
// - suggestions: string[]
```

### 2. **Toast Notifications**

```typescript
// Sonner toast with theme support
<Toaster
  theme={theme}
  icons={{
    success: <CircleCheck className="text-green-500" />,
    error: <OctagonX className="text-red-500" />,
    loading: <LoaderCircle className="animate-spin" />
  }}
/>
```

This architecture ensures:

- ✅ **Scalability** - Size-based hook organization
- ✅ **Maintainability** - Clear separation of concerns
- ✅ **Performance** - Optimistic updates, caching, code splitting
- ✅ **Developer Experience** - Clean imports, comprehensive docs
- ✅ **User Experience** - Loading states, error handling, optimistic updates
- ✅ **Type Safety** - Full TypeScript coverage

The architecture is designed to handle complex Live2D model management while maintaining clean, maintainable code.
