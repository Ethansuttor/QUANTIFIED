'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type DialogProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Dialog container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-surface-container shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <header className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-4">
          <h2 className="font-headline text-lg font-black tracking-tight text-on-surface uppercase italic">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <X size={18} />
          </button>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
