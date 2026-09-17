type FormErrorsProps = {
  errors: string[]
}

export function FormErrors({ errors }: FormErrorsProps) {
  if (errors.length === 0) return null

  return (
    <ul role="alert" className="rounded-xl bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  )
}
