'use client'

import BaseBarChart from './BaseBarChart'

type SpendingChartProps = {
  data: Array<{ label: string; value: number }> | null
}

export default function SpendingChart({ data }: SpendingChartProps) {
  return (
    <BaseBarChart
      data={data}
      color="#22c55e"
      unit="$"
    />
  )
}
