import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthApiError } from '../features/auth/authApi'
import { useAuth } from '../features/auth/useAuth'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors([])
    setSubmitting(true)
    try {
      await register(email, password, passwordConfirmation)
      navigate('/', { replace: true })
    } catch (err) {
      setErrors(err instanceof AuthApiError ? err.errors : ['会員登録に失敗しました'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <h1>会員登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password-confirmation">パスワード(確認)</label>
          <input
            id="password-confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        {errors.length > 0 && (
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
        <button type="submit" disabled={submitting}>
          登録する
        </button>
      </form>
      <p>
        アカウントをお持ちの方は<Link to="/login">ログイン</Link>
      </p>
    </main>
  )
}
