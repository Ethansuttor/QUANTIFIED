import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Sparkles } from 'lucide-react'

type AISummaryCardProps = {
  summary: string | null
}

export function AISummaryCard({ summary }: AISummaryCardProps) {
  if (!summary) return null

  const bullets = summary
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly AI Summary</CardTitle>
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-dim text-accent-2">
          <Sparkles size={13} strokeWidth={2} />
        </div>
      </CardHeader>
      <ul className="flex flex-col gap-2.5">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-text">
            <span
              className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
              style={{ boxShadow: '0 0 4px rgba(14,165,233,0.5)' }}
            />
            {bullet}
          </li>
        ))}
      </ul>
    </Card>
  )
}
