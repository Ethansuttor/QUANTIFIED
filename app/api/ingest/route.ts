import 'server-only'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ingestSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('log'),
    data: z.object({
      category: z.enum(['study', 'drive', 'drink', 'workout', 'spend']),
      event: z.string().optional(),
      value: z.number().optional(),
      notes: z.string().optional(),
      created_at: z.string().datetime().optional(),
    }),
  }),
  z.object({
    type: z.literal('summary'),
    data: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      sleep_hrs: z.number().optional().nullable(),
      mood: z.number().min(1).max(5).optional().nullable(),
      energy: z.number().min(1).max(5).optional().nullable(),
      screen_hrs: z.number().optional().nullable(),
    }),
  }),
])

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token || token !== process.env.INGEST_TOKEN) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const result = ingestSchema.safeParse(body)

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Invalid payload', details: result.error.format() }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = createServerClient()
    const { type, data } = result.data

    if (type === 'log') {
      const { error } = await supabase.from('logs').insert([data])
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('daily_summaries')
        .upsert([data], { onConflict: 'date' })
      if (error) throw error
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('[INGEST_ERROR]', error)
    return new Response(JSON.stringify({ error: 'Ingestion failed', message: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
