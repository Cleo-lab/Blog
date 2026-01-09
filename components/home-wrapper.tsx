'use client'

import { Suspense } from 'react'
import HomeClient from './home-client'
import type { Profile } from '@/lib/profile' // Импортируем тип

interface HomeWrapperProps {
  initialPosts: any[];
  hero: React.ReactNode;
  initialProfile?: Profile | null; // ✅ Добавляем профиль в интерфейс
}

export default function HomeWrapper({ initialPosts, hero, initialProfile }: HomeWrapperProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      {/* ✅ Передаем initialProfile дальше в HomeClient */}
      <HomeClient 
        initialPosts={initialPosts} 
        hero={hero} 
        initialProfile={initialProfile} 
      />
    </Suspense>
  )
}