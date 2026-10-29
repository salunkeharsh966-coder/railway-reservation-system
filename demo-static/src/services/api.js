import { request } from './mockApi.js'

/**
 * DEMO BUILD ONLY.
 *
 * The real project talks to Spring Boot through axios (see api.http.js).
 * This static demo keeps the exact same call surface - `api.get/post/put/delete`
 * returning `{ data }` and rejecting with an Error whose `.message` is the
 * backend's message - but resolves everything against an in-browser mock.
 *
 * No server, no MySQL, no network. Data lives in localStorage.
 */
const api = {
  get: (url, config) => request('GET', url, config),
  post: (url, data, config) => request('POST', url, { ...config, data }),
  put: (url, data, config) => request('PUT', url, { ...config, data }),
  delete: (url, config) => request('DELETE', url, config),
}

export default api
