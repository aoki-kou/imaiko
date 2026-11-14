import type { ComponentPropsWithoutRef } from 'react'

type CardProps = ComponentPropsWithoutRef<'div'>

/** 和紙の上に置いた一枚の紙のような面 */
export function Card({ className, ...rest }: CardProps) {
  return (
    <div
      className={[
        'rounded-sm border border-brand-border bg-brand-surface p-5',
        'shadow-[0_10px_30px_rgb(40_30_10/0.06)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
