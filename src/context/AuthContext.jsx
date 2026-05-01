import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { ROLES } from '../lib/constants'
import { clearSession, getSession, saveSession } from '../lib/storage'
import { apiRequest, queryBuilder } from '../services/apiClient'

export const AuthContext = createContext(null)

function sanitizeUser(user) {
  if (!user) return null
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(session)
    }
    setIsInitializing(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const users = await apiRequest(queryBuilder('/users', { email, password }))
    const foundUser = users?.[0]

    if (!foundUser) {
      throw new Error('Имэйл эсвэл нууц үг буруу байна.')
    }

    if (!foundUser.active) {
      throw new Error('Таны хэрэглэгч админд түр хаагдсан байна.')
    }

    const safeUser = sanitizeUser(foundUser)
    setUser(safeUser)
    saveSession(safeUser)
    return safeUser
  }, [])

  const register = useCallback(async ({ name, email, password, role = ROLES.STUDENT }) => {
    const exists = await apiRequest(queryBuilder('/users', { email }))
    if (exists.length > 0) {
      throw new Error('Ийм имэйлтэй хэрэглэгч аль хэдийн бүртгэлтэй байна.')
    }

    const created = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        active: true,
      }),
    })

    return sanitizeUser(created)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearSession()
  }, [])

  const refreshCurrentUser = useCallback(async () => {
    const session = getSession()
    if (!session?.id) return

    const fresh = await apiRequest(`/users/${session.id}`)
    const safeUser = sanitizeUser(fresh)
    setUser(safeUser)
    saveSession(safeUser)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isInitializing,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshCurrentUser,
      setUser,
    }),
    [isInitializing, login, logout, refreshCurrentUser, register, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
