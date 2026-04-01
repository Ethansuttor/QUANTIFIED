import 'server-only'
import { createServerClient } from '@/lib/supabase/server'
import type { Grade, GradeInsert, GradeWithStudyContext, Log } from '@/types/database'
import { getLogsForDateRange } from './logs'
import { computeSessionMinutes } from '@/lib/utils/aggregations'
import { subtractDays } from '@/lib/utils/date'

export async function getAllGrades(): Promise<Grade[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getGradesWithStudyContext(): Promise<GradeWithStudyContext[]> {
  const grades = await getAllGrades()
  if (grades.length === 0) return []

  // Single query covering the entire study-context window for all grades
  const gradeDates = grades.map((g) => g.date).sort()
  const earliestStudyDate = subtractDays(gradeDates[0], 3)
  const latestStudyDate = subtractDays(gradeDates[gradeDates.length - 1], 1)

  const studyLogs = await getLogsForDateRange(earliestStudyDate, latestStudyDate, 'study')

  // Build date → logs index for O(1) lookup
  const logsByDate = new Map<string, Log[]>()
  for (const log of studyLogs) {
    const day = log.created_at.split('T')[0]
    if (!logsByDate.has(day)) logsByDate.set(day, [])
    logsByDate.get(day)!.push(log)
  }

  return grades.map((grade) => {
    let totalMinutes = 0
    for (let i = 1; i <= 3; i++) {
      const d = subtractDays(grade.date, i)
      totalMinutes += computeSessionMinutes(logsByDate.get(d) ?? [])
    }
    return { ...grade, studyHrs: Math.round((totalMinutes / 60) * 10) / 10 }
  })
}

export async function insertGrade(data: GradeInsert): Promise<Grade> {
  const supabase = createServerClient()
  const { data: inserted, error } = await supabase
    .from('grades')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return inserted
}
