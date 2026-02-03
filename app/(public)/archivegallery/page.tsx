import type { Metadata } from 'next'
import ArchiveGalleryClient from '@/components/archive-gallery-client'
import BackToSite from '@/components/back-to-site'
import { BRAND, getSchemaDescription } from '@/lib/brand-voice' // ✅ Импорт нашего конфига

export const metadata: Metadata = {
  // ✅ Используем BRAND для заголовка и описания
  title: BRAND.titles.gallery,
  description: BRAND.descriptions.gallery,
  alternates: { 
    canonical: `${BRAND.siteUrl}/archivegallery` 
  },
  openGraph: {
    title: BRAND.titles.gallery,
    description: BRAND.taglines.medium,
    url: `${BRAND.siteUrl}/archivegallery`,
    siteName: BRAND.siteName,
    type: 'website',
    images: [
      {
        url: `${BRAND.siteUrl}/images/Archive_Preview.webp`, // Или специфичное превью для галереи
        width: 1200,
        height: 630,
        alt: BRAND.headings.gallery,
      },
    ],
  },
}

export default function ArchiveGalleryPage() {
  // Данные Schema.org для галереи
  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    'name': BRAND.titles.gallery,
    'description': getSchemaDescription('gallery'),
    'author': {
      '@type': 'Person',
      'name': BRAND.authorName
    }
  }

  return (
    <>
      {/* ✅ Добавляем микроразметку для лучшего индексирования картинок в Google Images */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-12">
          {/* ✅ H1 из BRAND (Gallery Archive — Visual Proof...) */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent leading-tight">
            {BRAND.headings.gallery}
          </h1>
          
          {/* ✅ Текст интро из BRAND про AI эксперименты */}
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed italic">
            {BRAND.intros.gallery}
          </p>
        </div>

        {/* Клиентский компонент галереи */}
        <section aria-label="Visual experiments grid">
          <ArchiveGalleryClient />
        </section>

        <div className="mt-12 pt-8 border-t border-border/30">
          <BackToSite /> 
        </div>
      </main>
    </>
  )
}