'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'

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

  const fetchSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const blog = supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt')
        .eq('published', true)
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
        .limit(5)

      const gallery = supabase
        .from('gallery')
        .select('id, title, slug, description')
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(5)

      const [blogRes, galleryRes] = await Promise.all([blog, gallery])

      const mapped: SearchResult[] = [
        ...(blogRes.data?.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          type: 'blog' as const,
          excerpt: p.excerpt,
        })) ?? []),
        ...(galleryRes.data?.map((g) => ({
          id: g.id,
          title: g.title,
          slug: g.id,
          type: 'gallery' as const,
          excerpt: g.description,
        })) ?? []),
      ]

      setResults(mapped)
    } catch (e) {
      console.error('Search error:', e)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const debounce = setTimeout(() => fetchSearch(query), 200)
    return () => clearTimeout(debounce)
  }, [query, fetchSearch])

  const onResultClick = () => {
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div className="relative flex-1 sm:flex-none">
      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-2 py-1 w-40 h-8 focus-within:ring-2 focus-within:ring-primary">
        <Search className="w-4 h-4 text-foreground/60 shrink-0" />
        <input
          type="text"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-foreground/60"
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear" className="shrink-0">
            <X className="w-4 h-4 text-foreground/60 hover:text-foreground" />
          </button>
        )}
      </div>

      {open && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading && <div className="px-4 py-2 text-sm text-foreground/60">Searching…</div>}
          {!loading && results.length === 0 && query && (
            <div className="px-4 py-2 text-sm text-foreground/60">No results</div>
          )}
          {!loading &&
            results.map((res) => (
              <Link
                key={`${res.type}-${res.id}`}
                href={res.type === 'blog' ? `/blog/${res.slug}` : `/gallery/${res.slug}`}
                onClick={onResultClick}
                className="flex items-start gap-3 px-4 py-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{res.title}</p>
                  {res.excerpt && (
                    <p className="text-xs text-foreground/60 line-clamp-2">{res.excerpt}</p>
                  )}
                  <span className="text-xs text-primary/60 uppercase">{res.type}</span>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  )
}