import { getGradesWithStudyContext, getAllGrades } from '@/lib/db/grades'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { GradeForm } from '@/components/dashboard/GradeForm'
import { GradeTable } from '@/components/dashboard/GradeTable'
import GradeOverlayChart from '@/components/charts/GradeOverlayChart'
import { CorrelationMatrix } from '@/components/dashboard/CorrelationMatrix'

export default async function GradesPage() {
  try {
    const [grades, gradesWithContext] = await Promise.all([
      getAllGrades(),
      getGradesWithStudyContext(),
    ])

    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-1.5 border-b border-border pb-6">
          <h1 className="gradient-text text-2xl font-semibold tracking-tight">Grades</h1>
          <p className="text-xs text-muted">Academic performance &amp; study correlation</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Add grade</CardTitle>
          </CardHeader>
          <GradeForm />
        </Card>

        <CorrelationMatrix data={gradesWithContext} />

        {gradesWithContext.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Score vs study hours (3 days prior)</CardTitle>
            </CardHeader>
            <GradeOverlayChart data={gradesWithContext} />
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <GradeTable grades={grades} />
        </Card>
      </div>
    )
  } catch {
    return <p className="text-sm text-danger">Failed to load grades. Please refresh.</p>
  }
}
