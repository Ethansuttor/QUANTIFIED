export type LogCategory = 'study' | 'drive' | 'drink' | 'workout' | 'spend'

export type Log = {
  id: number
  created_at: string
  category: LogCategory
  event: string | null
  value: number | null
  notes: string | null
}

export type LogInsert = Omit<Log, 'id' | 'created_at'>

export type DailySummary = {
  date: string // ISO date "YYYY-MM-DD"
  sleep_hrs: number | null
  mood: 1 | 2 | 3 | 4 | 5 | null
  energy: 1 | 2 | 3 | 4 | 5 | null
  screen_hrs: number | null
}

export type DailySummaryInsert = DailySummary

export type Grade = {
  id: number
  date: string
  course: string
  exam_type: string
  score: number
  max_score: number
}

export type GradeInsert = Omit<Grade, 'id'>

export type GradeWithStudyContext = Grade & {
  studyHrs: number
}
