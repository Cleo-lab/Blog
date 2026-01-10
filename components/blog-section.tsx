'use client'

import { useEffect, useState, useMemo } from 'react'
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
  initialPosts?: BlogPost[] // Используем типизированный массив
}

const LOCALE = {
  en: 'en-US',
  es: 'es-ES',
}

export default function BlogSection({ language, initialPosts = [] }: BlogSectionProps) {
  const supabase = useSupabase()
  
  // 1. Инициализируем стейт данными с сервера. 
  // Если initialPosts есть, стейт сразу будет наполнен, и рендеринг начнется с постов.
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [visible, setVisible] = useState(3)
  
  // 2. Loading только если у нас НЕТ данных ни с сервера, ни в стейте.
  const [loading, setLoading] = useState(initialPosts.length === 0)

  const lang = language === 'es' ? 'es' : 'en'

  useEffect(() => {
    // 3. КЛЮЧЕВОЙ МОМЕНТ: Если данные уже есть (пришли от сервера), 
    // МЫ ВООБЩЕ ВЫХОДИМ. Никаких setLoading(true) и лишних запросов.
    if (initialPosts.length > 0) return

    async function fetchPosts() {
      try {
        // setLoading(true) сработает только если initialPosts был пустым
        const { data } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, content, featured_image, created_at')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(10)

        if (data) setPosts(data as BlogPost[])
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
    // Убираем supabase из зависимостей, чтобы избежать циклов при смене контекста
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  // Функции очистки текста и времени выносим в хелперы, чтобы не пересоздавать
  const cleanText = (text: string) =>
    (text || '')
      .replace(/\[(yellow|blue|purple|pink)\]/g, '')
      .replace(/^[> \t]+/gm, '')
      .replace(/[#*`]/g, '')
      .trim()

  const getReadTime = (content: string) => {
    if (!content) return 1
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / 200) || 1
  }

  return (
    <section className="py-4 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Blog
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
        </div>

        {/* Если loading=true и постов нет — показываем скелетон.
            Если посты есть (даже если они грузятся в фоне) — показываем посты. 
            Это исключает мигание (Skeleton -> Content).
        */}
        {loading && posts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-muted/20 h-80 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">{UI[lang].noPosts}</p>
          </div>
        ) : (
          <>
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
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                      style={{ objectFit: 'cover' }} 
    className="transition-transform duration-500 group-hover:scale-110"
  />
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
                      {cleanText(post.excerpt || post.content).substring(0, 150)}...
                    </p>

                    <Link href={`/blog/${post.slug}`} className="mt-auto">
                      <Button size="sm" className="w-full bg-secondary/10 hover:bg-pink-500 hover:text-white text-foreground border border-pink-500/20 transition-all duration-300">
                        {UI[lang].readStory}
                      </Button>
                    </Link>
                  </div>
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
  )
}