import type { ComponentPropsWithoutRef } from 'react'

type ButtonVariant = 'primary' | 'danger'
type ButtonSize = 'md' | 'sm'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

// 下側の濃い影で、版木で刷ったような厚みを出す
const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-brand-primary text-brand-surface shadow-[0_2px_0_var(--color-brand-primary-deep)]',
    'hover:bg-brand-primary-hover disabled:bg-brand-primary/40',
  ].join(' '),
  danger: [
    'bg-brand-danger text-brand-surface shadow-[0_2px_0_var(--color-brand-danger-hover)]',
    'hover:bg-brand-danger-hover disabled:bg-brand-danger/40',
  ].join(' '),
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-base',
  sm: 'px-3 py-1 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      className={[
        'rounded-md font-bold tracking-[0.08em] transition-colors',
        'disabled:cursor-not-allowed disabled:shadow-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
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
