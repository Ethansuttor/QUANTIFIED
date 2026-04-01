type CardProps = {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`card-shadow rounded-[var(--radius-card)] border border-border bg-surface p-5 transition-shadow duration-200 hover:border-border-strong ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }: CardProps) {
  return (
    <h3 className={`text-[11px] font-semibold uppercase tracking-widest text-muted/70 ${className}`}>
      {children}
    </h3>
  )
}
