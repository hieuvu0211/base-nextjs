'use client'

import { useRouter } from 'next/navigation'
import nProgress from 'nprogress'

import { useCallback } from 'react'

// Configure nProgress
nProgress.configure({
  showSpinner: false, // Disable the spinner
  speed: 300, // Speed of the progress bar
  minimum: 0.2, // Minimum progress (starts slightly)
})

export const useBaseRouter = () => {
  const router = useRouter()
  // Custom push function to trigger nProgress
  const push = useCallback(
    async (path: string) => {
      try {
        // Start the loading bar when navigation begins
        nProgress.start()

        // Trigger the route change
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        await router.push(path)

        // Once navigation is done, stop the loading bar
      } catch (error) {
        // If there's an error, stop the loading bar as well
        console.error('Failed to navigate:', error)
      }
    },
    [router]
  )

  return { ...router, push }
}
