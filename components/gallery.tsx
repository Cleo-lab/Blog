// components/gallery.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSupabase } from '@/hooks/use-supabase'
import LoadMoreBtn from '@/components/load-more-btn'
import { UI } from '@/components/ui-texts'

interface GalleryImage {
  id: string
  title: string
  description: string
  image: string
}

interface GalleryData {
  id: string
  title: string | null
  description: string | null
  image: string
  created_at: string
}

interface GalleryProps {
  language: 'en' | 'es'
}

export default function Gallery({ language }: GalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const lang: 'en' | 'es' = (language === 'es' ? 'es' : 'en')
  const supabase = useSupabase()

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      const { data, error, count } = await supabase
        .from('gallery')
        .select('id, title, description, image, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error

      setTotalCount(count ?? 0)

      const mappedImages = (data || []).map((item: GalleryData) => ({
        id: item.id,
        title: item.title || 'Untitled',
        description: item.description || '',
        image: item.image,
      }))
      setImages(mappedImages)
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-foreground/60">Loading gallery...</p>
          </div>
        </div>
      </section>
    )

  return (
    <section className="py-1 sm:py-4 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gallery
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">{UI[lang].noImages}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((item, idx) => (
                <Link key={item.id} href={`/gallery/${item.id}`}>
                  <div className="group relative h-64 rounded-xl overflow-hidden cursor-pointer bg-card border border-border/50 transition-transform hover:scale-105">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      priority={idx < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="w-full">
                        <p className="text-white font-semibold">{item.title}</p>
                        {item.description && (
                          <p className="text-white/80 text-sm mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalCount > 6 && (
              <div className="w-full flex justify-center mt-1">
                <LoadMoreBtn href="/archivegallery" lang={lang || 'en'} color="purple" />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}