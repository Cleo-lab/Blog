'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/hooks/use-supabase'
import LoadMoreBtn from '@/components/load-more-btn'
import Image from 'next/image'

interface BlogSectionProps {
  readonly language: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  published: boolean
  created_at: string
}

export default function BlogSection({ language }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = useSupabase()

  // ФУНКЦИЯ ДЛЯ ОЧИСТКИ ТЕКСТА ОТ ТЕГОВ [blue], [pink] и т.д.
  const cleanText = (text: string) => {
    if (!text) return ''
    return text
      .replace(/\[(yellow|blue|purple|pink)\]/g, '') // Убираем цветовые теги
      .replace(/^[> \t]+/gm, '')                   // Убираем символы цитат (>) в начале строк
      .replace(/[#*`]/g, '')                       // Убираем остальные маркдаун символы
      .trim()
  }

  const fetchPosts = useCallback(async () => {
    try {
      if (typeof globalThis.window === 'undefined') return
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts((data ?? []) as BlogPost[])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const getReadTime = (content: string): number => {
    const wordsPerMinute = 200
    return Math.ceil(content.trim().split(/\s+/).length / wordsPerMinute)
  }

  return (
    <section className="py-1 sm:py-4 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Blog Posts
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>

        {(() => {
          if (loading) return <div className="text-center text-foreground/60">Loading posts...</div>
          if (error) return <div className="text-center text-red-500">Error: {error}</div>
          if (posts.length === 0) return <div className="text-center text-foreground/60">No blog posts yet</div>
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, 6).map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border/50 bg-card">
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <Image
  src={post.featured_image || '/placeholder.svg'}
  alt={post.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
  className="object-cover hover:scale-105 transition-transform duration-300"
/>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold text-primary/60 mb-2 uppercase tracking-wide">
                        {new Date(post.created_at).toLocaleDateString()} • {getReadTime(post.content)} min read
                      </p>
                      <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2">{post.title}</h3>
                      
                      {/* ИСПРАВЛЕННЫЙ ВЫВОД ЭКСЦЕРПТА */}
                      <p className="text-foreground/60 text-sm mb-4 line-clamp-3">
                        {cleanText(post.excerpt || post.content.substring(0, 150)) + '...'}
                      </p>

                      <Link 
  href={`/blog/${post.slug}`}
  aria-label={`Read more about ${post.title}`} // <-- Добавляем это описание
>
  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
    Read More
  </Button>
</Link>
                    </div>
                  </Card>
                ))}
              </div>

              {posts.length > 6 && (
                <div className="w-full flex justify-center mt-1">
                  <LoadMoreBtn href="/archiveblog" text="More stories" color="pink" />
                </div>
              )}
            </>
          )
        })()}
      </div>
    </section>
  )
}