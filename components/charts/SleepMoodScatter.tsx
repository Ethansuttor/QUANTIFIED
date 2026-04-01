'use client'

import BaseScatterChart from './BaseScatterChart'
import type { DailySummary } from '@/types/database'

type SleepMoodScatterProps = {
  summaries: DailySummary[] | null
}

export default function SleepMoodScatter({ summaries }: SleepMoodScatterProps) {
  const data = summaries
    ? summaries
        .filter((s) => s.sleep_hrs != null && s.mood != null)
        .map((s) => ({ x: s.sleep_hrs!, y: s.mood! }))
    : null

  return (
    <BaseScatterChart
      data={data}
      xLabel="Sleep"
      yLabel="Mood"
      xUnit="h"
      color="#7c6af7"
    />
  )
}
