import type { ComponentPropsWithoutRef } from 'react'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  id: string
  label: string
}

export function Input({ id, label, className, ...rest }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold tracking-wide text-brand-text">
        {label}
      </label>
      {/* 帳面に書き込むような下線だけの入力欄。フォーカス時は藍の線を太くする */}
      <input
        id={id}
        className={[
          'mt-1 w-full rounded-none border-0 border-b border-brand-border-strong bg-transparent px-1 py-2 text-brand-text',
          'placeholder:text-brand-muted/70',
          'focus:border-brand-primary focus:shadow-[0_1px_0_var(--color-brand-primary)] focus:outline-none',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    </div>
  )
}
