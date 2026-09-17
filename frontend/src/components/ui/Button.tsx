import type { ComponentPropsWithoutRef } from 'react'

type ButtonVariant = 'primary' | 'danger'
type ButtonSize = 'md' | 'sm'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover disabled:bg-brand-primary/40',
  danger: 'bg-brand-danger text-white hover:bg-brand-danger-hover disabled:bg-brand-danger/40',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-4 py-2 text-base',
  sm: 'px-3 py-1 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      className={[
        'rounded-full font-semibold transition-colors disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
