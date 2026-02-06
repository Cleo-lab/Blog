
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumbs from '@/components/breadcrumbs'
import BackToSite from '@/components/back-to-site'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { BRAND, getSchemaDescription } from '@/lib/brand-voice'

export const metadata: Metadata = {
  // ✅ Используем BRAND для единообразия
  title: BRAND.titles.gallery,
  description: BRAND.descriptions.gallery,
  
  alternates: { 
    canonical: `${BRAND.siteUrl}/gallery` 
  },
  
  openGraph: {
    title: BRAND.titles.gallery,
    description: BRAND.taglines.medium,
    url: `${BRAND.siteUrl}/gallery`,
    siteName: BRAND.siteName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BRAND.siteUrl}/images/Yurie_main.jpg`,
        width: 1200,
        height: 630,
        alt: BRAND.headings.gallery,
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: BRAND.titles.gallery,
    description: BRAND.taglines.short,
    images: [`${BRAND.siteUrl}/images/Yurie_main.jpg`],
    creator: '@yurieblog.bsky.social',
  },
}

export const revalidate = 86400

export default async function GalleryPage() {
  const supabase = createServiceSupabase()
  
  const { data: images, count } = await supabase
    .from('gallery')
    .select('id, title, description, image, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })

  // ✅ Schema.org с данными из BRAND
  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BRAND.siteUrl}/gallery`,
    name: BRAND.titles.gallery,
    description: getSchemaDescription('gallery'),
    url: `${BRAND.siteUrl}/gallery`,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      '@id': `${BRAND.siteUrl}/#author`,
      name: BRAND.authorName,
      url: BRAND.siteUrl,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BRAND.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gallery',
        item: `${BRAND.siteUrl}/gallery`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="mb-12">
          {/* ✅ H1 из BRAND */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {BRAND.headings.gallery}
          </h1>
          
          {/* ✅ Intro из BRAND */}
          <p className="text-foreground/80 text-lg mb-2">
            {BRAND.intros.gallery}
          </p>
          
          <p className="text-foreground/60">
            {count || 0} images in collection
          </p>
          
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-4" />
        </div>

        {/* Gallery Grid */}
        {images && images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {images.map((item) => (
              <Link key={item.id} href={`/gallery/${item.id}`}>
                <article className="group relative h-64 rounded-xl overflow-hidden cursor-pointer bg-card border border-border/50 transition-transform hover:scale-105">
                  <Image
                    src={item.image}
                    alt={item.title || 'Gallery image'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <p className="text-white font-semibold">{item.title || 'Untitled'}</p>
                      {item.description && (
                        <p className="text-white/80 text-sm mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground/60 text-lg">No images yet. Check back soon!</p>
          </div>
        )}

        {/* Bluesky CTA */}
        <aside className="mt-16 p-6 rounded-2xl bg-[#0085ff]/10 border border-[#0085ff]/30 shadow-sm max-w-3xl">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-foreground">
            Visual updates! 🦋
          </h2>
          <p className="text-lg text-foreground/80 mb-6">
            {BRAND.ctas.followBluesky}
          </p>
          <a
            href="https://bsky.app/profile/yurieblog.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0085ff] text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 active:scale-95"
          >
            Follow @yurieblog
          </a>
        </aside>

        <div className="mt-12">
          <BackToSite />
        </div>
      </main>
    </>
  )
}