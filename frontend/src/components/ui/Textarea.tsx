import type { ComponentPropsWithoutRef } from 'react'

type TextareaProps = ComponentPropsWithoutRef<'textarea'> & {
  id: string
  label: string
}

export function Textarea({ id, label, className, ...rest }: TextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold tracking-wide text-brand-text">
        {label}
      </label>
      {/* 便箋のような罫線入りのメモ欄(ruled-paperは index.css で定義) */}
      <textarea
        id={id}
        className={[
          'ruled-paper mt-1 w-full rounded-sm border border-brand-border-strong bg-brand-surface px-3 py-0 text-brand-text',
          'placeholder:text-brand-muted/70',
          'focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light focus:outline-none',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    </div>
  )
}
