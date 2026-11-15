/**
 * 共通ナビゲーションのメニュー定義。
 * PCの縦書きサイドバーとスマホの全画面メニューの両方がこの定義から描画される。
 * 未実装の機能は enabled: false で非表示にしておき、実装したら true に変えるだけで両方に表示される。
 */

export type NavIconName = 'map' | 'pin' | 'plus' | 'stamp' | 'user' | 'gear'

export type NavItemKey = 'map' | 'places' | 'add' | 'records' | 'account' | 'settings'

export type NavItem = {
  key: NavItemKey
  label: string
  to: string
  icon: NavIconName
  /** 主要な操作として朱色で強調する */
  primary?: boolean
  enabled: boolean
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'さがす',
    items: [
      { key: 'map', label: '地図', to: '/', icon: 'map', enabled: true },
      // #19で全件一覧(/places)を実装したら表示する
      { key: 'places', label: '行きたい場所', to: '/places', icon: 'pin', enabled: false },
    ],
  },
  {
    label: 'ためる',
    items: [
      { key: 'add', label: '場所を追加', to: '/places/new', icon: 'plus', primary: true, enabled: true },
      // 行った場所・旅の思い出の記録(将来の機能)
      { key: 'records', label: '旅帖', to: '/records', icon: 'stamp', enabled: false },
    ],
  },
  {
    label: 'あなた',
    items: [
      // #21で表示する
      { key: 'account', label: 'マイページ', to: '/account', icon: 'user', enabled: false },
      { key: 'settings', label: '設定', to: '/settings', icon: 'gear', enabled: false },
    ],
  },
]

/** 表示する項目だけを残し、項目が1つもないグループは除く */
export function getVisibleNavGroups(groups: NavGroup[] = NAV_GROUPS): NavGroup[] {
  return groups
    .map((group) => ({ ...group, items: group.items.filter((item) => item.enabled) }))
    .filter((group) => group.items.length > 0)
}

const PLACE_EDIT_PATH = /^\/places\/[^/]+\/edit$/

/** 現在のパスに対応するメニュー項目(aria-currentを付ける項目)を返す */
export function getCurrentNavKey(pathname: string): NavItemKey | null {
  if (pathname === '/places/new') return 'add'
  if (pathname === '/') return 'map'
  // 暫定: 都道府県別の場所一覧(/places?prefecture=)と編集画面は地図の一部として扱う。
  // #18で地図ホームへ統合し、#19で/placesを「行きたい場所」にする際に見直す
  if (pathname === '/places' || PLACE_EDIT_PATH.test(pathname)) return 'map'
  return null
}
