import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FormErrors } from '../components/ui/FormErrors'
import { Input } from '../components/ui/Input'
import { Logo } from '../components/ui/Logo'
import { PageContainer } from '../components/ui/PageContainer'
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
    <PageContainer>
      <div className="mb-8">
        <Logo tagline />
      </div>
      <h1 className="mb-4 text-lg font-bold text-brand-text">会員登録</h1>
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
        <Input
          id="password-confirmation"
          label="パスワード(確認)"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <FormErrors errors={errors} />
        <Button type="submit" disabled={submitting} className="w-full">
          登録する
        </Button>
      </form>
      <p className="mt-4 text-sm text-brand-muted">
        アカウントをお持ちの方は{' '}
        <Link to="/login" className="text-brand-primary hover:underline">
          ログイン
        </Link>
      </p>
    </PageContainer>
  )
}
