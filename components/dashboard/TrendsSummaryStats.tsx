type TrendsSummaryStatsProps = {
  totalStudyHrs: number
  weeklyAvgHrs: number
  prevWeeklyAvgHrs: number | null
  sleepMoodCorrelation: number | null
}

export function TrendsSummaryStats({
  totalStudyHrs,
  weeklyAvgHrs,
  prevWeeklyAvgHrs,
  sleepMoodCorrelation,
}: TrendsSummaryStatsProps) {
  const delta =
    prevWeeklyAvgHrs != null && prevWeeklyAvgHrs > 0
      ? Math.round(((weeklyAvgHrs - prevWeeklyAvgHrs) / prevWeeklyAvgHrs) * 100)
      : null

  const efficiencyScore = Math.min(100, Math.round((weeklyAvgHrs / 40) * 100))

  const correlationLabel =
    sleepMoodCorrelation == null
      ? 'Insufficient Data'
      : Math.abs(sleepMoodCorrelation) >= 0.7
      ? 'High Correlation'
      : Math.abs(sleepMoodCorrelation) >= 0.4
      ? 'Moderate'
      : 'Weak'

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          Cumulative Hours
        </span>
        <h3 className="text-4xl font-black text-on-surface mt-2 font-headline tabular-nums">
          {totalStudyHrs.toFixed(1)}
        </h3>
        <span className="font-label text-[10px] uppercase tracking-widest text-primary mt-1 block">
          This Semester
        </span>
      </div>

      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          Efficiency Score
        </span>
        <div className="flex items-baseline gap-1.5 mt-2">
          <h3 className="text-4xl font-black text-on-surface font-headline tabular-nums">
            {efficiencyScore}
          </h3>
          {delta != null && (
            <span
              className={`text-sm font-bold font-mono ${delta >= 0 ? 'text-primary' : 'text-error'}`}
            >
              {delta >= 0 ? '+' : ''}
              {delta}%
            </span>
          )}
        </div>
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 block">
          vs Last Period
        </span>
      </div>

      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          Weekly Avg
        </span>
        <div className="flex items-baseline gap-1 mt-2">
          <h3 className="text-4xl font-black text-on-surface font-headline tabular-nums">
            {weeklyAvgHrs.toFixed(1)}
          </h3>
          <span className="text-on-surface-variant text-xl">h</span>
        </div>
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 block">
          Study / Week
        </span>
      </div>

      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          Sleep → Mood r
        </span>
        <h3 className="text-4xl font-black text-on-surface mt-2 font-headline tabular-nums">
          {sleepMoodCorrelation != null ? sleepMoodCorrelation.toFixed(2) : '—'}
        </h3>
        <span
          className={`font-label text-[10px] uppercase tracking-widest mt-1 block ${
            sleepMoodCorrelation != null && Math.abs(sleepMoodCorrelation) >= 0.6
              ? 'text-primary'
              : 'text-on-surface-variant'
          }`}
        >
          {correlationLabel}
        </span>
      </div>
    </div>
  )
}
