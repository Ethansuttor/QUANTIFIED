import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg px-4">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(139,92,246,0.12) 0%, transparent 65%)',
            'radial-gradient(ellipse 50% 40% at 10% 90%, rgba(59,130,246,0.06) 0%, transparent 60%)',
            'radial-gradient(ellipse 40% 30% at 90% 80%, rgba(139,92,246,0.05) 0%, transparent 60%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[360px]">
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="gradient-accent-shine flex h-10 w-10 items-center justify-center rounded-xl">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.95" />
              <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.55" />
              <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.55" />
              <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.25" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="gradient-text text-lg font-semibold">Life Dashboard</h1>
            <p className="mt-0.5 text-sm text-muted">Sign in to access your data</p>
          </div>
        </div>

        {/* Form card */}
        <div className="card-shadow rounded-[var(--radius-card)] border border-border bg-surface p-6">
          <LoginForm />
        </div>

        <p className="mt-5 text-center text-xs text-muted/50">
          Personal tracking — your data stays private
        </p>
      </div>
    </div>
  )
}
