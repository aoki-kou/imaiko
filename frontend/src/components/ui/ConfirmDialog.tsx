import { useEffect, useId, useRef } from 'react'
import type { RefObject, SyntheticEvent } from 'react'
import { Button } from './Button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  /** 実行中は二重送信を防ぐため、ボタンとEscキーを無効にする */
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
  /** 閉じたときに元の要素(開いたボタン)が消えていた場合のフォーカスの移動先 */
  fallbackFocusRef?: RefObject<HTMLElement | null>
}

/**
 * ブラウザ標準の window.confirm の代わりに使う確認ダイアログ。
 * ネイティブの<dialog>をshowModal()で開くため、背面は操作できず、フォーカスはダイアログ内にとどまる。
 * 開いたときは誤操作を避けるため「やめる」にフォーカスし、閉じたときは開く前の要素へフォーカスを戻す。
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy = false,
  onConfirm,
  onCancel,
  fallbackFocusRef,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      cancelButtonRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // 実行中はEscキーで閉じない
  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    if (busy) event.preventDefault()
  }

  // Escキー・やめるボタン・実行後のどの方法で閉じても close イベントが発火するため、後処理をここにまとめる
  function handleClose() {
    onCancel()
    const target = returnFocusRef.current
    returnFocusRef.current = null
    if (target?.isConnected) {
      target.focus()
    } else {
      fallbackFocusRef?.current?.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={handleCancel}
      onClose={handleClose}
      className="m-auto w-[min(calc(100%-32px),400px)] rounded-sm border border-brand-border bg-brand-surface p-0 text-brand-text shadow-[0_18px_40px_rgb(40_30_10/0.18)] backdrop:bg-brand-primary-deep/40"
    >
      <div className="p-6">
        <h2 id={titleId} className="text-lg font-bold text-brand-primary">
          {title}
        </h2>
        <p id={messageId} className="mt-3 text-sm leading-relaxed break-words">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-brand-border-strong px-4 py-2 text-sm font-bold text-brand-text hover:bg-brand-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-50"
          >
            やめる
          </button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={busy} className="text-sm">
            {busy ? '処理中…' : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
