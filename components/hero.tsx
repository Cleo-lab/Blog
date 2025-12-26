'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface HeroProps {
  setCurrentSection: (sectionId: string) => void
}

export default function Hero({ setCurrentSection }: HeroProps) {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[calc(100svh-4rem)] pt-12 pb-8 flex items-center justify-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="text-center z-10 px-4">
        <div className="hero-avatar-gradient w-60 h-60 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-1 mb-6 mx-auto">
          <Image
            src="/images/Yurie_main.jpg" // 1. ИСПРАВЛЕНО на .jpg
            alt="Yurie Jiyūbō"
            width={240}
            height={240}
            priority      
            quality={95}  // 2. Увеличили качество до 95 для JPG
            sizes="(max-width: 768px) 240px, 480px" // 3. Улучшили подсказку для четкости
            className="hero-avatar w-full h-full rounded-full object-cover shadow-xl select-none"
            draggable="false"
          />
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Yurie Jiyūbō
        </h1>
        
        <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-lg mx-auto">
          Anime character, digital dreams, and cozy creativity.
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => setCurrentSection('blog')} size="lg">Read Stories</Button>
          <Button onClick={() => setCurrentSection('support')} variant="outline" size="lg">Support Me</Button>
        </div>
      </div>
    </section>
  )
}