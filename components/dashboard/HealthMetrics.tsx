type HealthMetricsProps = {
  sleepHrs: number | null
  screenHrs: number | null
  sleepGoal?: number
  screenGoal?: number
}

export function HealthMetrics({
  sleepHrs,
  screenHrs,
  sleepGoal = 8,
  screenGoal = 3,
}: HealthMetricsProps) {
  const sleepProgress = sleepHrs != null ? Math.min((sleepHrs / sleepGoal) * 100, 100) : 0
  const screenProgress = screenHrs != null ? Math.min((screenHrs / screenGoal) * 100, 100) : 0
  const sleepOver = sleepHrs != null && sleepHrs > sleepGoal
  const screenOver = screenHrs != null && screenHrs > screenGoal

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Sleep */}
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-primary">
            Sleep
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <h3 className="text-4xl font-black text-on-surface font-headline tabular-nums">
              {sleepHrs != null ? sleepHrs.toFixed(1) : '—'}
            </h3>
            {sleepHrs != null && (
              <span className="text-on-surface-variant text-xl">/{sleepGoal}h</span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                sleepProgress >= 75 ? 'bg-primary' : 'bg-error-dim'
              }`}
              style={{
                width: `${sleepProgress}%`,
                boxShadow: sleepProgress >= 75 ? '0 0 8px rgba(78,222,163,0.4)' : undefined,
              }}
            />
          </div>
          <span className="text-[10px] text-on-surface-variant font-mono mt-1 block">
            {sleepHrs != null
              ? sleepOver
                ? `+${(sleepHrs - sleepGoal).toFixed(1)}h over goal`
                : `${Math.round(sleepProgress)}% of goal`
              : 'No data'}
          </span>
        </div>
      </div>

      {/* Screen Time */}
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
            Screen
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <h3 className="text-4xl font-black text-on-surface font-headline tabular-nums">
              {screenHrs != null ? screenHrs.toFixed(1) : '—'}
            </h3>
            {screenHrs != null && (
              <span className="text-on-surface-variant text-xl">/{screenGoal}h</span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                screenOver ? 'bg-error' : 'bg-secondary'
              }`}
              style={{ width: `${screenProgress}%` }}
            />
          </div>
          <span
            className={`text-[10px] font-mono mt-1 block ${
              screenOver ? 'text-error' : 'text-on-surface-variant'
            }`}
          >
            {screenHrs != null
              ? screenOver
                ? `${(screenHrs - screenGoal).toFixed(1)}h over limit`
                : `${Math.round(screenProgress)}% of limit`
              : 'No data'}
          </span>
        </div>
      </div>
    </div>
  )
}
