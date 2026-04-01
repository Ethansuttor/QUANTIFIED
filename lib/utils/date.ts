export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function today(): string {
  return toISODate(new Date())
}

export function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

export function dateRange(start: string, end: string): string[] {
  const dates: string[] = []
  const current = new Date(start)
  const last = new Date(end)
  while (current <= last) {
    dates.push(toISODate(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function subtractDays(isoDate: string, n: number): string {
  const d = new Date(isoDate + 'T00:00:00')
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return d
}

export function weekLabel(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })
}
