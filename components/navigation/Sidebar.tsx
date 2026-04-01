'use client'

import { NavItem } from './NavItem'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Today', icon: 'today' },
  { href: '/week', label: 'Week', icon: 'calendar_view_week' },
  { href: '/trends', label: 'Trends', icon: 'query_stats' },
  { href: '/grades', label: 'Grades', icon: 'school' },
  { href: '/insights', label: 'Insights', icon: 'psychology' },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col h-[calc(100vh-3.5rem)] w-64 border-r border-zinc-800/30 bg-zinc-950 pt-10 pb-4 shrink-0">
      <div className="px-6 mb-8">
        <h2 className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
          Precision HUD
        </h2>
        <p className="text-[10px] text-primary mt-1 font-mono">Sync: Supabase Live</p>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="px-6 mt-auto pt-8 border-t border-zinc-800/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-200">Operator_01</span>
            <span className="text-[10px] text-zinc-500 font-mono">LIVE</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/settings"
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              settings
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest">Settings</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 text-error-dim hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              logout
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
