'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { RotateCw, Home, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(239,68,68,0.06) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div className="card-shadow relative max-w-lg rounded-[var(--radius-card)] border border-border bg-surface p-10">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-danger/20 bg-danger/10 text-danger">
          <Zap size={28} strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-text">Something went wrong</h2>
        <p className="mt-3 text-sm text-muted">
          An unexpected error occurred while loading your data.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button onClick={() => reset()}>
            <RotateCw size={14} />
            Try again
          </Button>
          <Link href="/">
            <Button variant="secondary">
              <Home size={14} />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
