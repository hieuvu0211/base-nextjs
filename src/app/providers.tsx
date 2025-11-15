'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if ((error as any)?.status === 404) return false
              return failureCount < 3
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      {children}
    </QueryClientProvider>
  )
}
