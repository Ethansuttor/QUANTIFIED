import { today, daysAgo } from '@/lib/utils/date'
import { getLogsForDateRange } from '@/lib/db/logs'
import { getSummariesForDateRange } from '@/lib/db/daily-summaries'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import StudyHoursChart from '@/components/charts/StudyHoursChart'
import DrinkCountChart from '@/components/charts/DrinkCountChart'
import SpendingChart from '@/components/charts/SpendingChart'
import SleepMoodScatter from '@/components/charts/SleepMoodScatter'
import { groupByWeek, computeSessionMinutes, sumValues, average } from '@/lib/utils/aggregations'
import { TrendsSummaryStats } from '@/components/dashboard/TrendsSummaryStats'

export default async function TrendsPage() {
  const end = today()
  const start = daysAgo(90)

  const [allLogs, summaries] = await Promise.all([
    getLogsForDateRange(start, end),
    getSummariesForDateRange(start, end),
  ])

  const studyByWeek = groupByWeek(
    allLogs.filter((l) => l.category === 'study'),
    (logs) => Math.round((computeSessionMinutes(logs) / 60) * 10) / 10
  )

  const drinksByWeek = groupByWeek(
    allLogs.filter((l) => l.category === 'drink'),
    sumValues
  )

  const spendByWeek = groupByWeek(
    allLogs.filter((l) => l.category === 'spend'),
    (logs) => Math.round(sumValues(logs) * 100) / 100
  )

  const avgDrinksPerWeek = drinksByWeek.length
    ? Math.round(average(drinksByWeek.map((d) => d.value)) * 10) / 10
    : 0

  // Cumulative study hours and weekly averages
  const totalStudyHrs = Math.round(studyByWeek.reduce((acc, w) => acc + w.value, 0) * 10) / 10
  const allStudyHrs = studyByWeek.map((w) => w.value)
  const currentWeeklyAvg =
    allStudyHrs.length > 0
      ? Math.round((average(allStudyHrs) * 10) / 10)
      : 0
  const prevWeeklyAvg =
    allStudyHrs.length >= 2
      ? Math.round((average(allStudyHrs.slice(0, -1)) * 10) / 10)
      : null

  // Pearson correlation: sleep_hrs vs mood
  function pearsonCorrelation(xs: number[], ys: number[]): number | null {
    const n = xs.length
    if (n < 3) return null
    const meanX = xs.reduce((a, b) => a + b, 0) / n
    const meanY = ys.reduce((a, b) => a + b, 0) / n
    const num = xs.reduce((sum, x, i) => sum + (x - meanX) * (ys[i] - meanY), 0)
    const denX = Math.sqrt(xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0))
    const denY = Math.sqrt(ys.reduce((sum, y) => sum + (y - meanY) ** 2, 0))
    if (denX === 0 || denY === 0) return null
    return Math.round((num / (denX * denY)) * 100) / 100
  }

  const sleepMoodPairs = summaries.filter(
    (s) => s.sleep_hrs != null && s.mood != null
  )
  const sleepMoodCorrelation = pearsonCorrelation(
    sleepMoodPairs.map((s) => s.sleep_hrs!),
    sleepMoodPairs.map((s) => s.mood!)
  )

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5 border-b border-border pb-6">
        <h1 className="gradient-text text-2xl font-semibold tracking-tight">Trends</h1>
        <p className="text-xs text-muted">Last 90 days of data</p>
      </header>

      <TrendsSummaryStats
        totalStudyHrs={totalStudyHrs}
        weeklyAvgHrs={currentWeeklyAvg}
        prevWeeklyAvgHrs={prevWeeklyAvg}
        sleepMoodCorrelation={sleepMoodCorrelation}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Study hours / week</CardTitle>
          </CardHeader>
          <StudyHoursChart data={studyByWeek.length ? studyByWeek : null} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep vs mood</CardTitle>
          </CardHeader>
          <SleepMoodScatter summaries={summaries.length ? summaries : null} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drinks / week</CardTitle>
          </CardHeader>
          <DrinkCountChart
            data={drinksByWeek.length ? drinksByWeek : null}
            weeklyAverage={avgDrinksPerWeek}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending / week</CardTitle>
          </CardHeader>
          <SpendingChart data={spendByWeek.length ? spendByWeek : null} />
        </Card>
      </div>
    </div>
  )
}
