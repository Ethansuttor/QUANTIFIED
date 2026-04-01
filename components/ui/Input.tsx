type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-[var(--radius-inner)] border border-border bg-surface-2 px-3 py-2.5 text-sm text-text placeholder:text-muted/40 transition-all duration-150 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
}

export function Select({ label, error, children, className = '', id, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-muted">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`rounded-[var(--radius-inner)] border border-border bg-surface-2 px-3 py-2.5 text-sm text-text transition-all duration-150 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
