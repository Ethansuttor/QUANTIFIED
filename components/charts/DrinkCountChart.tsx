'use client'

import BaseBarChart from './BaseBarChart'

type DrinkCountChartProps = {
  data: Array<{ label: string; value: number }> | null
  weeklyAverage?: number
}

export default function DrinkCountChart({ data, weeklyAverage }: DrinkCountChartProps) {
  return (
    <BaseBarChart
      data={data}
      color="#7c6af7"
      referenceValue={weeklyAverage}
      referenceLabel={weeklyAverage !== undefined ? `avg ${weeklyAverage.toFixed(1)}` : undefined}
      dangerThreshold={weeklyAverage ? weeklyAverage * 1.5 : undefined}
    />
  )
}
