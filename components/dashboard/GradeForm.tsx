'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addGrade } from '@/app/actions/grades'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import type { GradeFormState } from '@/types/api'

const EXAM_TYPES = ['quiz', 'homework', 'midterm', 'final', 'project', 'lab']

export function GradeForm() {
  const [state, action, pending] = useActionState<GradeFormState, FormData>(addGrade, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Course" name="course" placeholder="e.g. ECE 515" required />
        <Select label="Exam type" name="exam_type" required>
          <option value="">Select type</option>
          {EXAM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </Select>
        <Input label="Score" name="score" type="number" min="0" step="0.01" required />
        <Input label="Max score" name="max_score" type="number" min="0.01" step="0.01" required />
        <Input label="Date" name="date" type="date" required />
      </div>
      {state?.error && (
        <p className="text-sm text-danger">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-success">Grade saved.</p>
      )}
      <Button type="submit" loading={pending} size="md" className="self-start">
        Add grade
      </Button>
    </form>
  )
}
