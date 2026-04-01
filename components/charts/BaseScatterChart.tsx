'use client'

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'

type DataPoint = { x: number; y: number; label?: string }

type BaseScatterChartProps = {
  data: DataPoint[] | null
  xLabel?: string
  yLabel?: string
  xUnit?: string
  yUnit?: string
  color?: string
}

export default function BaseScatterChart({
  data,
  xLabel,
  yLabel,
  xUnit,
  yUnit,
  color = '#7c6af7',
}: BaseScatterChartProps) {
  if (!data) return <Skeleton className="h-48 w-full" />

  return (
    <ResponsiveContainer width="100%" height={192}>
      <ScatterChart margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
        <XAxis
          dataKey="x"
          type="number"
          name={xLabel}
          unit={xUnit}
          tick={{ fill: '#6b6b8a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          dataKey="y"
          type="number"
          name={yLabel}
          unit={yUnit}
          tick={{ fill: '#6b6b8a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[1, 5]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111118',
            border: '1px solid #1e1e2e',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#e2e2f0' }}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Scatter data={data} fill={color} opacity={0.8} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
