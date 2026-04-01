'use server'

import { auth } from '@/auth'
import { insertGrade } from '@/lib/db/grades'
import { revalidatePath } from 'next/cache'
import type { GradeFormState } from '@/types/api'

export async function addGrade(
  _prevState: GradeFormState,
  formData: FormData
): Promise<GradeFormState> {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const course = String(formData.get('course') ?? '').trim()
  const examType = String(formData.get('exam_type') ?? '').trim()
  const score = Number(formData.get('score'))
  const maxScore = Number(formData.get('max_score'))
  const date = String(formData.get('date') ?? '').trim()

  if (!course || !examType || !date) return { error: 'All fields are required' }
  if (isNaN(score) || isNaN(maxScore)) return { error: 'Score must be a number' }
  if (maxScore <= 0) return { error: 'Max score must be greater than 0' }
  if (score < 0 || score > maxScore) return { error: `Score must be between 0 and ${maxScore}` }

  try {
    await insertGrade({ course, exam_type: examType, score, max_score: maxScore, date })
    revalidatePath('/grades')
    return { success: true }
  } catch {
    return { error: 'Failed to save grade' }
  }
}
