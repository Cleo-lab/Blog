import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createServiceSupabase } from '@/lib/supabaseServer'
import GalleryImageClient from './gallery-image-client'

const siteUrl = 'https://yurieblog.vercel.app'
const siteName = 'Yurie Blog'
const authorName = 'Yurie Jiyūbō'

export const revalidate = 86400

/* ---------- ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ ---------- */
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

  if (!image) return { title: 'Image Not Found' }

  const description = image.description 
    ? image.description.slice(0, 160).trim() 
    : `Gallery image: ${image.title}`

  const imageUrl = image.image || `${siteUrl}/images/Yurie_main.jpg`

  return {
    title: `${image.title} | Gallery | ${siteName}`,
    description,
    alternates: { canonical: `${siteUrl}/gallery/${image.id}` },
    openGraph: {
      type: 'article',
      title: image.title,
      description,
      url: `${siteUrl}/gallery/${image.id}`,
      siteName: siteName,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: image.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: image.title,
      description,
      images: [imageUrl],
    },
  }
}

/* ---------- ОСНОВНАЯ СТРАНИЦА ---------- */
export default async function GalleryImagePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = createServiceSupabase()

  // 1. Загружаем данные (текущая картинка + список для блока "Related")
  const [currentRes, relatedRes] = await Promise.all([
    supabase
      .from('gallery')
      .select('id, title, description, image, created_at')
      .eq('id', id)
      .single(),
    supabase
      .from('gallery')
      .select('id, title, image')
      .neq('id', id) // Не показывать текущую в блоке "Related"
      .order('created_at', { ascending: false })
      .limit(4)
  ])

  const { data: image, error } = currentRes
  const { data: relatedImages } = relatedRes

  if (error || !image) notFound()

  // 2. Навигация (Prev/Next) по дате создания
  const { data: prevImage } = await supabase
    .from('gallery')
    .select('id')
    .lt('created_at', image.created_at)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: nextImage } = await supabase
    .from('gallery')
    .select('id')
    .gt('created_at', image.created_at)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  // JSON-LD для Google
  const imageObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: image.image,
    name: image.title,
    description: image.description || image.title,
    datePublished: image.created_at,
    author: { '@type': 'Person', name: authorName }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectSchema) }} />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Breadcrumbs */}
          <nav className="text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-pink-500 transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/archivegallery" className="hover:text-pink-500 transition-colors">Gallery</Link></li>
              <li>/</li>
              <li className="text-foreground truncate font-medium">{image.title}</li>
            </ol>
          </nav>

          <article>
            <h1 className="text-4xl font-bold mb-4 text-foreground">{image.title}</h1>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
              <p className="text-sm text-muted-foreground">By <span className="font-medium text-foreground">{authorName}</span></p>
              <span className="text-muted-foreground">•</span>
              <time className="text-sm text-muted-foreground">
                {image.created_at ? new Date(image.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                }) : 'Unknown date'}
              </time>
            </div>

            {image.description && (
              <div className="prose prose-invert max-w-none mb-12 text-foreground/90">
                <p className="leading-relaxed whitespace-pre-wrap">{image.description}</p>
              </div>
            )}

            {/* Навигация Prev/Next */}
            <div className="flex justify-between items-center py-6 border-t border-b border-border/30 mb-12">
              {prevImage ? (
                <Link href={`/gallery/${prevImage.id}`} className="flex items-center gap-2 text-pink-500 hover:text-pink-400 font-medium">
                  ← Previous
                </Link>
              ) : <div className="text-muted-foreground/30 text-sm">First image</div>}
              
              <Link href="/archivegallery" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
                All Gallery
              </Link>

              {nextImage ? (
                <Link href={`/gallery/${nextImage.id}`} className="flex items-center gap-2 text-pink-500 hover:text-pink-400 font-medium">
                  Next →
                </Link>
              ) : <div className="text-muted-foreground/30 text-sm">Latest image</div>}
            </div>
          </article>

          {/* Лайки и комментарии */}
          <GalleryImageClient imageId={id} initialImage={image} />

          {/* ✅ Блок Related Images (Лечит "сиротство") */}
          {relatedImages && relatedImages.length > 0 && (
            <section className="mt-24 pt-12 border-t border-border/30">
              <h2 className="text-2xl font-bold mb-8 text-foreground">More from Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedImages.map((rel) => (
                  <Link key={rel.id} href={`/gallery/${rel.id}`} className="group block">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50 group-hover:border-pink-500/50 transition-colors">
                      <Image
                        src={rel.image}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium text-muted-foreground group-hover:text-pink-500 transition-colors truncate">
                      {rel.title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}