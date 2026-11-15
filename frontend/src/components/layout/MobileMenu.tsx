import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCurrentNavKey, getVisibleNavGroups } from '../../constants/navigation'
import type { NavItem } from '../../constants/navigation'
import { NavIcon } from '../ui/NavIcon'
import { BrandMark } from './BrandMark'
import { NavUserSection } from './NavUserSection'
import { NAV_FOCUS_RING } from './navStyles'

type MobileMenuProps = {
  id: string
  open: boolean
  onClose: () => void
  /** 閉じたときにフォーカスを戻す要素(メニューを開いたボタン) */
  returnFocusRef: RefObject<HTMLElement | null>
}

/**
 * スマホの藍色の全画面メニュー。縦書きの目次のように、右の列から左へ項目が並ぶ。
 * ネイティブの<dialog>をshowModal()で開くことで、背面の操作・読み上げを無効化し(フォーカスがメニュー外へ出ない)、
 * Escキーでも閉じられるようにしている。
 */
export function MobileMenu({ id, open, onClose, returnFocusRef }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()
  const currentKey = getCurrentNavKey(pathname)
  const groups = getVisibleNavGroups()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      closeButtonRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // 表示中は背面のページをスクロールさせない
  useEffect(() => {
    if (!open) return
    const { style } = document.documentElement
    const previousOverflow = style.overflow
    style.overflow = 'hidden'
    return () => {
      style.overflow = previousOverflow
    }
  }, [open])

  // Escキー・閉じるボタン・項目の選択のどの方法で閉じても close イベントが発火するため、後処理をここにまとめる
  function handleDialogClose() {
    onClose()
    returnFocusRef.current?.focus()
  }

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-label="メニュー"
      onClose={handleDialogClose}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-brand-primary p-0 text-brand-on-primary backdrop:bg-transparent"
    >
      <div className="flex min-h-full flex-col px-[18px] pt-1 pb-6">
        <div className="flex h-14 items-center justify-between">
          <BrandMark tone="dark" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={`grid size-11 place-items-center rounded-lg text-white hover:bg-white/8 ${NAV_FOCUS_RING}`}
          >
            <NavIcon name="close" className="size-6" />
            <span className="sr-only">メニューを閉じる</span>
          </button>
        </div>

        <nav aria-label="メインメニュー" className="my-9 flex flex-1 flex-row-reverse justify-center gap-3.5">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-row-reverse gap-1">
              <p
                aria-hidden="true"
                className="pt-1 font-display text-[11px] tracking-[0.5em] text-brand-gold [writing-mode:vertical-rl]"
              >
                {group.label}
              </p>
              <ul aria-label={group.label} className="flex flex-row-reverse gap-0.5">
                {group.items.map((item) => (
                  <li key={item.key}>
                    <MobileMenuItem item={item} current={item.key === currentKey} onSelect={onClose} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <NavUserSection variant="menu" onNavigate={onClose} />
      </div>
    </dialog>
  )
}

function MobileMenuItem({ item, current, onSelect }: { item: NavItem; current: boolean; onSelect: () => void }) {
  return (
    <Link
      to={item.to}
      onClick={onSelect}
      aria-current={current ? 'page' : undefined}
      className={[
        'flex w-12 flex-col items-center gap-3 rounded-lg pt-3 pb-4 transition-colors hover:text-white',
        current ? 'bg-white/8 text-white' : 'text-brand-on-primary-muted',
        NAV_FOCUS_RING,
      ].join(' ')}
    >
      {item.primary ? (
        <span className="grid size-[30px] place-items-center rounded-md bg-brand-accent text-white">
          <NavIcon name={item.icon} className="size-[18px]" />
        </span>
      ) : (
        <NavIcon name={item.icon} className="size-5" />
      )}
      <span
        className={[
          'font-display text-[17px] font-bold tracking-[0.2em] [writing-mode:vertical-rl]',
          current ? 'underline decoration-brand-accent decoration-2 underline-offset-[6px]' : '',
        ].join(' ')}
      >
        {item.label}
      </span>
    </Link>
  )
}
