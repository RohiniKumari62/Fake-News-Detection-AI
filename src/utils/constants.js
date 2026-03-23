export const LABELS = {
  FAKE: 'FAKE',
  REAL: 'REAL',
  UNCERTAIN: 'UNCERTAIN',
}

export const INPUT_TYPES = {
  TEXT: 'text',
  URL: 'url',
  IMAGE: 'image',
}

export const CHAR_LIMIT = 3000
export const HISTORY_LIMIT = 100
export const RECENT_TABLE_LIMIT = 6

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ANALYZE: '/analyze',
  DASHBOARD: '/dashboard',
  HISTORY: '/history',
  SETTINGS: '/settings',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email',
  NOT_FOUND: '*',
}

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

export const TOAST_DURATION = 4000

export const API_ENDPOINTS = {
  ANALYZE: '/analyze',
  HISTORY: '/history',
  STATS: '/stats',
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_RESET: '/auth/reset-password',
  AUTH_VERIFY: '/auth/verify-email',
  USER_PROFILE: '/user/profile',
}

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 50,
  LOW: 0,
}

export const FILTER_LABELS = ['ALL', LABELS.REAL, LABELS.FAKE, LABELS.UNCERTAIN]