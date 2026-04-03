'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { QuickLogModal } from '@/components/dashboard/QuickLogModal'

const navItems = [
  { href: '/', label: 'Today', icon: 'today' },
  { href: '/week', label: 'Week', icon: 'calendar_view_week' },
  { href: 'QUICK_LOG', label: 'Log', icon: 'add' },
  { href: '/insights', label: 'Insights', icon: 'psychology' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

export function BottomMobileNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-surface-container/80 backdrop-blur-2xl border border-outline-variant/20 rounded-2xl z-50 flex items-center justify-around px-2 shadow-[0_12px_40px_rgba(0,0,0,0.6)] safe-bottom">
        {navItems.map((item) => {
          if (item.href === 'QUICK_LOG') {
            return (
              <button
                key="quick-log-btn"
                onClick={() => setIsOpen(true)}
                className="relative -top-8 w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(78,222,163,0.4)] transition-all active:scale-90 active:shadow-none group"
              >
                <div className="absolute inset-0 bg-primary rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <span className="material-symbols-outlined relative z-10 font-bold" style={{ fontSize: '28px' }}>
                  {item.icon}
                </span>
              </button>
            )
          }

          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-all ${
                isActive ? 'text-primary bg-primary/10' : 'text-on-surface-variant'
              }`}
            >
              <span 
                className="material-symbols-outlined" 
                style={{ fontSize: '24px', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-label uppercase tracking-tighter decoration-0">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <QuickLogModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
