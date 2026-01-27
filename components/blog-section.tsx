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
  initialPosts?: BlogPost[]
}

const LOCALE = {
  en: 'en-US',
  es: 'es-ES',
}

export default function BlogSection({
  language,
  initialPosts = [],
}: BlogSectionProps) {
  const supabase = useSupabase()

  // === КЛЮЧЕВОЙ ФЛАГ ===
  const hasSSR = initialPosts.length > 0

  // === STATE ===
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [visible, setVisible] = useState(3)
  const [loading, setLoading] = useState(!hasSSR)

  const lang = language === 'es' ? 'es' : 'en'

  // === CLIENT FETCH ТОЛЬКО ЕСЛИ SSR НЕТ ===
  useEffect(() => {
    if (hasSSR) return

    let cancelled = false

    async function fetchPosts() {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select(
            'id, title, slug, excerpt, content, featured_image, created_at'
          )
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(10)

        if (!cancelled && data) {
          setPosts(data as BlogPost[])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPosts()

    return () => {
      cancelled = true
    }
  }, []) // ❗ НИКАКИХ deps

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

        {/* === LOADING ТОЛЬКО ЕСЛИ НЕТ SSR === */}
        {!hasSSR && loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-muted/20 h-80"
              />
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
                <article key={post.id}>
                  <Card className="group overflow-hidden flex flex-col h-full">
                    <div className="relative h-52 bg-muted overflow-hidden">
                      <Image
                        src={post.featured_image || '/placeholder.svg'}
                        alt={`Featured image for: ${post.title}`}
                        fill
                        priority={i < 3}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <time className="text-xs text-pink-500">
                        {new Date(post.created_at).toLocaleDateString(
                          LOCALE[lang],
                          { month: 'short', day: 'numeric' }
                        )}
                      </time>

                      <h3 className="text-xl font-bold mt-2">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-muted-foreground mt-3 flex-grow">
                        {cleanText(post.excerpt || post.content).slice(0, 150)}…
                      </p>

                      <Link href={`/blog/${post.slug}`} className="mt-4">
                        <Button size="sm" className="w-full">
                          {UI[lang].readStory}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </article>
              ))}
            </div>

            {visible < posts.length && (
              <div className="flex justify-center mt-10">
                <LoadMoreBtn href="/archiveblog" lang={lang} color="pink" />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
