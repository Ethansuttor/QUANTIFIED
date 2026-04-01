export type InsightsRequest = {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  context: string
}

export type GradeFormState = {
  error?: string
  success?: boolean
} | null
