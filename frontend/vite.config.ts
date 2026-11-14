import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * @fontsource のフォント定義CSSから、WOFF(旧形式)の予備指定を取り除く。
 * 対象ブラウザはすべてWOFF2に対応しているため、WOFFは参照されず配信物にも含まれなくなる。
 */
function fontsourceWoff2Only(): Plugin {
  return {
    name: 'imaiko:fontsource-woff2-only',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/@fontsource/') || !id.endsWith('.css')) return
      return code.replace(/,\s*url\([^)]+\.woff\)\s*format\(['"]woff['"]\)/g, '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [fontsourceWoff2Only(), react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    // フォントはCSSに埋め込まず、必要な文字を含むファイルだけを個別に取得させる。
    // それ以外のアセットは undefined を返して既定(4KB未満は埋め込み)のままにする
    assetsInlineLimit: (filePath) => (/\.woff2?$/.test(filePath) ? false : undefined),
  },
})
