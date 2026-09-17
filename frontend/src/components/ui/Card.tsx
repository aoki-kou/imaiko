import type { ComponentPropsWithoutRef } from 'react'

type CardProps = ComponentPropsWithoutRef<'div'>

export function Card({ className, ...rest }: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-brand-border bg-brand-surface p-4 shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
