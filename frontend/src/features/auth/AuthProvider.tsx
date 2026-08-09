import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthStatus } from './AuthContext'
import * as authApi from './authApi'
import type { AuthUser } from './authApi'
import { clearStoredToken, getStoredToken, setStoredToken } from './authStorage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = getStoredToken()
    if (!storedToken) {
      setStatus('unauthenticated')
      return
    }

    authApi
      .fetchCurrentUser(storedToken)
      .then((currentUser) => {
        setToken(storedToken)
        setUser(currentUser)
        setStatus('authenticated')
      })
      .catch(() => {
        clearStoredToken()
        setStatus('unauthenticated')
      })
  }, [])

  async function login(email: string, password: string) {
    const { token: newToken, user: loggedInUser } = await authApi.login(email, password)
    setStoredToken(newToken)
    setToken(newToken)
    setUser(loggedInUser)
    setStatus('authenticated')
  }

  async function register(email: string, password: string, passwordConfirmation: string) {
    const { token: newToken, user: registeredUser } = await authApi.register(
      email,
      password,
      passwordConfirmation,
    )
    setStoredToken(newToken)
    setToken(newToken)
    setUser(registeredUser)
    setStatus('authenticated')
  }

  async function logout() {
    if (token) {
      await authApi.logout(token).catch(() => undefined)
    }
    clearStoredToken()
    setToken(null)
    setUser(null)
    setStatus('unauthenticated')
  }

  return (
    <AuthContext.Provider value={{ status, user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
