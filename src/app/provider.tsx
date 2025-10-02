'use client'

import type React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import TopLoader from 'nextjs-toploader'
import { Loading } from '@/components/commons/loading'

export function QueryProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            gcTime: 1000 * 60 * 60, // 1 hour
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TopLoader showSpinner={false} color="#22C566" zIndex={9999} height={3} />
      {children}
      <Loading />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}
