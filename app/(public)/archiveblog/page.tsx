import type { Metadata } from 'next'
import ArchiveBlogClient from '@/components/archive-blog-client'
import BackToSite from '@/components/back-to-site'

export const metadata: Metadata = {
  title: 'Blog Archive — Yurie Jiyūbō',
  description: 'Explore the full collection of stories, digital experiments, and creative insights by Yurie.',
  alternates: { 
    canonical: 'https://yurieblog.vercel.app/archiveblog' 
  },
  // ✅ Настройки для соцсетей (Bluesky, Telegram, Discord)
  openGraph: {
    title: 'Blog Archive — Yurie Jiyūbō',
    description: 'Explore the full collection of stories, digital experiments, and creative insights by Yurie.',
    url: 'https://yurieblog.vercel.app/archiveblog',
    siteName: 'Yurie Blog',
    images: [
      {
        url: '/images/Archive_Preview.webp', // Создайте и положите сюда красивую картинку!
        width: 1200,
        height: 630,
        alt: 'Yurie Blog Archive Preview',
      },
    ],
    type: 'website',
  },
  // Настройки для Twitter/X
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Archive — Yurie Jiyūbō',
    description: 'Explore the full collection of stories and creative insights.',
    images: ['/images/Archive_Preview.webp'],
  },
}

export default function ArchiveBlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        Blog Archive
      </h1>
      <ArchiveBlogClient />
      <BackToSite />
    </main>
  )
}