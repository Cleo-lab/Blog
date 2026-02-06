// app/gallery/[id]/page.tsx — обновлённая версия
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { BRAND } from '@/lib/brand-voice'
import GalleryComments from './gallery-comments' // ← вынесем комментарии отдельно

const siteUrl = BRAND.siteUrl
const siteName = BRAND.siteName
const authorName = BRAND.authorName

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

  if (!image) return { title: 'Image Not Found' }

  const description = image.description 
    ? image.description.slice(0, 160).trim() 
    : `Gallery image: ${image.title}`

  return {
    title: `${image.title} | Gallery | ${siteName}`,
    description,
    alternates: { canonical: `${siteUrl}/gallery/${image.id}` },
    openGraph: {
      type: 'article',
      title: image.title,
      description,
      url: `${siteUrl}/gallery/${image.id}`,
      siteName,
      images: [{ url: image.image, width: 1200, height: 630, alt: image.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: image.title,
      description,
      images: [image.image],
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

  const [currentRes, relatedRes] = await Promise.all([
    supabase.from('gallery').select('*').eq('id', id).single(),
    supabase
      .from('gallery')
      .select('id, title, image')
      .neq('id', id)
      .order('created_at', { ascending: false })
      .limit(4)
  ])

  const { data: image, error } = currentRes
  const { data: relatedImages } = relatedRes

  if (error || !image) notFound()

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(imageObjectSchema) 
      }} />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Breadcrumbs */}
          <nav className="text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-pink-500">Home</Link></li>
              <li>/</li>
              <li><Link href="/gallery" className="hover:text-pink-500">Gallery</Link></li>
              <li>/</li>
              <li className="text-foreground truncate font-medium">{image.title}</li>
            </ol>
          </nav>

          <article>
            <h1 className="text-4xl font-bold mb-4">{image.title}</h1>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
              <p className="text-sm text-muted-foreground">
                By <span className="font-medium text-foreground">{authorName}</span>
              </p>
              <span className="text-muted-foreground">•</span>
              <time className="text-sm text-muted-foreground">
                {image.created_at ? new Date(image.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                }) : 'Unknown date'}
              </time>
            </div>

            {/* Главное изображение — ВИДИМО ДЛЯ БОТА */}
            <div className="mb-12 rounded-3xl overflow-hidden bg-muted shadow-xl">
              <Image
                src={image.image}
                alt={image.title}
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            {image.description && (
              <div className="prose prose-invert max-w-none mb-12 text-foreground/90">
                <p className="leading-relaxed whitespace-pre-wrap">{image.description}</p>
              </div>
            )}

            {/* Related Images — ВИДИМЫ ДЛЯ БОТА */}
            {relatedImages && relatedImages.length > 0 && (
              <section className="mt-16 pt-12 border-t border-border/30">
                <h2 className="text-2xl font-bold mb-8">More from Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedImages.map((rel) => (
                    <Link key={rel.id} href={`/gallery/${rel.id}`} className="group block">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50">
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium truncate">{rel.title}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Комментарии — клиентская часть, НЕ важна для SEO */}
          <section className="mt-16 pt-12 border-t border-border/50">
            <GalleryComments imageId={id} />
          </section>
        </div>
      </div>
    </>
  )
}