'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'

type DataPoint = { label: string; value: number }

type BaseBarChartProps = {
  data: DataPoint[] | null
  color?: string
  unit?: string
  referenceValue?: number
  referenceLabel?: string
  dangerThreshold?: number
}

export default function BaseBarChart({
  data,
  color = '#7c6af7',
  unit,
  referenceValue,
  referenceLabel,
  dangerThreshold,
}: BaseBarChartProps) {
  if (!data) return <Skeleton className="h-48 w-full" />

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -24 }}>
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
          cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
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
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={32}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                dangerThreshold !== undefined && entry.value > dangerThreshold
                  ? 'var(--color-danger)'
                  : color || 'var(--color-accent)'
              }
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
