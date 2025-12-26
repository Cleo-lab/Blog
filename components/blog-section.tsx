'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadMoreBtn from '@/components/load-more-btn'
import Image from 'next/image'

/* ---------- TYPES ---------- */
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

interface BlogSectionProps {
  readonly language: string
  readonly initialPosts: BlogPost[] // Принимаем данные с сервера
}

export default function BlogSection({ language, initialPosts }: BlogSectionProps) {
  // Используем пришедшие данные как начальное состояние
  const [posts] = useState<BlogPost[]>(initialPosts)

  // ФУНКЦИЯ ДЛЯ ОЧИСТКИ ТЕКСТА ОТ МАРКДАУНА И ТЕГОВ
  const cleanText = (text: string) => {
    if (!text) return ''
    return text
      .replace(/\[(yellow|blue|purple|pink)\]/g, '') // Убираем цветовые теги
      .replace(/^[> \t]+/gm, '')                   // Убираем символы цитат
      .replace(/[#*`]/g, '')                       // Убираем маркдаун
      .trim()
  }

  const getReadTime = (content: string): number => {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  // Если постов нет совсем (даже после загрузки сервером)
  if (!posts || posts.length === 0) {
    return null // Или небольшой блок "No posts yet"
  }

  return (
    <section className="py-4 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Сетка постов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 6).map((post, index) => (
            <Card 
              key={post.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/40 bg-card/50 backdrop-blur-sm flex flex-col h-full"
            >
              {/* Изображение */}
              <div className="relative h-52 bg-muted overflow-hidden">
                <Image
                  src={post.featured_image || '/placeholder.svg'}
                  alt={post.title}
                  fill
                  // Первые 3 картинки грузим приоритетно, остальные лениво
                  priority={index < 3}
                  loading={index < 3 ? undefined : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Контент */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest px-2 py-0.5 bg-pink-500/10 rounded-full">
                    {new Date(post.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                    • {getReadTime(post.content)} min read
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2 group-hover:text-pink-500 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow">
                  {cleanText(post.excerpt || post.content.substring(0, 150))}...
                </p>

                <Link 
                  href={`/blog/${post.slug}`}
                  aria-label={`Read more about ${post.title}`}
                  className="mt-auto"
                >
                  <Button 
                    className="w-full bg-secondary/10 hover:bg-pink-500 hover:text-white text-foreground border border-pink-500/20 transition-all duration-300 shadow-none" 
                    size="sm"
                  >
                    Read Story
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Кнопка "Больше историй" */}
        {posts.length >= 6 && (
          <div className="w-full flex justify-center mt-12">
            <LoadMoreBtn href="/archiveblog" text="View All Stories" color="pink" />
          </div>
        )}
      </div>
    </section>
  )
}