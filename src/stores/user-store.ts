import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/types/common'

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface UserStore {
  // User state
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Tokens
  accessToken: string | null
  refreshToken: string | null

  // Preferences
  preferences: UserPreferences

  // Actions
  setUser: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setTokens: (tokens: AuthTokens) => void
  clearTokens: () => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void

  // Auth check
  checkAuth: () => boolean
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
        refreshToken: null,
        preferences: {
          theme: 'system',
          language: 'en',
          notifications: true,
        },

        // Actions
        setUser: (user: User) => {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        },

        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
          })
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        },

        setTokens: (tokens: AuthTokens) => {
          set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          })
        },

        clearTokens: () => {
          set({
            accessToken: null,
            refreshToken: null,
          })
        },

        updatePreferences: (newPreferences: Partial<UserPreferences>) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              ...newPreferences,
            },
          }))
        },

        checkAuth: () => {
          const { accessToken, user } = get()
          const isAuth = !!(accessToken && user)

          // Update auth state
          if (isAuth !== get().isAuthenticated) {
            set({ isAuthenticated: isAuth })
          }

          return isAuth
        },
      }),
      {
        name: 'user-store',
        // Only persist essential data
        partialize: (state) => ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          user: state.user,
          preferences: state.preferences,
        }),
      }
    ),
    {
      name: 'user-store',
    }
  )
)

// Selectors for optimized re-renders
export const useAuth = () =>
  useUserStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: state.user,
  }))

export const useTokens = () =>
  useUserStore((state) => ({
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  }))

export const useUserPreferences = () => useUserStore((state) => state.preferences)

export const useUserActions = () =>
  useUserStore((state) => ({
    setUser: state.setUser,
    logout: state.logout,
    setLoading: state.setLoading,
    setTokens: state.setTokens,
    clearTokens: state.clearTokens,
    updatePreferences: state.updatePreferences,
    checkAuth: state.checkAuth,
  }))
