// components/blog-section.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadMoreBtn from '@/components/load-more-btn'

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
  initialPosts: BlogPost[] // ← Обязательный проп, не optional
}

const UI = {
  en: { readStory: 'Read Story', noPosts: 'No posts yet' },
  es: { readStory: 'Leer historia', noPosts: 'Sin publicaciones' }
}

const LOCALE = { en: 'en-US', es: 'es-ES' }

export default function BlogSection({
  language,
  initialPosts,
}: BlogSectionProps) {
  const lang = language === 'es' ? 'es' : 'en'

  const cleanText = (text: string) =>
    (text || '')
      .replace(/\[(yellow|blue|purple|pink)\]/g, '')
      .replace(/^[> \t]+/gm, '')
      .replace(/[#*`]/g, '')
      .trim()

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">{UI[lang].noPosts}</p>
      </div>
    )
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialPosts.map((post, i) => (
            <article key={`${post.id}-${i}`}>
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

        {/* Кнопка на архив */}
        <div className="flex justify-center mt-10">
          <LoadMoreBtn href="/blog" lang={lang} color="pink" />
        </div>
      </div>
    </section>
  )
}