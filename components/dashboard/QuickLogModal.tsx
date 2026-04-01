'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { addLogAction, LogActionState } from '@/app/actions/logs'
import { LogCategory } from '@/types/database'
import { Sparkles, CheckCircle2 } from 'lucide-react'

type QuickLogModalProps = {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES: { value: LogCategory; label: string; icon: string; unit?: string }[] = [
  { value: 'study', label: 'Study session', icon: 'menu_book', unit: 'min' },
  { value: 'spend', label: 'Spending', icon: 'payments', unit: '$' },
  { value: 'drink', label: 'Beverage', icon: 'local_drink', unit: 'count' },
  { value: 'workout', label: 'Workout', icon: 'fitness_center' },
  { value: 'drive', label: 'Driving', icon: 'directions_car', unit: 'mi' },
]

export function QuickLogModal({ isOpen, onClose }: QuickLogModalProps) {
  const [state, action, pending] = useActionState<LogActionState, FormData>(addLogAction, {})
  const [category, setCategory] = useState<LogCategory>('study')

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state.success, onClose])

  const selectedCategory = CATEGORIES.find(c => c.value === category)

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Initialize Quick Log">
      {state.success ? (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20 shadow-lg shadow-primary/10">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-headline font-black text-on-surface uppercase italic">Sync Successful</h3>
          <p className="text-sm text-on-surface-variant mt-1">Life event persistent in Supabase.</p>
        </div>
      ) : (
        <form action={action} className="space-y-6">
          <div className="space-y-4">
            <Select 
              label="Select Category" 
              name="category" 
              value={category}
              onChange={(e) => setCategory(e.target.value as LogCategory)}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              {category !== 'workout' && (
                <Input
                  label={selectedCategory?.unit ? `Value (${selectedCategory.unit})` : 'Value'}
                  name="value"
                  type="number"
                  step={category === 'spend' ? '0.01' : '1'}
                  placeholder={category === 'study' ? '60' : '0'}
                  required
                />
              )}
              <Input
                label="Quick Notes"
                name="notes"
                placeholder="Details (optional)"
              />
            </div>

            {category === 'study' && (
              <Input
                label="Task Name"
                name="event"
                placeholder="e.g. CS 301 Review"
              />
            )}
          </div>

          {state.error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-mono">
              [SYS_ERROR]: {state.error}
            </div>
          )}

          <footer className="pt-2">
            <Button 
              type="submit" 
              loading={pending}
              className="w-full h-12 text-sm font-label uppercase tracking-widest"
            >
              <Sparkles size={16} />
              Transmit Log
            </Button>
          </footer>
        </form>
      )}
    </Dialog>
  )
}
