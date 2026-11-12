const MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

// 本番ビルドかつ測定IDが設定されている場合のみGA4を読み込む(開発サーバーでは計測しない)。
// SPAの画面遷移はGA4の拡張計測機能(ブラウザの履歴イベントに基づくページの変更)で計測するため、
// ページビューを手動で送信しない(手動送信すると二重計測になる)
export function initGoogleAnalytics() {
  if (!import.meta.env.PROD || !MEASUREMENT_ID) return

  window.dataLayer = window.dataLayer || []
  // gtag.jsはargumentsオブジェクトそのものを受け取る前提のため、配列化(rest引数)せずにpushする
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
  document.head.appendChild(script)
}
