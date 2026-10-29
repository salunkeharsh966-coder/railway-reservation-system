import axios from 'axios'

// In development the Vite proxy forwards /api to the backend, so a relative
// base URL works. In production set VITE_API_BASE_URL to the deployed API.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach the logged-in user id as a header so the backend can identify the
// caller. This is a simple academic stand-in for a real JWT.
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('railway_user')
  if (stored) {
    try {
      const user = JSON.parse(stored)
      if (user?.userId) config.headers['X-User-Id'] = user.userId
    } catch {
      /* ignore malformed storage */
    }
  }
  return config
})

// Normalise error messages so every page can show err.message directly.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    let message = data?.message || error.message || 'Something went wrong'
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      if (first) message = first
    }
    return Promise.reject(new Error(message))
  },
)

export default api
