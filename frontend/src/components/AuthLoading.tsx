import { SlowConnectionNotice } from './SlowConnectionNotice'
import { PageContainer } from './ui/PageContainer'

export function AuthLoading() {
  return (
    <PageContainer>
      <p className="text-center text-brand-muted">読み込み中...</p>
      <SlowConnectionNotice />
    </PageContainer>
  )
}
