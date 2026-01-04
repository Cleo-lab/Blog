import HomeWrapper from '@/components/home-wrapper'
import HeroServer from '@/components/hero-server'
import { Suspense } from 'react'

// === Больше НЕТ Supabase-запроса здесь ===
// Всё перенесено в <BlogSection>, который клиентский

export default function Page() {
  return (
    <HomeWrapper
      initialPosts={[]} // ✅ Пусто — посты подгрузятся клиентом
      hero={<HeroServer />}
    />
  )
}