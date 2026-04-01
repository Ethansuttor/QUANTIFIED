'use client'

import BaseLineChart from './BaseLineChart'
import type { Log } from '@/types/database'

type StudyHoursChartProps = {
  data: Array<{ label: string; value: number }> | null
}

export default function StudyHoursChart({ data }: StudyHoursChartProps) {
  return (
    <BaseLineChart
      data={data}
      color="var(--color-secondary)"
      unit="h"
    />
  )
}
