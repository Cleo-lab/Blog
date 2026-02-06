// components/gallery-server.tsx
// НЕТ 'use client' — это Server Component!

import Link from 'next/link'
import Image from 'next/image'
import { createServiceSupabase } from '@/lib/supabaseServer'
import LoadMoreBtn from '@/components/load-more-btn'

interface GalleryServerProps {
  language: 'en' | 'es'
}

export default async function GalleryServer({ language }: GalleryServerProps) {
  const supabase = createServiceSupabase()
  
  const { data: images, count } = await supabase
    .from('gallery')
    .select('id, title, description, image', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(6)

  const lang = language === 'es' ? 'es' : 'en'
  const hasMore = (count ?? 0) > 6

  if (!images || images.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="text-foreground/60">No images yet</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-1 sm:py-4 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gallery
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, idx) => (
            <Link key={item.id} href={`/gallery/${item.id}`}>
              <article className="group relative h-64 rounded-xl overflow-hidden cursor-pointer bg-card border border-border/50 transition-transform hover:scale-105">
                <Image
                  src={item.image}
                  alt={item.title || 'Gallery image'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  priority={idx < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="w-full">
                    <h3 className="text-white font-semibold">{item.title || 'Untitled'}</h3>
                    {item.description && (
                      <p className="text-white/80 text-sm mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div className="w-full flex justify-center mt-10">
            <LoadMoreBtn href="/gallery" lang={lang} color="purple" />
          </div>
        )}
      </div>
    </section>
  )
}