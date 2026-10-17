import { useAuth } from '../features/auth/useAuth'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Logo } from './ui/Logo'
import { PageContainer } from './ui/PageContainer'

export function AuthErrorScreen() {
  const { retry } = useAuth()

  return (
    <PageContainer>
      <div className="mb-8">
        <Logo tagline />
      </div>
      <Card role="alert" className="text-center">
        <p className="font-bold text-brand-text">サーバーに接続できませんでした</p>
        <p className="mt-2 text-sm text-brand-muted">
          通信環境を確認して、もう一度お試しください。
        </p>
        <Button type="button" onClick={retry} className="mt-4 w-full">
          再試行
        </Button>
      </Card>
    </PageContainer>
  )
}
