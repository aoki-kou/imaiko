import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FormErrors } from '../components/ui/FormErrors'
import { Input } from '../components/ui/Input'
import { Logo } from '../components/ui/Logo'
import { PageContainer } from '../components/ui/PageContainer'
import { AuthApiError } from '../features/auth/authApi'
import { useAuth } from '../features/auth/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors([])
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setErrors(err instanceof AuthApiError ? err.errors : ['ログインに失敗しました'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <Logo tagline />
      </div>
      <h1 className="mb-4 text-lg font-bold text-brand-text">ログイン</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormErrors errors={errors} />
        <Button type="submit" disabled={submitting} className="w-full">
          ログイン
        </Button>
      </form>
      <p className="mt-4 text-sm text-brand-muted">
        アカウントをお持ちでない方は{' '}
        <Link to="/register" className="text-brand-primary hover:underline">
          会員登録
        </Link>
      </p>
    </PageContainer>
  )
}
