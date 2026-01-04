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
    <section className="py-4 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, visible).map((post, i) => (
            <Card
              key={post.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/40 bg-card/50 backdrop-blur-sm flex flex-col h-full"
            >
              <div className="relative h-52 bg-muted overflow-hidden">
                <Image
                  src={post.featured_image || '/placeholder.svg'}
                  alt={post.title}
                  fill
                  priority={i < 2}
                  loading={i < 2 ? undefined : 'lazy'}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest px-2 py-0.5 bg-pink-500/10 rounded-full">
                    {new Date(post.created_at).toLocaleDateString(LOCALE[lang], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                    • {getReadTime(post.content)} {UI[lang].minRead}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2 group-hover:text-pink-500 transition-colors">
                  {post.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow">
                  {cleanText(post.excerpt || post.content.substring(0, 150))}...
                </p>

                <Link href={`/blog/${post.slug}`} aria-label={`Read more about ${post.title}`} className="mt-auto">
                  <Button size="sm" className="w-full bg-secondary/10 hover:bg-pink-500 hover:text-white text-foreground border border-pink-500/20 transition-all duration-300 shadow-none">
                    {UI[lang].readStory}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {visible < posts.length && (
          <LoadMoreBtn href="/archiveblog" lang={lang} color="pink" />
        )}
      </div>
    </section>
  )
}