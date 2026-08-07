import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

type HealthStatus = 'loading' | 'ok' | 'error'

function App() {
  const [status, setStatus] = useState<HealthStatus>('loading')

  useEffect(() => {
    fetch(`${API_BASE_URL}/up`)
      .then((res) => setStatus(res.ok ? 'ok' : 'error'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main>
      <h1>イマイコ(仮)</h1>
      <p>
        バックエンドAPI({API_BASE_URL})との疎通確認:{' '}
        {status === 'loading' && '確認中...'}
        {status === 'ok' && '接続成功'}
        {status === 'error' && '接続失敗'}
      </p>
    </main>
  )
}

export default App
