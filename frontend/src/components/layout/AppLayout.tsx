import { Outlet } from 'react-router-dom'
import { MobileHeader } from './MobileHeader'
import { SideNav } from './SideNav'

/**
 * ログイン後の画面に共通のレイアウト。
 * PC(md以上)は左に縦書きサイドバー、スマホは上部バー＋「帖」メニューを表示する。
 */
export function AppLayout() {
  return (
    <div className="md:pl-24">
      <SideNav />
      <MobileHeader />
      <Outlet />
    </div>
  )
}
