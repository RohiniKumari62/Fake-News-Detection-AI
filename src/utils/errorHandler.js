export const parseError = (error) => {
  if (!error) return 'An unexpected error occurred.'

  if (typeof error === 'string') return error

  if (error?.response?.data?.message) return error.response.data.message
  if (error?.response?.data?.detail) return error.response.data.detail
  if (error?.response?.data?.error) return error.response.data.error

  const status = error?.response?.status
  if (status) {
    const HTTP_MESSAGES = {
      400: 'Bad request. Please check your input.',
      401: 'Session expired. Please sign in again.',
      403: 'You do not have permission to do that.',
      404: 'Resource not found.',
      422: 'Validation error. Please check your input.',
      429: 'Too many requests. Please slow down.',
      500: 'Server error. Please try again later.',
      502: 'Service unavailable. Please try again later.',
      503: 'Service temporarily down. Please try again later.',
    }
    return HTTP_MESSAGES[status] || `Request failed with status ${status}.`
  }

  if (error?.message === 'Network Error') return 'Network error. Check your connection.'
  if (error?.message?.includes('timeout')) return 'Request timed out. Please try again.'
  if (error?.message) return error.message

  return 'Something went wrong. Please try again.'
}

export const isAuthError = (error) => error?.response?.status === 401

export const isNetworkError = (error) =>
  !error?.response && error?.message === 'Network Error'

export const isValidationError = (error) =>
  error?.response?.status === 400 || error?.response?.status === 422