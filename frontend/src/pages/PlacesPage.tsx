import { Link, useSearchParams } from 'react-router-dom'

export function PlacesPage() {
  const [searchParams] = useSearchParams()
  const prefecture = searchParams.get('prefecture')

  return (
    <main>
      <p>
        <Link to="/">都道府県選択に戻る</Link>
      </p>
      <h1>{prefecture ?? '未選択'}の場所一覧</h1>
      <p>準備中</p>
    </main>
  )
}
