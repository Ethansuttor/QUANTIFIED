type TodaySummaryCardProps = {
  studyHours: number | null
  workout: boolean | null
  studyGoalHours?: number
}

function formatStudyTime(hours: number | null): string {
  if (hours === null) return '—'
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0 && m === 0) return '0m'
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function TodaySummaryCard({
  studyHours,
  workout,
  studyGoalHours = 4,
}: TodaySummaryCardProps) {
  const progress =
    studyHours != null ? Math.min((studyHours / studyGoalHours) * 100, 100) : 0
  const goalLabel = `${studyGoalHours}h 00m`

  return (
    <div className="md:col-span-2 bg-surface-container p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
      <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary">
              Study / Focus
            </span>
            <h3 className="text-4xl md:text-5xl font-black text-on-surface mt-2 font-headline tabular-nums">
              {formatStudyTime(studyHours)}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            {workout !== null && (
              <span
                className={`font-bold text-xs flex items-center gap-1 ${
                  workout ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '14px',
                    fontVariationSettings: workout ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  fitness_center
                </span>
                {workout ? 'Workout Done' : 'Rest Day'}
              </span>
            )}
            <span className="text-[10px] text-on-surface-variant font-mono">
              Goal: {goalLabel}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex-1 bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className="bg-tertiary h-full transition-all duration-700 rounded-full"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 12px rgba(144, 147, 255, 0.4)',
              }}
            />
          </div>
          <span className="text-[10px] text-on-surface-variant font-mono mt-1 block">
            {Math.round(progress)}% of daily goal
          </span>
        </div>
      </div>
      <div className="absolute inset-0 opacity-10 sparkline-gradient pointer-events-none" />
    </div>
  )
}
