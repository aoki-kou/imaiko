import { useEffect, useState } from 'react'

const NOTICE_DELAY_MS = 5_000

// マウントから一定時間経過しても処理が続いている場合に、接続中であることを案内する
export function SlowConnectionNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timerId = setTimeout(() => setVisible(true), NOTICE_DELAY_MS)
    return () => clearTimeout(timerId)
  }, [])

  return (
    <p role="status" className="mt-4 min-h-10 text-center text-sm text-brand-muted">
      {visible && (
        <>
          サーバーに接続しています…
          <br />
          しばらくお待ちください
        </>
      )}
    </p>
  )
}
