import { createSearchParams, useNavigate } from 'react-router-dom'
import { JapanMap } from '../components/JapanMap'
import { PageContainer } from '../components/ui/PageContainer'
import type { Prefecture } from '../constants/prefectures'

// ロゴ・ログイン中のユーザー・ログアウト・プライバシーポリシーへの導線は共通ナビゲーション(AppLayout)にある
export function PrefectureListPage() {
  const navigate = useNavigate()

  function handleSelectPrefecture(prefecture: Prefecture) {
    navigate({
      pathname: '/places',
      search: createSearchParams({ prefecture }).toString(),
    })
  }

  return (
    <PageContainer>
      <h1 className="mb-2 text-lg font-bold text-brand-text">都道府県を選択</h1>
      <JapanMap onSelectPrefecture={handleSelectPrefecture} />
    </PageContainer>
  )
}
