'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'

type DataPoint = { label: string; value: number }

type BaseLineChartProps = {
  data: DataPoint[] | null
  color?: string
  unit?: string
  referenceValue?: number
  referenceLabel?: string
}

export default function BaseLineChart({
  data,
  color = 'var(--color-accent)',
  unit,
  referenceValue,
  referenceLabel,
}: BaseLineChartProps) {
  if (!data) return <Skeleton className="h-48 w-full" />

  const gradientId = `colorArea-${color.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -24 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="6 6" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--color-muted)', fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fill: 'var(--color-muted)', fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          unit={unit}
          dx={-4}
        />
        <Tooltip
          cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="glass rounded-xl p-3 shadow-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted/60 mb-1">{label}</p>
                  <p className="text-sm font-black text-text">
                    {payload[0].value}
                    {unit && <span className="ml-0.5 text-[10px] text-muted">{unit}</span>}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        {referenceValue !== undefined && (
          <ReferenceLine
            y={referenceValue}
            stroke="var(--color-warning)"
            strokeDasharray="4 4"
            strokeWidth={2}
            label={{ 
              value: referenceLabel ?? `AVG`, 
              fill: 'var(--color-warning)', 
              fontSize: 9, 
              fontWeight: 900,
              position: 'insideBottomRight',
              dy: -4
            }}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 6, strokeWidth: 0, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
