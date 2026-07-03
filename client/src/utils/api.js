/**
 * api.js — thin fetch wrapper.
 * Base URL comes from Vite proxy in dev (/api → localhost:5000)
 * and from VITE_API_URL env var in production.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData

  const headers = { ...options.headers }
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  if (isFormData) {
    delete headers['Content-Type']
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    credentials: 'include', // sends httpOnly cookies for admin auth
    ...options,
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(json.message || 'Something went wrong', res.status)
  }

  return json
}

export const api = {
  get: (path, options = {}) => request(path, { method: 'GET', ...options }),
  post: (path, body, options = {}) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  put: (path, body, options = {}) =>
    request(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  patch: (path, body, options = {}) =>
    request(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  delete: (path, options = {}) => request(path, { method: 'DELETE', ...options }),
}
