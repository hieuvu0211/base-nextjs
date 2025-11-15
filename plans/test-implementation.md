# Test Implementation Plan

## Overview

Tạo một hệ thống testing comprehensive để demo tất cả states của Next.js 15 application.

## Phase 1: Foundation & Loading States ✅

### 1.1 Main Test Hub ✅

- [x] Tạo test hub với navigation cards
- [x] Layout với breadcrumbs
- [x] Status indicators cho routes

### 1.2 Common Components Implementation ✅

- [x] **CommonButton Component** (`src/components/commons/common-button.tsx`)
  - Multiple variants: primary, secondary, outline, ghost
  - Loading states with spinner animation
  - Disabled states
  - Size variants: sm, md, lg
  - Full width option
  - Left and right icon support
  - Status animations (success, error, warning)
  - Hover and tap animations with Framer Motion

- [x] **CommonInput Component** (`src/components/commons/common-input.tsx`)
  - Multiple input types: text, email, password, search, number, tel, url, date, time
  - Variant styles: default, filled, outlined
  - Size variants: sm, md, lg
  - Label and hint support
  - Error state handling
  - Disabled state
  - Required field indicator
  - Password toggle visibility
  - Search icon integration
  - Focus animations and state transitions

- [x] **CommonTable Component** (`src/components/commons/common-table.tsx`)
  - Built with TanStack Table for performance
  - Pagination support with manual mode
  - Row selection functionality
  - Index column option
  - Custom column definitions
  - Loading state with spinner
  - Empty state with illustration
  - Responsive design with horizontal scroll
  - Row click and double click handlers
  - Tab support for multiple views
  - Footer with navigation controls

- [x] **CommonModal Component** (`src/components/commons/common-modal.tsx`)
  - Multiple size variants: sm, md, lg, xl
  - Backdrop click handling (configurable)
  - Title and close button support
  - Smooth animations with Framer Motion
  - Body scroll lock when open
  - Proper accessibility features
  - Custom className support

- [x] **Components Test Page** (`/test/common-components`)
  - Interactive demo of all common components
  - Button variants and states showcase
  - Input types and validation examples
  - Table with sample data and interactions
  - Modal integration example
  - Form submission handling

### 1.3 Loading States Implementation ✅

- [x] Page-level loading (`/test/loading-states/page-level`)
  - Full page skeleton loader
  - Loading overlay with backdrop
  - Progressive loading sequence
  - Loading timeout scenarios

- [x] Component-level loading (`/test/loading-states/component-level`)
  - Individual component skeletons
  - Button loading states (loading spinner)
  - Card skeleton patterns
  - Form field loading states

- [x] Nested loading states (`/test/loading-states/nested`)
  - Parent/child loading coordination
  - Sequential loading patterns
  - Parallel loading with individual states
  - Loading state propagation

## Phase 2: Data Fetching & CRUD Operations

### 2.1 User Management Testing

- [x] User List (`/test/data-fetching/users`) - ⚠️ Placeholder created
  - Paginated user list (10 items per page)
  - Loading skeleton for table rows
  - Empty state illustration
  - Error state with retry button
  - Search/filter functionality with debouncing
  - Sorting capabilities

- [x] User Creation (`/test/data-fetching/users/create`) - ⚠️ Placeholder created
  - Multi-field form with real-time validation
  - Button states: idle, loading, success, error
  - Form submission with optimistic updates
  - Validation error display
  - Success confirmation with navigation

- [ ] User Detail/Edit (`/test/data-fetching/users/[id]`)
  - User detail view with loading states
  - Edit mode toggle
  - Pre-filled form editing
  - Image upload with progress
  - Delete confirmation modal
  - Role-based field visibility

### 2.2 Post Management Testing

- [ ] Post Feed (`/test/data-fetching/posts`)
  - Infinite scroll with Intersection Observer
  - Virtual scrolling for performance
  - Loading indicator at bottom
  - Error boundary for individual posts
  - Pull-to-refresh functionality
  - Offline detection

- [ ] Post Creation (`/test/data-fetching/posts/create`)
  - Rich text editor with auto-save
  - Tag input with suggestions
  - Image upload with drag-drop
  - Draft saving functionality
  - Publishing with validation

## Phase 3: Error Scenarios & Recovery

### 3.1 Network Errors (`/test/error-scenarios/network`) ✅

- [x] Connection timeout simulation
- [x] Offline mode detection
- [x] Network interruption simulation
- [x] Retry mechanisms with exponential backoff
- [x] Cached data fallback
- [x] Automatic reconnection

### 3.2 Validation Errors (`/test/error-scenarios/validation`) ✅

- [x] Real-time field validation
- [x] Cross-field validation
- [ ] Async validation (username/email uniqueness)
- [ ] File validation (size, type, dimensions)
- [x] Custom validation rules
- [x] Multiple error display patterns

### 3.3 Server Errors (`/test/error-scenarios/server`) ✅

- [x] 400 Bad Request examples
- [x] 401 Unauthorized with token refresh
- [x] 403 Forbidden scenarios
- [x] 404 Not Found handling
- [x] 429 Rate limiting
- [x] 500 Internal Server Error
- [x] Maintenance mode simulation

## Phase 4: Advanced Form Patterns

