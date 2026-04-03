import { today, daysAgo } from '@/lib/utils/date'
import {
  computeStudyHoursForDate,
  getDrinkCountForDate,
  getSpendingForDate,
  getWorkoutForDate,
  getDriveMilesForDate,
  getLogsForDateRange,
} from '@/lib/db/logs'
import { getSummaryForDate, getSummariesForDateRange } from '@/lib/db/daily-summaries'
import { TodaySummaryCard } from '@/components/dashboard/TodaySummaryCard'
import { WeeklyComparisonCard } from '@/components/dashboard/WeeklyComparisonCard'
import { HealthMetrics } from '@/components/dashboard/HealthMetrics'

function computeDailyScore(params: {
  studyHours: number | null
  energy: number | null
  mood: number | null
  drinkCount: number | null
}): number | null {
  const scores: number[] = []
  if (params.studyHours != null) scores.push(Math.min(params.studyHours / 4, 1) * 100)
  if (params.energy != null) scores.push((params.energy / 5) * 100)
  if (params.mood != null) scores.push((params.mood / 5) * 100)
  if (params.drinkCount != null) scores.push(Math.max(0, ((4 - params.drinkCount) / 4)) * 100)
  return scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null
}

export default async function TodayPage() {
  try {
    const date = today()
    const weekStart = daysAgo(6)

    const [
      studyHours,
      drinkCount,
      spending,
      workout,
      driveMiles,
      todaySummary,
      weekSpendLogs,
    ] = await Promise.all([
      computeStudyHoursForDate(date),
      getDrinkCountForDate(date),
      getSpendingForDate(date),
      getWorkoutForDate(date),
      getDriveMilesForDate(date),
      getSummaryForDate(date),
      getLogsForDateRange(weekStart, date, 'spend'),
    ])

    const weekSpendTotal = weekSpendLogs.reduce((acc, l) => acc + (l.value ?? 0), 0)
    const avgSpendPerDay = Math.round((weekSpendTotal / 7) * 100) / 100

    const dailyScore = computeDailyScore({
      studyHours,
      energy: todaySummary?.energy ?? null,
      mood: todaySummary?.mood ?? null,
      drinkCount,
    })

    const dateLabel = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })

    const syncTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const spendOver = spending != null && avgSpendPerDay > 0
      ? Math.round(spending - avgSpendPerDay)
      : null

    return (
      <div>
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-primary-container/20 text-primary font-label text-[10px] tracking-widest uppercase border border-primary/20 rounded">
                Real-time HUD
              </span>
              <span className="text-on-surface-variant text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                System Nominal
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-on-surface font-headline leading-none">
              {dateLabel}
            </h1>
            <p className="text-on-surface-variant font-label text-[11px] md:text-sm uppercase tracking-widest opacity-80">
              Last Sync: {syncTime}
            </p>
          </div>
          {dailyScore !== null && (
            <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/10 shadow-sm flex flex-col min-w-[120px] w-fit">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Daily Score
              </span>
              <span className="text-2xl font-black text-primary font-headline">
                {dailyScore}%
              </span>
            </div>
          )}
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {/* Study / Focus — large 2-col card */}
          <TodaySummaryCard studyHours={studyHours} workout={workout} />

          {/* Beverages */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                Beverages
              </span>
              <h3 className="text-4xl font-black text-on-surface mt-2 font-headline">
                {drinkCount ?? '—'}
              </h3>
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center">
              <span className="text-[10px] text-on-surface-variant uppercase font-label">
                Status
              </span>
              <span
                className={`font-bold text-[10px] uppercase font-label ${
                  drinkCount === 0 ? 'text-primary' : drinkCount != null && drinkCount <= 2 ? 'text-secondary' : 'text-error'
                }`}
              >
                {drinkCount === 0 ? 'Optimal' : drinkCount != null && drinkCount <= 2 ? 'Moderate' : 'High'}
              </span>
            </div>
          </div>

          {/* Energy */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
                Energy
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <h3 className="text-4xl font-black text-on-surface font-headline">
                  {todaySummary?.energy ?? '—'}
                </h3>
                {todaySummary?.energy != null && (
                  <span className="text-on-surface-variant text-xl">/5</span>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    todaySummary?.energy != null && i <= todaySummary.energy
                      ? 'bg-secondary'
                      : 'bg-surface-container-highest'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <span className="font-label text-xs uppercase tracking-[0.2em] text-tertiary">
                Mood
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <h3 className="text-4xl font-black text-on-surface font-headline">
                  {todaySummary?.mood ?? '—'}
                </h3>
                {todaySummary?.mood != null && (
                  <span className="text-on-surface-variant text-xl">/5</span>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant/10">
              <span className="text-[10px] text-on-surface-variant font-label uppercase">
                {todaySummary?.mood != null && todaySummary.mood >= 4
                  ? 'Peak Productivity'
                  : todaySummary?.mood != null && todaySummary.mood >= 3
                  ? 'Stable'
                  : 'Below Baseline'}
              </span>
            </div>
          </div>

          {/* Spend */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                Spend
              </span>
              <h3 className="text-4xl font-black text-on-surface mt-2 font-headline tabular-nums">
                {spending != null ? `$${Math.round(spending)}` : '—'}
              </h3>
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant/10">
              {spendOver !== null && spendOver > 0 ? (
                <span className="text-error font-bold text-[10px] flex items-center gap-1">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '14px' }}
                  >
                    arrow_upward
                  </span>
                  ${spendOver} over avg
                </span>
              ) : spending != null ? (
                <span className="text-primary font-bold text-[10px] flex items-center gap-1">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '14px' }}
                  >
                    check
                  </span>
                  Within avg
                </span>
              ) : (
                <span className="text-[10px] text-on-surface-variant font-label uppercase">
                  No spend logged
                </span>
              )}
            </div>
          </div>

          {/* Drive */}
          {driveMiles != null && (
            <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
              <div>
                <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  Drive
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <h3 className="text-4xl font-black text-on-surface font-headline tabular-nums">
                    {Math.round(driveMiles)}
                  </h3>
                  <span className="text-on-surface-variant text-xl">mi</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/10">
                <span className="text-[10px] text-on-surface-variant font-label uppercase">
                  Today
                </span>
              </div>
            </div>
          )}

          {/* Threshold Progress */}
          <WeeklyComparisonCard
            metrics={[
              {
                label: 'Study Progress',
                current: studyHours != null ? Math.round(studyHours * 10) / 10 : null,
                goal: 4,
                unit: 'hrs',
                color: 'bg-primary',
              },
              {
                label: 'Daily Spend',
                current: spending != null ? Math.round(spending) : null,
                goal: avgSpendPerDay > 0 ? Math.round(avgSpendPerDay * 1.5) : 50,
                unit: '$',
                color: 'bg-secondary-dim',
              },
            ]}
          />
        </div>

        {/* Health Metrics */}
        <HealthMetrics
          sleepHrs={todaySummary?.sleep_hrs ?? null}
          screenHrs={todaySummary?.screen_hrs ?? null}
        />

        {/* Active Sessions */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <h2 className="text-xl font-black font-headline tracking-tight uppercase">
              Active Sessions
            </h2>
            <div className="h-[1px] flex-1 bg-outline-variant/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {studyHours != null && studyHours > 0 && (
              <div className="bg-surface-container p-4 rounded-xl border border-primary/30 flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      menu_book
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Study Session</h4>
                    <p className="text-xs text-on-surface-variant font-mono">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long' })} •{' '}
                      {studyHours.toFixed(1)}h logged
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-primary font-mono text-sm font-bold uppercase font-label">
                    Active
                  </span>
                </div>
              </div>
            )}

            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex items-center justify-center border-dashed group cursor-pointer hover:border-zinc-700 transition-all">
              <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300">
                <span className="material-symbols-outlined">add_circle</span>
                <span className="font-label text-xs uppercase tracking-widest">
                  Initialize New Stream
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          <div className="bg-surface-container/40 p-4 rounded-lg border border-outline-variant/5">
            <h5 className="font-label text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
              Sync Events
            </h5>
            <ul className="space-y-2">
              <li className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-400">Study_Data_Ingest</span>
                <span className="text-primary">OK</span>
              </li>
              <li className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-400">Spend_Transaction_Sync</span>
                <span className="text-primary">OK</span>
              </li>
              <li className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-400">Summary_Stream</span>
                <span className="text-secondary">LIVE</span>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2 flex flex-col justify-end">
            <p className="text-[10px] text-zinc-600 font-mono text-right">
              QUANTIFIED CORE v4.12.0 // NODE: DX-US-WEST-2 // ENCRYPTION: AES-256-GCM
            </p>
          </div>
        </footer>
      </div>
    )
  } catch {
    return (
      <p className="text-sm text-error">
        Failed to load dashboard data. Please refresh.
      </p>
    )
  }
}
