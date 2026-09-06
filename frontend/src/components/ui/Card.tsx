import type { ComponentPropsWithoutRef } from 'react'

type CardProps = ComponentPropsWithoutRef<'div'>

export function Card({ className, ...rest }: CardProps) {
  return <div className={['border rounded p-4', className].filter(Boolean).join(' ')} {...rest} />
}
