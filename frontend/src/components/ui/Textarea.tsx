import type { ComponentPropsWithoutRef } from 'react'

type TextareaProps = ComponentPropsWithoutRef<'textarea'> & {
  id: string
  label: string
}

export function Textarea({ id, label, className, ...rest }: TextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-muted">
        {label}
      </label>
      <textarea
        id={id}
        className={[
          'mt-1 w-full rounded-xl border border-brand-border bg-brand-surface px-3 py-2 text-brand-text',
          'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary-light',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    </div>
  )
}
