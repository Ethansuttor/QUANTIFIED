'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { QuickLogModal } from '@/components/dashboard/QuickLogModal'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Today' },
  { href: '/week', label: 'Week' },
  { href: '/insights', label: 'Insights' },
]

export function TopNavBar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full border-b border-outline-variant/10 bg-background/70 backdrop-blur-xl z-50 flex justify-between items-center px-4 md:px-6 h-14 shadow-[0_12px_32px_rgba(0,0,0,0.5)] safe-top">
      <div className="flex items-center gap-8">
        <span className="text-lg font-black tracking-tighter text-on-surface">QUANTIFIED</span>
        <div className="hidden md:flex gap-2 items-center">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold tracking-tight px-3 py-1.5 rounded transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-outline-variant/10">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
          >
            sync
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            Live Syncing
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="hidden md:block bg-primary/20 text-primary border border-primary/20 px-4 py-1.5 text-xs font-label uppercase tracking-widest rounded hover:bg-primary/30 transition-all active:scale-95"
        >
          Quick Log
        </button>
      </div>

      <QuickLogModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  )
}
