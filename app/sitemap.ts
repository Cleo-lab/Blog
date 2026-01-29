import { MetadataRoute } from 'next'
import { createServiceSupabase } from '@/lib/supabaseServer'

export const revalidate = 86400

/* ---------- types ---------- */
type BlogRow = {
  slug: string
  created_at: string
  updated_at: string | null
}

type GalleryRow = {
  id: string
  created_at: string
}

/* ---------- helpers ---------- */
const baseUrl = 'https://yurieblog.vercel.app'

const parseDate = (d: string | null): Date =>
  d && !isNaN(Date.parse(d)) ? new Date(d) : new Date()

// Дата последних крупных правок по SEO (сегодняшняя)
const lastSeoUpdate = new Date('2026-01-29') 

/* ---------- main handler ---------- */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceSupabase()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at, updated_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const { data: galleries } = await supabase
    .from('gallery')
    .select('id, created_at')
    .order('created_at', { ascending: false })

  const latestPostDate =
    posts?.[0] ? parseDate(posts[0].updated_at || posts[0].created_at) : new Date()

  const postUrls = (posts as BlogRow[] || []).map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: parseDate(p.updated_at || p.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const galleryUrls = (galleries as GalleryRow[] || []).map((g) => ({
    url: `${baseUrl}/gallery/${g.id}`,
    lastModified: parseDate(g.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: latestPostDate, 
      changeFrequency: 'daily', 
      priority: 1 
    },
    { 
      url: `${baseUrl}/archiveblog`, 
      lastModified: latestPostDate, 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/about`, 
      lastModified: lastSeoUpdate, // Используем актуальную дату
      changeFrequency: 'weekly',    // Заставляем робота заходить чаще
      priority: 0.8 
    },
    { 
      url: `${baseUrl}/archivegallery`, 
      lastModified: latestPostDate, 
      changeFrequency: 'weekly', 
      priority: 0.7 
    },
    { 
      url: `${baseUrl}/contact`, 
      lastModified: lastSeoUpdate, 
      changeFrequency: 'monthly', 
      priority: 0.6 
    },
    { 
      url: `${baseUrl}/privacy`, 
      lastModified: lastSeoUpdate, 
      changeFrequency: 'monthly', 
      priority: 0.5 // Повысили для доверия (E-E-A-T)
    },
    { 
      url: `${baseUrl}/terms`, 
      lastModified: lastSeoUpdate, 
      changeFrequency: 'monthly', 
      priority: 0.5 
    },
  ]

  return [...staticPages, ...postUrls, ...galleryUrls]
}