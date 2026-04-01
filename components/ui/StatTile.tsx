import { LucideIcon } from 'lucide-react'
import { Skeleton } from './Skeleton'

type StatTileProps = {
  label: string
  value: string | number | null | undefined
  unit?: string
  icon?: LucideIcon
  color?: string
  loading?: boolean
}

export function StatTile({ label, value, unit, icon: Icon, color, loading }: StatTileProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
    )
  }

  const display = value === null || value === undefined ? '—' : value

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        {Icon && (
          <div
            className="flex h-5 w-5 items-center justify-center rounded-md"
            style={{
              backgroundColor: color ? `${color}1a` : 'rgba(139,92,246,0.12)',
              color: color || 'var(--color-accent)',
            }}
          >
            <Icon size={12} strokeWidth={2} />
          </div>
        )}
        <span className="text-[11px] font-medium text-muted">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight text-text tabular-nums">
          {display}
        </span>
        {unit && value !== null && value !== undefined && (
          <span className="text-xs text-muted">{unit}</span>
        )}
      </div>
    </div>
  )
}
