'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  title: string
  slug: string
  type: 'blog' | 'gallery'
  excerpt?: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = useSupabase()
  const router = useRouter() // ИСПРАВЛЕНО (перенесено на новую строку)

  // Обработка нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      setOpen(false)
      // Перенаправляем на новую страницу поиска
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const fetchSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const blogPromise = supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt')
        .eq('published', true)
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
        .limit(5)

      const galleryPromise = supabase
        .from('gallery')
        .select('id, title, description')
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(5)

      const [blogRes, galleryRes] = await Promise.all([blogPromise, galleryPromise])

      const blogItems: SearchResult[] = (blogRes.data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: 'blog',
        excerpt: p.excerpt,
      }))

      const galleryItems: SearchResult[] = (galleryRes.data || []).map((g: any) => ({
        id: g.id,
        title: g.title,
        slug: g.id, 
        type: 'gallery',
        excerpt: g.description,
      }))

      setResults([...blogItems, ...galleryItems])
    } catch (e) {
      console.error('Search error:', e)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const debounce = setTimeout(() => fetchSearch(query), 300)
    return () => clearTimeout(debounce)
  }, [query, fetchSearch])

  const onResultClick = () => {
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div className="relative flex-1 sm:flex-none z-50">
      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-2 py-1 w-40 h-8 focus-within:ring-2 focus-within:ring-primary transition-all">
        <Search className="w-4 h-4 text-foreground/60 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown} 
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-foreground/60 min-w-0"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} aria-label="Clear" className="shrink-0">
            <X className="w-4 h-4 text-foreground/60 hover:text-foreground" />
          </button>
        )}
      </div>

      {open && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl max-h-96 overflow-y-auto w-64 sm:w-80 -left-20 sm:left-0">
          {loading && <div className="px-4 py-3 text-sm text-foreground/60">Searching...</div>}
          
          {!loading && results.length === 0 && query && (
            <div className="px-4 py-3 text-sm text-foreground/60">No results found</div>
          )}

          {!loading && results.map((res) => (
            <Link
              key={`${res.type}-${res.id}`}
              href={res.type === 'blog' ? `/blog/${res.slug}` : `/gallery/${res.slug}`}
              onClick={onResultClick}
              className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{res.title}</p>
                {res.excerpt && (
                  <p className="text-xs text-foreground/60 line-clamp-2 mt-0.5">{res.excerpt}</p>
                )}
                <span className="inline-block mt-1 text-[10px] font-bold text-primary/80 uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">
                  {res.type}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}