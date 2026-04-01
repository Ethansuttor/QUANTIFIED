import type { Log } from '@/types/database'
import { toISODate } from './date'

export function sumValues(logs: Log[]): number {
  return logs.reduce((acc, log) => acc + (log.value ?? 0), 0)
}

export function computeSessionMinutes(logs: Log[]): number {
  const starts = logs
    .filter((l) => l.event === 'start')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  const stops = logs
    .filter((l) => l.event === 'stop')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  let total = 0
  for (let i = 0; i < Math.min(starts.length, stops.length); i++) {
    const start = new Date(starts[i].created_at).getTime()
    const stop = new Date(stops[i].created_at).getTime()
    if (stop > start) total += (stop - start) / 60000
  }
  return Math.round(total)
}

export function groupByDay<T extends { date: string; value: number }>(
  items: T[]
): Array<{ label: string; value: number }> {
  const map = new Map<string, number>()
  for (const item of items) {
    map.set(item.date, (map.get(item.date) ?? 0) + item.value)
  }
  return Array.from(map.entries()).map(([date, value]) => ({
    label: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
    value,
  }))
}

export function groupByWeek(
  logs: Log[],
  valueExtractor: (logs: Log[]) => number
): Array<{ label: string; value: number }> {
  const weeks = new Map<string, Log[]>()
  for (const log of logs) {
    const d = new Date(log.created_at)
    const sunday = new Date(d)
    sunday.setDate(d.getDate() - d.getDay())
    const key = toISODate(sunday)
    if (!weeks.has(key)) weeks.set(key, [])
    weeks.get(key)!.push(log)
  }
  return Array.from(weeks.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, wLogs]) => ({
      label: new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: valueExtractor(wLogs),
    }))
}

export function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}
