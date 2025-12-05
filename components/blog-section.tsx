'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/hooks/use-supabase'

interface BlogSectionProps {
  language: string
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

  // Fetch posts once on mount
  useEffect(() => {
    let cancelled = false

    async function fetchPosts() {
      try {
        // Ensure code runs only in the browser
        if (typeof window === 'undefined') return

        const supabase = useSupabase()

        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        if (!cancelled) {
          setPosts((data ?? []) as BlogPost[])
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? 'Failed to load posts')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPosts()

    return () => {
      cancelled = true
    }
  }, [])

  const getReadTime = (content: string): number => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  return (
    <section className="py-16 sm:py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Blog Posts
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>

        {loading ? (
          <div className="text-center text-foreground/60">Loading posts...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-foreground/60">No blog posts yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-border/50 bg-card"
              >
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={post.featured_image || '/placeholder.svg'}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold text-primary/60 mb-2 uppercase tracking-wide">
                    {new Date(post.created_at).toLocaleDateString()} • {getReadTime(post.content)} min read
                  </p>
                  <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-foreground/60 text-sm mb-4 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                    >
                      Read More
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
