// app/gallery/[id]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServiceSupabase } from '@/lib/supabaseServer'
import GalleryImageClient from './gallery-image-client'

const siteUrl = 'https://yurieblog.vercel.app'
const siteName = 'Yurie Blog'
const authorName = 'Yurie Jiyūbō'

// Revalidate каждые 24 часа
export const revalidate = 86400

/* ---------- DYNAMIC METADATA ---------- */
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

/* ---------- SERVER COMPONENT ---------- */
export default async function GalleryImagePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = createServiceSupabase()

  // Fetch image on server
  const { data: image, error } = await supabase
    .from('gallery')
    .select('id, title, description, image, created_at')
    .eq('id', id)
    .single()

  if (error || !image) {
    notFound()
  }

  // ✅ Schema.org для галереи
  const imageObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${siteUrl}/gallery/${image.id}#image`,
    contentUrl: image.image,
    name: image.title,
    description: image.description || image.title,
    datePublished: image.created_at,
    author: {
      '@id': `${siteUrl}/#author`
    },
    publisher: {
      '@id': `${siteUrl}/#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/gallery/${image.id}`
    }
  }

  // ✅ Breadcrumbs
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { 
        '@type': 'ListItem', 
        position: 1, 
        name: 'Home', 
        item: siteUrl 
      },
      { 
        '@type': 'ListItem', 
        position: 2, 
        name: 'Gallery', 
        item: `${siteUrl}/archivegallery` 
      },
      { 
        '@type': 'ListItem', 
        position: 3, 
        name: image.title, 
        item: `${siteUrl}/gallery/${image.id}` 
      },
    ],
  }

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectSchema) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} 
      />

      {/* ✅ Уникальный контент на сервере для SEO */}
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* ✅ Breadcrumbs с microdata */}
          <nav 
            className="text-sm text-muted-foreground mb-6" 
            aria-label="Breadcrumb"
            itemScope 
            itemType="https://schema.org/BreadcrumbList"
          >
            <ol className="flex items-center space-x-2">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a href="/" itemProp="item" className="hover:text-pink-500 transition-colors">
                  <span itemProp="name">Home</span>
                </a>
                <meta itemProp="position" content="1" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a href="/archivegallery" itemProp="item" className="hover:text-pink-500 transition-colors">
                  <span itemProp="name">Gallery</span>
                </a>
                <meta itemProp="position" content="2" />
              </li>
              <li>/</li>
              <li className="text-foreground truncate max-w-[200px] font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">{image.title}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

          {/* ✅ Уникальный заголовок для каждой страницы */}
          <article itemScope itemType="https://schema.org/ImageObject">
            <meta itemProp="contentUrl" content={image.image} />
            <meta itemProp="datePublished" content={image.created_at || ''} />
            
            <h1 
              className="text-4xl font-bold mb-4 text-foreground" 
              itemProp="name"
            >
              {image.title}
            </h1>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
              <div itemProp="author" itemScope itemType="https://schema.org/Person">
                <link itemProp="url" href={`${siteUrl}/#author`} />
                <meta itemProp="name" content={authorName} />
                <p className="text-sm text-muted-foreground">
                  By <span className="font-medium">{authorName}</span>
                </p>
              </div>
              <span className="text-muted-foreground">•</span>
              <time 
                className="text-sm text-muted-foreground" 
                dateTime={image.created_at || undefined}
                itemProp="datePublished"
              >
                {image.created_at 
                  ? new Date(image.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Unknown date'
                }
              </time>
            </div>

            {/* ✅ Уникальное описание */}
            {image.description && (
              <div 
                className="prose prose-invert max-w-none mb-8 text-foreground/90"
                itemProp="description"
              >
                <p className="leading-relaxed whitespace-pre-wrap">
                  {image.description}
                </p>
              </div>
            )}
          </article>

          {/* Client component для интерактивности */}
          <GalleryImageClient imageId={id} initialImage={image} />
        </div>
      </div>
    </>
  )
}