'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItemProps = {
  href: string
  label: string
  icon: string
}

export function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-6 py-3 transition-all duration-200 border-r-2 ${
        isActive
          ? 'bg-primary/10 text-primary border-primary'
          : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-high border-transparent'
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: '20px',
          fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        {icon}
      </span>
      <span className="font-label text-xs uppercase tracking-widest">{label}</span>
    </Link>
  )
}
