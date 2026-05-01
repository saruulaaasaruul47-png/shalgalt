import { API_BASE_URL } from '../lib/constants'

function buildUrl(path) {
  return `${API_BASE_URL}${path}`
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = `API request failed: ${response.status}`
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export function queryBuilder(basePath, query = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}
