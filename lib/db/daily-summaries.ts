import 'server-only'
import { createServerClient } from '@/lib/supabase/server'
import type { DailySummary, DailySummaryInsert } from '@/types/database'

export async function getSummaryForDate(date: string): Promise<DailySummary | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('date', date)
    .single()
  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data
}

export async function getSummariesForDateRange(
  start: string,
  end: string
): Promise<DailySummary[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('daily_summaries')
    .select('*')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function upsertSummary(data: DailySummaryInsert): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('daily_summaries')
    .upsert(data, { onConflict: 'date' })
  if (error) throw error
}
