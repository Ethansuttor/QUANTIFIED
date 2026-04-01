import 'server-only'
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { auth } from '@/auth'
import { z } from 'zod'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(20000).optional(),
  parts: z.array(z.any()).optional(),
})

const insightsRequestSchema = z.object({
  messages: z.array(z.any()).min(1).max(50),
  context: z.string().max(50000),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || !body.messages) return new Response('Missing messages', { status: 400 })

  const { messages, context } = body as { messages: any[], context?: string }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are a personal analytics assistant for a college student tracking their life data. Be concise and specific — cite actual numbers from the data when answering. Here is the user's recent data:\n\n${context ?? 'No data provided.'}`,
    messages: messages.map((m: any) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.parts 
        ? m.parts.map((p: any) => p.text || '').join('')
        : m.content || ' ', // Fallback to space to avoid empty content error
    })),
  })

  return result.toUIMessageStreamResponse()
}
