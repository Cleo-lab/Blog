'use client'

import Image from 'next/image'          // ✅ добавили импорт
import { Button } from '@/components/ui/button'

interface HeroProps {
  setCurrentSection: (sectionId: string) => void
}

export default function Hero({ setCurrentSection }: HeroProps) {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[calc(100svh-4rem)] pt-12 pb-8 sm:pt-0 sm:pb-0 flex items-center justify-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="text-center z-10 px-4">
        {/* Avatar */}
        <div className="hero-avatar-gradient w-60 h-60 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-1 mb-6 mx-auto">
          <Image
  src="/videos/Yurie_main.webp"
  alt="Yurie Jiyūbō - anime character and blogger"
  width={240}
  height={240}
  priority
  className="hero-avatar w-full h-full rounded-full object-cover shadow-lg select-none"
/>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Yurie Jiyūbō
        </h1>
        <p className="text-xl sm:text-2xl text-foreground/70 font-medium mb-2">
          Digital Dreams & Pixel Magic
        </p>
        <p className="text-base sm:text-lg text-foreground/60 mb-8 leading-relaxed max-w-md mx-auto">
          Welcome to my cozy corner of the digital world. Here you&lsquo;ll find my thoughts, artwork, and stories from the magical realm where anime meets reality.
        </p>
      </div>
    </section>
  )
}


