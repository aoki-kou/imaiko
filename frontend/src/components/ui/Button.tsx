import type { ComponentPropsWithoutRef } from 'react'

type ButtonVariant = 'primary' | 'danger'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
}

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return (
    <button
      className={['rounded px-4 py-2 disabled:cursor-not-allowed', variantClasses[variant], className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
