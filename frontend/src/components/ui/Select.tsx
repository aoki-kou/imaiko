import type { ComponentPropsWithoutRef } from 'react'

type SelectProps = ComponentPropsWithoutRef<'select'> & {
  id: string
  label: string
}

export function Select({ id, label, className, children, ...rest }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold tracking-wide text-brand-text">
        {label}
      </label>
      <select
        id={id}
        className={[
          'mt-1 w-full rounded-none border-0 border-b border-brand-border-strong bg-transparent px-1 py-2 text-brand-text',
          'focus:border-brand-primary focus:shadow-[0_1px_0_var(--color-brand-primary)] focus:outline-none',
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
