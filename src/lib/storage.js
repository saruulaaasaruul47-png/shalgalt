import { STORAGE_KEYS } from './constants'

export function getSession() {
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEYS.SESSION)
    return null
  }
}

export function saveSession(user) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION)
}
