type ThresholdMetric = {
  label: string
  current: number | null
  goal: number
  unit?: string
  color?: string
}

type WeeklyComparisonCardProps = {
  metrics: ThresholdMetric[]
}

export function WeeklyComparisonCard({ metrics }: WeeklyComparisonCardProps) {
  return (
    <div className="md:col-span-2 bg-surface-container p-6 rounded-xl border border-outline-variant/10">
      <div className="flex justify-between items-center mb-6">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
          Threshold Progress
        </span>
        <span className="text-[10px] font-mono text-zinc-500">Auto-refresh: 300s</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {metrics.map((m) => {
          const pct =
            m.current != null && m.goal > 0
              ? Math.min((m.current / m.goal) * 100, 100)
              : 0
          const barColor = m.color ?? 'bg-primary'
          const valueColor = m.color
            ? `text-[${m.color}]`
            : 'text-primary'
          const displayValue =
            m.current != null
              ? `${m.unit === '$' ? '$' : ''}${m.current}${m.unit && m.unit !== '$' ? `\u00a0${m.unit}` : ''}`
              : '—'
          const goalDisplay = `${m.unit === '$' ? '$' : ''}${m.goal}${m.unit && m.unit !== '$' ? `\u00a0${m.unit}` : ''}`

          return (
            <div key={m.label} className="space-y-2">
              <div className="flex justify-between text-[10px] font-label uppercase tracking-wider">
                <span className="text-on-surface">{m.label}</span>
                <span className={valueColor}>
                  {displayValue} / {goalDisplay}
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
