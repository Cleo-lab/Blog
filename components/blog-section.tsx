// components/blog-section.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UI } from '@/components/ui-texts'
import LoadMoreBtn from '@/components/load-more-btn'
import { useSupabase } from '@/hooks/use-supabase'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  created_at: string
}

interface BlogSectionProps {
  readonly language: 'en' | 'es'
}

const LOCALE = {
  en: 'en-US',
  es: 'es-ES',
}

export default function BlogSection({ language }: BlogSectionProps) {
  const supabase = useSupabase()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [visible, setVisible] = useState(3)
  const [loading, setLoading] = useState(true)

  const lang: 'en' | 'es' = language === 'es' ? 'es' : 'en'

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, content, featured_image, created_at')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(20)

        setPosts(data ?? [])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [supabase])

  const cleanText = (text: string) =>
    text
      .replace(/\[(yellow|blue|purple|pink)\]/g, '')
      .replace(/^[> \t]+/gm, '')
      .replace(/[#*`]/g, '')
      .trim()

  const getReadTime = (content: string) =>
    Math.ceil(content.trim().split(/\s+/).length / 200)

  const showMore = () => setVisible(v => v + 3)

  if (loading)
    return (
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-muted/20 h-80 animate-pulse" />
          ))}
        </div>
      </section>
    )

  if (!posts.length)
    return (
      <section className="py-4 px-4 text-center text-sm text-muted-foreground">
        {UI[lang].noPosts}
      </section>
    )

  return (
    <section className="py-1 sm:py-4 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-6xl mx-auto">
        
        {/* ЗАГОЛОВОК ТЕПЕРЬ ТУТ — он отрисуется ВСЕГДА */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Blog
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
        </div>

        {loading ? (
          // Скелетон при загрузке
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted/20 h-80 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          // Если постов реально нет в базе
          <div className="text-center py-12">
            <p className="text-foreground/60">{UI[lang].noPosts}</p>
          </div>
        ) : (
          // Если посты загружены
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, visible).map((post, i) => (
                <Card key={post.id} className="...">
                   {/* ... контент карточки ... */}
                </Card>
              ))}
            </div>

            {visible < posts.length && (
              <div className="w-full flex justify-center mt-10">
                <LoadMoreBtn href="/archiveblog" lang={lang} color="pink" />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}