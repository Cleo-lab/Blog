'use client'

import { Button } from '@/components/ui/button'

export default function HeroButtons() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="flex gap-4 justify-center">
      <div className="w-36">
        <Button onClick={() => scrollTo('blog')} size="lg" className="w-full" style={{ minWidth: '144px', maxWidth: '144px' }}>
          Read Stories
        </Button>
      </div>
      <div className="w-36">
        <Button onClick={() => scrollTo('gallery')} size="lg" className="w-full" style={{ minWidth: '144px', maxWidth: '144px' }}>
          Gallery
        </Button>
      </div>
    </div>
  )
}