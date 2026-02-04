// app/archivegallery/page.tsx — НОВЫЙ ФАЙЛ (заменяет клиентский)
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { BRAND } from '@/lib/brand-voice'

export const metadata: Metadata = {
  title: `Gallery Archive | ${BRAND.siteName}`,
  description: 'Browse all gallery images and visual experiments',
  alternates: { canonical: `${BRAND.siteUrl}/archivegallery` },
}

export const revalidate = 86400 // ISR — обновление раз в сутки

export default async function ArchiveGalleryPage() {
  const supabase = createServiceSupabase()
  
  const { data: images, count } = await supabase
    .from('gallery')
    .select('id, title, description, image, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gallery Archive
          </h1>
          <p className="text-foreground/60 text-lg">
            {count || 0} images in collection
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-4" />
        </div>

        {images && images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </main>
  )
}