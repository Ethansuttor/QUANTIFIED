'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'
import type { GradeWithStudyContext } from '@/types/database'

type GradeOverlayChartProps = {
  data: GradeWithStudyContext[] | null
}

export default function GradeOverlayChart({ data }: GradeOverlayChartProps) {
  if (!data) return <Skeleton className="h-64 w-full" />

  const chartData = data.map((g) => ({
    label: `${g.course} ${g.exam_type}`,
    score: Math.round((g.score / g.max_score) * 100),
    studyHrs: g.studyHrs,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 12, right: 16, bottom: 0, left: -24 }}>
        <CartesianGrid strokeDasharray="6 6" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--color-muted)', fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          yAxisId="score"
          tick={{ fill: 'var(--color-muted)', fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          unit="%"
          domain={[0, 100]}
          dx={-4}
        />
        <YAxis
          yAxisId="study"
          orientation="right"
          tick={{ fill: 'var(--color-muted)', fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          unit="h"
          dx={4}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="glass rounded-xl p-3 shadow-2xl border border-white/10 min-w-[140px]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted/60 mb-2">{label}</p>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold text-accent uppercase">Score</span>
                      <span className="text-sm font-black text-text">{payload[0].value}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold text-warning uppercase">Study</span>
                      <span className="text-sm font-black text-text">{payload[1].value}h</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          wrapperStyle={{ 
            fontSize: '10px', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            paddingBottom: '20px'
          }}
        />
        <Bar 
          yAxisId="score" 
          dataKey="score" 
          fill="var(--color-accent)" 
          radius={[6, 6, 0, 0]} 
          name="Score" 
          maxBarSize={40}
        />
        <Line
          yAxisId="study"
          type="monotone"
          dataKey="studyHrs"
          stroke="var(--color-warning)"
          strokeWidth={3}
          dot={{ fill: 'var(--color-warning)', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          name="Study Preparation"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
