import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="glass max-w-md rounded-[var(--radius-card)] p-12 shadow-2xl">
        <h1 className="text-8xl font-black tracking-tighter text-accent/20">404</h1>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-text">Page Lost in Orbit</h2>
        <p className="mt-4 text-sm font-medium text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to a different dimension.
        </p>
        <Link href="/" className="mt-10 inline-block">
          <Button className="rounded-xl px-8 font-black uppercase tracking-widest">
            <Home size={18} strokeWidth={2.5} />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
