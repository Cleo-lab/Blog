'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/pagination'
import ScrollToTop from '@/components/scroll-to-top'
import { useSupabase } from '@/hooks/use-supabase'

const POSTS_PER_PAGE = 10

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // Добавлено, чтобы подтягивать текст статьи
  featured_image: string | null
  created_at: string
}

export default function ArchiveBlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const supabase = useSupabase()

  // Функция для очистки текста превью от системных тегов и символов Markdown
  const cleanText = (text: string) => {
    if (!text) return ''
    return text
      .replace(/\[(yellow|blue|purple|pink)\]/g, '') // Убираем цветовые теги
      .replace(/^[> \t]+/gm, '')                   // Убираем символы цитат >
      .replace(/[#*`]/g, '')                       // Убираем маркдаун символы
      .trim()
  }

  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage])

  const fetchPosts = async (page: number) => {
    setLoading(true)
    try {
      const from = (page - 1) * POSTS_PER_PAGE
      const to = from + POSTS_PER_PAGE - 1

      const { data, error, count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      setPosts(data as BlogPost[])
      setTotalPages(Math.ceil((count ?? 0) / POSTS_PER_PAGE))
    } catch (e: any) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="text-center text-foreground/60">Loading...</p>

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border/50 bg-card">
            <div className="relative h-48 bg-muted overflow-hidden">
              <img
                src={post.featured_image || '/placeholder.svg'}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <p className="text-xs text-foreground/60 mb-2">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
              
              {/* Исправленный вывод текста */}
              <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
                {cleanText(post.excerpt || post.content.substring(0, 150))}...
              </p>

              <Link href={`/blog/${post.slug}`}>
                <Button size="sm" className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-none">
                  Read More
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <ScrollToTop />
    </>
  )
}