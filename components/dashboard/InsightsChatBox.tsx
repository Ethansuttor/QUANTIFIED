'use client'

import { useChat } from '@ai-sdk/react'
import { isTextUIPart } from 'ai'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Send, Sparkles } from 'lucide-react'

type InsightsChatBoxProps = {
  contextSummary: string
}

const SUGGESTED = [
  'How many hours did I study last week?',
  'Do I drink more on high screen-time days?',
  "What's my average mood after 6+ hours of sleep?",
]

export function InsightsChatBox({ contextSummary }: InsightsChatBoxProps) {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status } = useChat({
    body: { context: contextSummary },
  } as any)

  const isLoading = status === 'submitted' || status === 'streaming'
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Message area */}
      <div className="card-shadow flex-1 overflow-y-auto rounded-[var(--radius-card)] border border-border bg-surface p-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-6 py-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="gradient-accent-shine flex h-11 w-11 items-center justify-center rounded-xl">
                <Sparkles size={18} strokeWidth={1.75} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">AI Data Analyst</p>
                <p className="mt-0.5 text-xs text-muted">
                  Ask about your study habits, spending, or health patterns.
                </p>
              </div>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInput(q)}
                  className="cursor-pointer rounded-[var(--radius-inner)] border border-border bg-surface-2 px-4 py-2.5 text-left text-xs text-muted transition-all duration-150 hover:border-accent/25 hover:bg-surface-3 hover:text-text"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {messages.map((m) => {
            const text = m.parts.filter(isTextUIPart).map((p) => p.text).join('')
            const isUser = m.role === 'user'
            return (
              <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-[var(--radius-card)] px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'gradient-accent text-white shadow-lg shadow-accent/15'
                      : 'border border-border bg-surface-2 text-text'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{text}</p>
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-[var(--radius-card)] border border-border bg-surface-2 px-4 py-3.5">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent/50"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your data..."
          className="flex-1 rounded-[var(--radius-inner)] border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-muted/50 transition-all duration-150 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15"
        />
        <Button type="submit" disabled={!input.trim() || isLoading} className="shrink-0">
          <Send size={14} />
          Send
        </Button>
      </form>
    </div>
  )
}
