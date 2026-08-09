export type AuthUser = {
  id: number
  email: string
}

export class AuthApiError extends Error {
  status: number
  errors: string[]

  constructor(status: number, errors: string[]) {
    super(errors[0] ?? 'リクエストに失敗しました')
    this.status = status
    this.errors = errors
  }
}

type AuthErrorPayload = {
  errors?: string[]
  error?: string
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

function extractErrors(payload: AuthErrorPayload): string[] {
  if (payload.errors?.length) return payload.errors
  if (payload.error) return [payload.error]
  if (payload.message) return [payload.message]
  return ['リクエストに失敗しました']
}

async function parseAuthResponse(res: Response): Promise<{ token: string; user: AuthUser }> {
  const body = await res.json()

  if (!res.ok) {
    throw new AuthApiError(res.status, extractErrors(body as AuthErrorPayload))
  }

  const token = res.headers.get('Authorization')
  if (!token) {
    throw new AuthApiError(res.status, ['認証トークンの取得に失敗しました'])
  }

  return { token, user: (body as { user: AuthUser }).user }
}

export async function register(
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      user: { email, password, password_confirmation: passwordConfirmation },
    }),
  })
  return parseAuthResponse(res)
}

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_BASE_URL}/users/sign_in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ user: { email, password } }),
  })
  return parseAuthResponse(res)
}

export async function logout(token: string): Promise<void> {
  await fetch(`${API_BASE_URL}/users/sign_out`, {
    method: 'DELETE',
    headers: { Authorization: token, Accept: 'application/json' },
  })
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/current_user`, {
    headers: { Authorization: token, Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new AuthApiError(res.status, ['認証情報の取得に失敗しました'])
  }
  return res.json() as Promise<AuthUser>
}
