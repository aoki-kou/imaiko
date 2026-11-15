import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { MobileMenu } from './MobileMenu'

const MENU_ID = 'mobile-menu'

/** スマホ(md未満)の上部バーと「帖」ボタン */
export function MobileHeader() {
  const location = useLocation()
  const triggerRef = useRef<HTMLButtonElement>(null)
  // メニューを開いた画面のlocation.keyを覚えておき、画面が変わったら(ブラウザの戻る操作を含む)自動で閉じた扱いにする
  const [openedAtKey, setOpenedAtKey] = useState<string | null>(null)
  const menuOpen = openedAtKey === location.key

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-brand-border bg-brand-bg/95 px-4 backdrop-blur-sm md:hidden">
        <Link to="/" aria-label="イマイコ(地図へ)" className="rounded-md">
          <BrandMark />
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          onClick={() => setOpenedAtKey(location.key)}
          className="grid size-11 -rotate-4 place-items-center rounded-lg bg-brand-primary font-display text-xl font-bold text-brand-surface shadow-[0_3px_0_var(--color-brand-primary-deep)] transition-colors hover:bg-brand-primary-hover"
        >
          <span aria-hidden="true">帖</span>
          <span className="sr-only">メニューを開く</span>
        </button>
      </header>
      <MobileMenu
        id={MENU_ID}
        open={menuOpen}
        onClose={() => setOpenedAtKey(null)}
        returnFocusRef={triggerRef}
      />
    </>
  )
}
