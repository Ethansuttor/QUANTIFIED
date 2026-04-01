import type { Grade } from '@/types/database'
import { formatDate } from '@/lib/utils/date'

type GradeTableProps = {
  grades: Grade[]
}

export function GradeTable({ grades }: GradeTableProps) {
  if (grades.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted">
        No grades yet. Add your first grade above.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted/60">Date</th>
            <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted/60">Course</th>
            <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted/60">Type</th>
            <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted/60">Score</th>
            <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted/60">%</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => {
            const pct = Math.round((g.score / g.max_score) * 100)
            const pctStyle =
              pct >= 90
                ? 'text-success bg-success-dim border-success/20'
                : pct >= 70
                ? 'text-text bg-surface-3 border-border-strong'
                : 'text-danger bg-danger/10 border-danger/20'
            return (
              <tr
                key={g.id}
                className="border-b border-border/40 transition-colors duration-100 last:border-0 hover:bg-surface-2/60"
              >
                <td className="py-3.5 pr-4 text-xs text-muted">{formatDate(g.date)}</td>
                <td className="py-3.5 pr-4 font-medium text-text">{g.course}</td>
                <td className="py-3.5 pr-4 capitalize text-muted">{g.exam_type}</td>
                <td className="py-3.5 pr-4 text-right tabular-nums text-text">
                  {g.score}/{g.max_score}
                </td>
                <td className="py-3.5 text-right">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${pctStyle}`}
                  >
                    {pct}%
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
