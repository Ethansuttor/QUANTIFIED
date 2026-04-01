type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent'

type BadgeProps = {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-surface-3 text-muted border-border-strong',
  success: 'bg-success-dim text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  accent: 'bg-accent-dim text-accent-2 border-accent/20',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
