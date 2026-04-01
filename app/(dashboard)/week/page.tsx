import { today, daysAgo, weekLabel } from '@/lib/utils/date'
import { getLogsForDateRange } from '@/lib/db/logs'
import { getSummariesForDateRange } from '@/lib/db/daily-summaries'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import StudyHoursChart from '@/components/charts/StudyHoursChart'
import DrinkCountChart from '@/components/charts/DrinkCountChart'
import SpendingChart from '@/components/charts/SpendingChart'
import { computeSessionMinutes, sumValues, average } from '@/lib/utils/aggregations'
import { AISummaryCard } from '@/components/dashboard/AISummaryCard'

export default async function WeekPage() {
  const end = today()
  const start = daysAgo(6)
  const days = Array.from({ length: 7 }, (_, i) => daysAgo(6 - i))

  const [allLogs, summaries] = await Promise.all([
    getLogsForDateRange(start, end),
    getSummariesForDateRange(start, end),
  ])

  const studyData = days.map((date) => {
    const dayLogs = allLogs.filter((l) => l.created_at.startsWith(date) && l.category === 'study')
    const mins = computeSessionMinutes(dayLogs)
    return { label: weekLabel(date), value: Math.round((mins / 60) * 10) / 10 }
  })

  const drinkData = days.map((date) => {
    const dayLogs = allLogs.filter((l) => l.created_at.startsWith(date) && l.category === 'drink')
    return { label: weekLabel(date), value: sumValues(dayLogs) }
  })

  const spendData = days.map((date) => {
    const dayLogs = allLogs.filter((l) => l.created_at.startsWith(date) && l.category === 'spend')
    return { label: weekLabel(date), value: Math.round(sumValues(dayLogs) * 100) / 100 }
  })

  const sleepData = summaries.map((s) => ({
    label: weekLabel(s.date),
    value: s.sleep_hrs ?? 0,
  }))

  const avgDrinks = Math.round(average(drinkData.map((d) => d.value)) * 10) / 10
  const avgStudy = Math.round(average(studyData.map((d) => d.value)) * 10) / 10
  const totalSpend = Math.round(spendData.reduce((acc, d) => acc + d.value, 0) * 100) / 100
  const avgSleep =
    sleepData.length > 0
      ? Math.round(average(sleepData.map((d) => d.value)) * 10) / 10
      : null

  const habitSummaryLines = [
    `Study Time: Average ${avgStudy}h/day across the last 7 days.`,
    `Hydration: ${avgDrinks} drinks/day on average${avgDrinks <= 2 ? ' — within healthy range.' : ' — consider reducing intake.'}`,
    `Spending: $${totalSpend} total this week.`,
    avgSleep != null
      ? `Sleep: Averaging ${avgSleep}h/night${avgSleep >= 7 ? ' — meeting recovery goal.' : ' — below the 7h target.'}`
      : null,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5 border-b border-border pb-6">
        <h1 className="gradient-text text-2xl font-semibold tracking-tight">This Week</h1>
        <p className="text-xs text-muted">Last 7 days at a glance</p>
      </header>

      <AISummaryCard summary={habitSummaryLines} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Study hours</CardTitle>
          </CardHeader>
          <StudyHoursChart data={studyData} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drinks</CardTitle>
          </CardHeader>
          <DrinkCountChart data={drinkData} weeklyAverage={avgDrinks} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending</CardTitle>
          </CardHeader>
          <SpendingChart data={spendData} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep</CardTitle>
          </CardHeader>
          <StudyHoursChart data={sleepData} />
        </Card>
      </div>
    </div>
  )
}
