import type { ComponentPropsWithoutRef } from 'react'

type SelectProps = ComponentPropsWithoutRef<'select'> & {
  id: string
  label: string
}

export function Select({ id, label, className, children, ...rest }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-muted">
        {label}
      </label>
      <select
        id={id}
        className={[
          'mt-1 w-full rounded-xl border border-brand-border bg-brand-surface px-3 py-2 text-brand-text',
          'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary-light',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </select>
    </div>
  )
}
