'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/pagination'
import ScrollToTop from '@/components/scroll-to-top'
import { useSupabase } from '@/hooks/use-supabase'

const IMAGES_PER_PAGE = 10

interface GalleryImage {
  id: string
  title: string
  description: string
  image: string
  created_at: string
}

export default function ArchiveGalleryClient() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const supabase = useSupabase()

  useEffect(() => {
    fetchImages(currentPage)
  }, [currentPage])

  const fetchImages = async (page: number) => {
    setLoading(true)
    try {
      const from = (page - 1) * IMAGES_PER_PAGE
      const to = from + IMAGES_PER_PAGE - 1

      const { data, error, count } = await supabase
        .from('gallery')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      setImages(data as GalleryImage[])
      setTotalPages(Math.ceil((count ?? 0) / IMAGES_PER_PAGE))
    } catch (e: any) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="text-center text-foreground/60">Loading...</p>

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {images.map((item) => (
          <Link key={item.id} href={`/gallery/${item.id}`}>
            <div className="group relative h-64 rounded-xl overflow-hidden cursor-pointer bg-card border border-border/50 transition-transform hover:scale-105">
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
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

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <ScrollToTop />
    </>
  )
}