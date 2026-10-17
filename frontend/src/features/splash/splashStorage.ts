const SPLASH_SHOWN_KEY = 'imaiko_splash_shown'

// sessionStorageが利用できない環境(プライベートブラウズ等)では例外を握りつぶし、
// 毎回スプラッシュを表示する挙動にフォールバックする
export function hasShownSplash(): boolean {
  try {
    return sessionStorage.getItem(SPLASH_SHOWN_KEY) === '1'
  } catch {
    return false
  }
}

export function markSplashShown(): void {
  try {
    sessionStorage.setItem(SPLASH_SHOWN_KEY, '1')
  } catch {
    // 保存できなくても表示には影響しないため無視する
  }
}
