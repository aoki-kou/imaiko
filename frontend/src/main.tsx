import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { initGoogleAnalytics } from './features/analytics/googleAnalytics.ts'
import { AuthProvider } from './features/auth/AuthProvider.tsx'

initGoogleAnalytics()

// 見出し用フォント(Shippori Mincho 700、セルフホスト)の定義CSS(約110KB)は、
// 初期表示に必要なCSSから分離して非同期で読み込み、画面の描画を待たせない。
// 定義はunicode-rangeで分割されており、画面に表示する文字を含むWOFF2だけがダウンロードされる。
// 読み込みまではOS標準の明朝体(index.css の --font-display の代替フォント)で表示する
void import('@fontsource/shippori-mincho/700.css')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
