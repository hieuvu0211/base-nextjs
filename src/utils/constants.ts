export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
  },
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    UPDATE: '/posts/:id',
    DELETE: '/posts/:id',
  },
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
} as const
