import type { Metadata } from 'next'
import ArchiveGalleryClient from '@/components/archive-gallery-client'
import BackToSite from '@/components/back-to-site'

// Вставляем сюда:
export const metadata: Metadata = {
  title: 'Gallery Archive — Yurie Jiyūbū', // Заголовок для вкладки браузера и Google
  description: 'Explore the visual journey and digital art collection by Yurie.', // Желательно добавить и описание
  alternates: { 
    canonical: 'https://yurieblog.vercel.app/archivegallery' 
  }
}

export default function ArchiveGalleryPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
        Gallery Archive
      </h1>
      <ArchiveGalleryClient />
      {/* Убираем color="purple", чтобы не было ошибки TypeScript */}
      <BackToSite /> 
    </main>
  )
}