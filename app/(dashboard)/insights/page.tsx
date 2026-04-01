import { today, daysAgo } from '@/lib/utils/date'
import { getLogsForDateRange } from '@/lib/db/logs'
import { getSummariesForDateRange } from '@/lib/db/daily-summaries'
import { getAllGrades } from '@/lib/db/grades'
import { InsightsChatBox } from '@/components/dashboard/InsightsChatBox'

function sanitizeForPrompt(value: string | null | undefined): string {
  if (value == null) return 'n/a'
  return String(value).replace(/[\n\r\t]/g, ' ').slice(0, 100)
}

async function buildContextSummary(): Promise<string> {
  const end = today()
  const start = daysAgo(30)

  const [logs, summaries, grades] = await Promise.all([
    getLogsForDateRange(start, end),
    getSummariesForDateRange(start, end),
    getAllGrades(),
  ])

  const lines: string[] = [
    `Data range: ${start} to ${end}`,
    `Total log entries: ${logs.length}`,
    `Daily summaries: ${summaries.length} days`,
    `Grades on record: ${grades.length}`,
    '',
    'Recent logs (last 10):',
    ...logs
      .slice(-10)
      .map(
        (l) =>
          `  ${l.created_at.split('T')[0]} [${sanitizeForPrompt(l.category)}] event=${sanitizeForPrompt(l.event)} value=${l.value ?? 'n/a'}`
      ),
    '',
    'Recent daily summaries (last 7):',
    ...summaries
      .slice(-7)
      .map(
        (s) =>
          `  ${s.date}: sleep=${s.sleep_hrs ?? 'n/a'}h mood=${s.mood ?? 'n/a'}/5 energy=${s.energy ?? 'n/a'}/5 screen=${s.screen_hrs ?? 'n/a'}h`
      ),
    '',
    'Grades:',
    ...grades.map(
      (g) =>
        `  ${g.date} ${sanitizeForPrompt(g.course)} ${sanitizeForPrompt(g.exam_type)}: ${g.score}/${g.max_score} (${g.max_score > 0 ? Math.round((g.score / g.max_score) * 100) : 0}%)`
    ),
  ]

  return lines.join('\n')
}

export default async function InsightsPage() {
  try {
    const contextSummary = await buildContextSummary()

    return (
      <div className="flex h-[calc(100vh-7rem)] flex-col gap-6">
        <header className="flex flex-col gap-1.5 border-b border-border pb-6">
          <h1 className="gradient-text text-2xl font-semibold tracking-tight">AI Insights</h1>
          <p className="text-xs text-muted">Ask anything about your data</p>
        </header>
        <InsightsChatBox contextSummary={contextSummary} />
      </div>
    )
  } catch {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="gradient-text text-xl font-semibold">AI Insights</h1>
        <p className="text-sm text-danger">Failed to load data. Please refresh.</p>
      </div>
    )
  }
}
