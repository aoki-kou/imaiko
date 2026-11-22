import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../features/auth/useAuth'
import { PlaceForm } from '../features/places/PlaceForm'
import { PlacesApiError, createPlace } from '../features/places/placesApi'
import type { PlaceInput } from '../features/places/placesApi'
import { mapHomePath } from '../features/shiori/useSelectedPrefecture'

export function PlaceNewPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialPrefecture = searchParams.get('prefecture') ?? ''

  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(input: PlaceInput) {
    if (!token) return

    setErrors([])
    setSubmitting(true)
    try {
      const place = await createPlace(token, input)
      // フォームの履歴を置き換え、戻る操作でフォームに戻らない(二重送信を防ぐ)
      navigate(mapHomePath(place.prefecture), { replace: true })
    } catch (err) {
      setErrors(err instanceof PlacesApiError ? err.errors : ['場所の登録に失敗しました'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader backTo={mapHomePath(initialPrefecture)} backLabel="地図に戻る" title="場所の新規登録" />
      <PlaceForm
        initialValues={{ name: '', prefecture: initialPrefecture, url: '', memo: '' }}
        onSubmit={handleSubmit}
        submitting={submitting}
        errors={errors}
        submitLabel="登録する"
      />
    </PageContainer>
  )
}