### 4.1 Complex User Form (`/test/forms/create-user`) ✅ - ⚠️ Placeholder created

- [x] Multi-step wizard with progress bar
- [x] Conditional field logic
- [ ] Form state persistence
- [ ] Auto-save to localStorage
- [x] Form data preview before submit
- [ ] File upload with preview
- [ ] Address autocomplete
- [ ] Date range picker
- [ ] Phone number formatting

### 4.2 Multi-Step Form (`/test/forms/multi-step`) ✅ - ⚠️ Placeholder created

- [x] Step validation guards
- [x] Back/forward navigation
- [x] Step completion tracking
- [x] Form data accumulation
- [x] Save progress indicator
- [x] Summary before final submission
- [x] Form abandonment handling

## Phase 5: Mock Controls & Debugging

### 5.1 Mock Dashboard (`/test/mock-controls`) ✅ - ⚠️ Basic implementation

- [x] Toggle mock mode on/off
- [x] API delay controller (0-10s)
- [x] Error injection panel
- [ ] Data manipulation tools
- [ ] Session management
- [x] Request/response logger
- [ ] Performance metrics display

### 5.2 State Debugging

- [ ] Zustand store inspector
- [ ] TanStack Query cache viewer
- [ ] React component tree
- [ ] Network request monitor
- [ ] LocalStorage viewer

## Detailed Implementation Requirements

### Loading States to Implement

#### Page-Level Loading

```typescript
// Full page skeleton
- Header skeleton
- Sidebar skeleton
- Content skeleton with multiple cards
- Loading bar at top
- Backdrop with blur effect
- Loading percentage indicator
```

#### Component Loading

```typescript
// Button states
- Default state
- Loading state (spinner + disabled)
- Success state (checkmark)
- Error state (x icon)
- Disabled state

// Card skeleton
- Avatar placeholder
- Title skeleton lines
- Text skeleton lines
- Button skeleton
```

### Error States to Implement

#### Network Errors

- Connection timeout after 10s
- Network unreachable (offline)
- DNS resolution failure
- CORS errors
- Request aborted

#### Server Errors

- 400: Validation error with field-specific messages
- 401: Login required with redirect
- 403: Permission denied with lock icon
- 404: Not found with illustration
- 429: Too many requests with countdown
- 500: Server error with retry button

### Form States to Implement

#### Submission States

1. **Idle**: Form ready for input
2. **Validating**: Real-time validation feedback
3. **Submitting**: Loading spinner + disabled form
4. **Success**: Checkmark + success message + redirect
5. **Error**: Error messages + field highlighting

#### Validation Feedback

- Inline field errors
- Field border color changes
- Helper text updates
- Error shake animation
- Success checkmarks
- Warning indicators

### Mock Data Requirements

#### Extended User Data

```typescript
const testUsers = {
  // Normal cases
  regularUsers: [...existing],

  // Edge cases
  veryLongName: { name: 'A'.repeat(100) },
  specialChars: { name: '!@#$%^&*()' },
  noAvatar: { avatar: null },
  emptyFields: { name: '', email: '' },

  // Performance
  largeDataset: Array(1000).fill(userTemplate),

  // Error cases
  invalidEmail: { email: 'invalid-email' },
  duplicateEmail: { email: 'duplicate@test.com' },
}
```

#### Error Response Templates

```typescript
const errorResponses = {
  networkError: {
    code: 'NETWORK_ERROR',
    message: 'Unable to connect to server',
    retryable: true,
  },
  validationError: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: [
      { field: 'email', message: 'Invalid email format' },
      { field: 'name', message: 'Name is required' },
    ],
  },
  serverError: {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong',
    retryable: false,
  },
}
```

## Implementation Checklist

For each test page:

### Navigation

- [ ] Breadcrumb navigation
- [ ] Back/next buttons where applicable
- [ ] Navigation guards for unsaved changes

### State Management

- [ ] Loading states clearly visible
- [ ] Error states with recovery options
- [ ] Success states with confirmation
- [ ] Empty states with CTAs

### Accessibility

- [ ] ARIA labels for loading states
- [ ] Screen reader support
- [ ] Keyboard navigation
- [ ] Focus management

### Performance

- [ ] Lazy loading for heavy components
- [ ] Code splitting for large features
- [ ] Image optimization
- [ ] Bundle size optimization

### Responsiveness

- [ ] Mobile layout support
- [ ] Tablet optimization
- [ ] Desktop experience
- [ ] Loading states on all screen sizes

## Success Criteria

After implementation, users should be able to:

1. **See all loading states** - From micro to macro level
2. **Test error handling** - With recovery mechanisms
3. **Validate forms** - Real-time and on submit
4. **Navigate seamlessly** - Between test scenarios
5. **Debug state** - With proper tools and visibility
6. **Experience performance** - Optimized loading and caching
7. **Control mock scenarios** - Toggle between real/fake data

## Next Steps

1. Implement Phase 1 loading states
2. Build TanStack Query integration hooks
3. Create reusable loading components
4. Implement error boundary system
5. Add form validation patterns
6. Create mock control dashboard
7. Document all patterns and best practices

---

_This plan ensures comprehensive coverage of all application states and provides a robust testing foundation for the Next.js 15 application._
