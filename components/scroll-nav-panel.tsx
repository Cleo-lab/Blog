'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScrollNavItem {
  id: string
  label: string
}

interface ScrollNavPanelProps {
  items?: ScrollNavItem[]
  onNavigate: (id: string) => void
}

export default function ScrollNavPanel({ items = [], onNavigate }: ScrollNavPanelProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMouseNearTop, setIsMouseNearTop] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const MOUSE_DISTANCE_THRESHOLD = 100

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isNearTop = e.clientY < MOUSE_DISTANCE_THRESHOLD
      setIsMouseNearTop(isNearTop)
    }

    const handleScroll = () => {
      const hasScrolled = window.scrollY > 300
      setIsVisible(hasScrolled && isMouseNearTop)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMouseNearTop])

  if (!isVisible || items.length === 0) return null

  return (
    <div
      ref={panelRef}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="flex items-center gap-2 mb-3">
        <ChevronUp className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Jump to Section</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map((item) => (
          <Button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            variant="outline"
            size="sm"
            className="text-xs h-8 border-border/50 hover:bg-primary/10 hover:text-primary"
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}



