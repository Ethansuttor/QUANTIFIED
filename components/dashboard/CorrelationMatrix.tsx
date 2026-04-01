import type { GradeWithStudyContext } from '@/types/database'

type CorrelationMatrixProps = {
  data: GradeWithStudyContext[]
}

function pearsonCorrelation(xs: number[], ys: number[]): number | null {
  const n = xs.length
  if (n < 3) return null
  const meanX = xs.reduce((a, b) => a + b, 0) / n
  const meanY = ys.reduce((a, b) => a + b, 0) / n
  const num = xs.reduce((sum, x, i) => sum + (x - meanX) * (ys[i] - meanY), 0)
  const denX = Math.sqrt(xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0))
  const denY = Math.sqrt(ys.reduce((sum, y) => sum + (y - meanY) ** 2, 0))
  if (denX === 0 || denY === 0) return null
  return num / (denX * denY)
}

function significanceLabel(r: number): string {
  const abs = Math.abs(r)
  if (abs >= 0.7) return 'High Significance'
  if (abs >= 0.4) return 'Moderate'
  return 'Weak'
}

export function CorrelationMatrix({ data }: CorrelationMatrixProps) {
  if (data.length < 3) {
    return (
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
          Correlation Matrix
        </span>
        <p className="text-on-surface-variant text-sm mt-4">
          Add at least 3 graded assessments to compute study-score correlation.
        </p>
      </div>
    )
  }

  const studyHrs = data.map((d) => d.studyHrs)
  const scores = data.map((d) =>
    d.max_score > 0 ? (d.score / d.max_score) * 100 : 0
  )

  const r = pearsonCorrelation(studyHrs, scores)
  const rDisplay = r != null ? r.toFixed(2) : '—'
  const isPositive = r == null || r >= 0
  const significance = r != null ? significanceLabel(r) : 'N/A'

  const avgStudy = studyHrs.reduce((a, b) => a + b, 0) / studyHrs.length
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

  const rows: Array<{ variable: string; r: string; direction: 'pos' | 'neg' | 'none' }> = [
    {
      variable: 'Study hrs (3d prior) → Grade %',
      r: rDisplay,
      direction: r == null ? 'none' : r >= 0 ? 'pos' : 'neg',
    },
  ]

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
      <div className="flex items-center justify-between mb-6">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
          Correlation Matrix
        </span>
        {r != null && (
          <span
            className={`font-label text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
              isPositive
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-error/10 text-error border border-error/20'
            }`}
          >
            {isPositive ? 'Positive' : 'Negative'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            r Coefficient
          </span>
          <span className="text-3xl font-black text-on-surface font-headline tabular-nums">
            {rDisplay}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            Significance
          </span>
          <span className="text-sm font-bold text-primary mt-2">{significance}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            Data Points
          </span>
          <span className="text-3xl font-black text-on-surface font-headline tabular-nums">
            {data.length}
          </span>
        </div>
      </div>

      {/* Variable table */}
      <div className="mb-4">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant pb-1 border-b border-outline-variant/10">
          <span>Variable Pair</span>
          <span>r</span>
          <span>Direction</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_auto_auto] gap-x-4 py-2.5 text-xs border-b border-outline-variant/5"
          >
            <span className="text-on-surface">{row.variable}</span>
            <span className="font-mono font-bold text-on-surface tabular-nums">{row.r}</span>
            <span
              className={`font-label uppercase text-[10px] ${
                row.direction === 'pos'
                  ? 'text-primary'
                  : row.direction === 'neg'
                  ? 'text-error'
                  : 'text-on-surface-variant'
              }`}
            >
              {row.direction === 'pos' ? 'Pos' : row.direction === 'neg' ? 'Neg' : '—'}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-high p-3 rounded-lg">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            Avg Study (3d prior)
          </span>
          <span className="block text-xl font-black text-on-surface font-headline tabular-nums mt-1">
            {avgStudy.toFixed(1)}h
          </span>
        </div>
        <div className="bg-surface-container-high p-3 rounded-lg">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            Avg Grade
          </span>
          <span className="block text-xl font-black text-on-surface font-headline tabular-nums mt-1">
            {avgScore.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
