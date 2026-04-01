import 'server-only'
import { createServerClient } from '@/lib/supabase/server'
import type { Log, LogCategory } from '@/types/database'
import { computeSessionMinutes, sumValues } from '@/lib/utils/aggregations'

export async function getLogsForDate(date: string): Promise<Log[]> {
  const supabase = createServerClient()
  const start = `${date}T00:00:00.000Z`
  const end = `${date}T23:59:59.999Z`
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .gte('created_at', start)
    .lte('created_at', end)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getLogsForDateRange(
  start: string,
  end: string,
  category?: LogCategory
): Promise<Log[]> {
  const supabase = createServerClient()
  let query = supabase
    .from('logs')
    .select('*')
    .gte('created_at', `${start}T00:00:00.000Z`)
    .lte('created_at', `${end}T23:59:59.999Z`)
    .order('created_at', { ascending: true })
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function computeStudyHoursForDate(date: string): Promise<number> {
  const logs = await getLogsForDate(date)
  const studyLogs = logs.filter((l) => l.category === 'study')
  const minutes = computeSessionMinutes(studyLogs)
  return Math.round((minutes / 60) * 10) / 10
}

export async function getDrinkCountForDate(date: string): Promise<number> {
  const logs = await getLogsForDate(date)
  const drinkLogs = logs.filter((l) => l.category === 'drink')
  return sumValues(drinkLogs)
}

export async function getSpendingForDate(date: string): Promise<number> {
  const logs = await getLogsForDate(date)
  const spendLogs = logs.filter((l) => l.category === 'spend')
  return Math.round(sumValues(spendLogs) * 100) / 100
}

export async function getWorkoutForDate(date: string): Promise<boolean> {
  const logs = await getLogsForDate(date)
  return logs.some((l) => l.category === 'workout')
}

export async function getDriveMilesForDate(date: string): Promise<number> {
  const logs = await getLogsForDate(date)
  const driveLogs = logs.filter((l) => l.category === 'drive')
  return Math.round(sumValues(driveLogs) * 10) / 10
}

export async function insertLog(data: Omit<Log, 'id' | 'created_at'>) {
  const supabase = createServerClient()
  const { error } = await supabase.from('logs').insert([data])
  if (error) throw error
}
