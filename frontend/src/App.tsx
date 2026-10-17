import { useCallback, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthErrorScreen } from './components/AuthErrorScreen'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicOnlyRoute } from './components/PublicOnlyRoute'
import { SplashScreen } from './components/SplashScreen'
import { useAuth } from './features/auth/useAuth'
import { hasShownSplash } from './features/splash/splashStorage'
import { LoginPage } from './pages/LoginPage'
import { PlaceEditPage } from './pages/PlaceEditPage'
import { PlaceNewPage } from './pages/PlaceNewPage'
import { PlacesPage } from './pages/PlacesPage'
import { PrefectureListPage } from './pages/PrefectureListPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  const { status } = useAuth()
  // 初回描画前に同期的に判定し、背面の画面が一瞬見えるちらつきを防ぐ
  const [showSplash, setShowSplash] = useState(() => !hasShownSplash())
  const hideSplash = useCallback(() => setShowSplash(false), [])

  return (
    <>
      {status === 'error' ? (
        <AuthErrorScreen />
      ) : (
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<PrefectureListPage />} />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/places/new" element={<PlaceNewPage />} />
            <Route path="/places/:id/edit" element={<PlaceEditPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
      {showSplash && <SplashScreen onFinish={hideSplash} />}
    </>
  )
}

export default App
