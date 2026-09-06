import type { ComponentPropsWithoutRef } from 'react'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  id: string
  label: string
}

export function Input({ id, label, className, ...rest }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block">
        {label}
      </label>
      <input
        id={id}
        className={['border rounded px-2 py-1', className].filter(Boolean).join(' ')}
        {...rest}
      />
    </div>
  )
}
