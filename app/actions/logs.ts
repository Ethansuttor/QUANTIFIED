'use server'

import { auth } from '@/auth'
import { insertLog } from '@/lib/db/logs'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const logSchema = z.object({
  category: z.enum(['study', 'drive', 'drink', 'workout', 'spend']),
  value: z.number().nullable(),
  event: z.string().nullable(),
  notes: z.string().nullable(),
})

export type LogActionState = {
  success?: boolean
  error?: string
}

export async function addLogAction(
  _prevState: LogActionState,
  formData: FormData
): Promise<LogActionState> {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const category = formData.get('category') as any
  const value = formData.get('value') ? Number(formData.get('value')) : null
  const event = formData.get('event') as string | null
  const notes = formData.get('notes') as string | null

  try {
    const validated = logSchema.parse({ category, value, event, notes })
    await insertLog(validated)
    
    // Revalidate paths to update the UI
    revalidatePath('/')
    revalidatePath('/week')
    revalidatePath('/trends')
    revalidatePath('/insights')
    
    return { success: true }
  } catch (err: any) {
    console.error('[ADD_LOG_ERROR]', err)
    return { error: err.message || 'Failed to save log' }
  }
}
