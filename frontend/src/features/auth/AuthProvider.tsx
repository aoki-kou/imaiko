import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthStatus } from './AuthContext'
import * as authApi from './authApi'
import { AuthApiError } from './authApi'
import type { AuthUser } from './authApi'
import { clearStoredToken, getStoredToken, setStoredToken } from './authStorage'

// Render無料プランのスリープ復帰(コールドスタート)を考慮した待機時間
const SESSION_CHECK_TIMEOUT_MS = 30_000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const checkSession = useCallback(() => {
    const storedToken = getStoredToken()
    if (!storedToken) {
      setStatus('unauthenticated')
      return
    }

    setStatus('loading')
    authApi
      .fetchCurrentUser(storedToken, AbortSignal.timeout(SESSION_CHECK_TIMEOUT_MS))
      .then((currentUser) => {
        setToken(storedToken)
        setUser(currentUser)
        setStatus('authenticated')
      })
      .catch((err) => {
        // トークンが無効と確定できる401のみトークンを破棄する。
        // タイムアウト・通信エラー・401以外のHTTPエラーはサーバー側の一時的な問題の可能性があるため、
        // トークンを保持したまま再試行できるようにする
        if (err instanceof AuthApiError && err.status === 401) {
          clearStoredToken()
          setStatus('unauthenticated')
          return
        }
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

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
    <AuthContext.Provider value={{ status, user, token, login, register, logout, retry: checkSession }}>
      {children}
    </AuthContext.Provider>
  )
}
