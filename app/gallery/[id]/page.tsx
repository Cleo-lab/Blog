// app/gallery/[id]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link' // Добавь импорт Link
import { createServiceSupabase } from '@/lib/supabaseServer'
import GalleryImageClient from './gallery-image-client'

const siteUrl = 'https://yurieblog.vercel.app'
const siteName = 'Yurie Blog'
const authorName = 'Yurie Jiyūbō'

export const revalidate = 86400

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const supabase = createServiceSupabase()

  const { data: image } = await supabase
    .from('gallery')
    .select('id, title, description, image, created_at')
    .eq('id', id)
    .single()

  if (!image) {
    return { title: 'Image Not Found' }
  }

  const description = image.description 
    ? image.description.slice(0, 160).trim() 
    : `Gallery image: ${image.title}`

  const imageUrl = image.image || `${siteUrl}/images/Yurie_main.jpg`

  // ✅ ВОТ ЭТО ВОЗВРАТ (return) обязателен:
  return {
    title: `${image.title} | Gallery | ${siteName}`,
    description,
    alternates: {
      canonical: `${siteUrl}/gallery/${image.id}`,
    },
    openGraph: {
      type: 'article',
      title: image.title,
      description,
      url: `${siteUrl}/gallery/${image.id}`,
      siteName: siteName,
      locale: 'en_US',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: image.title }],
      publishedTime: image.created_at ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: image.title,
      description,
      images: [imageUrl],
      creator: '@yurieblog.bsky.social',
    },
  }
}

export default async function GalleryImagePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = createServiceSupabase()

  // Fetch текущую картинку
  const { data: image, error } = await supabase
    .from('gallery')
    .select('id, title, description, image, created_at')
    .eq('id', id)
    .single()

  if (error || !image) {
    notFound()
  }

  // ✅ ПОЛУЧАЕМ ПРЕДЫДУЩУЮ И СЛЕДУЮЩУЮ КАРТИНКИ
  const { data: prevImage } = await supabase
    .from('gallery')
    .select('id')
    .lt('created_at', image.created_at) // created_at меньше текущей
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: nextImage } = await supabase
    .from('gallery')
    .select('id')
    .gt('created_at', image.created_at) // created_at больше текущей
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  const prevId = prevImage?.id
  const nextId = nextImage?.id

  // Schema.org (оставь как есть)
  const imageObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${siteUrl}/gallery/${image.id}#image`,
    contentUrl: image.image,
    name: image.title,
    description: image.description || image.title,
    datePublished: image.created_at,
    author: { '@id': `${siteUrl}/#author` },
    publisher: { '@id': `${siteUrl}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/gallery/${image.id}`
    }
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Gallery', item: `${siteUrl}/archivegallery` },
      { '@type': 'ListItem', position: 3, name: image.title, item: `${siteUrl}/gallery/${image.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Breadcrumbs (оставь как есть) */}
          <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-pink-500">Home</Link></li>
              <li>/</li>
              <li><Link href="/archivegallery" className="hover:text-pink-500">Gallery</Link></li>
              <li>/</li>
              <li className="text-foreground truncate max-w-[200px] font-medium">{image.title}</li>
            </ol>
          </nav>

          <article>
            <h1 className="text-4xl font-bold mb-4 text-foreground">{image.title}</h1>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
              <p className="text-sm text-muted-foreground">By <span className="font-medium">{authorName}</span></p>
              <span className="text-muted-foreground">•</span>
              <time className="text-sm text-muted-foreground">
                {image.created_at ? new Date(image.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                }) : 'Unknown date'}
              </time>
            </div>

            {image.description && (
              <div className="prose prose-invert max-w-none mb-8 text-foreground/90">
                <p className="leading-relaxed whitespace-pre-wrap">{image.description}</p>
              </div>
            )}

            {/* ✅ НАВИГАЦИЯ Next/Prev - ДОБАВЬ СЮДА */}
            <div className="flex justify-between items-center mt-8 mb-8 py-4 border-t border-b border-border/30">
              <div>
                {prevId ? (
                  <Link 
                    href={`/gallery/${prevId}`} 
                    className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <span>←</span> Previous
                  </Link>
                ) : (
                  <span className="text-muted-foreground cursor-not-allowed">← Previous</span>
                )}
              </div>
              
              <Link 
                href="/archivegallery" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Gallery
              </Link>

              <div>
                {nextId ? (
                  <Link 
                    href={`/gallery/${nextId}`} 
                    className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    Next <span>→</span>
                  </Link>
                ) : (
                  <span className="text-muted-foreground cursor-not-allowed">Next →</span>
                )}
              </div>
            </div>
          </article>

          <GalleryImageClient imageId={id} initialImage={image} />
        </div>
      </div>
    </>
  )
}