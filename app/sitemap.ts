import { MetadataRoute } from 'next'
import { createServiceSupabase } from '@/lib/supabaseServer'

export const revalidate = 86400

// ✅ БЕЗ ПРОБЕЛА!
const baseUrl = 'https://yurieblog.vercel.app'

const safeDate = (value?: string | null): Date | undefined => {
  const d = value ? new Date(value) : null
  return d && !isNaN(d.getTime()) ? d : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceSupabase()

  // ✅ С trailing slash для единообразия (или без, но везде одинаково!)
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/archiveblog`, lastModified: new Date(), priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/archivegallery`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5, changeFrequency: 'yearly' },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' },
    // ❌ Убрала /pages-list — это служебная страница, не для индексации!
  ]

  try {
    // ✅ Параллельные запросы для скорости
    const [postsResult, galleryResult] = await Promise.all([
      // Блог-посты
      supabase
        .from('blog_posts')
        .select('slug, created_at, updated_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(500),
      
      // Галерея — тоже важно для индексации!
      supabase
        .from('gallery')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(200),
    ])

    const postUrls = postsResult.data?.map(p => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: safeDate(p.updated_at || p.created_at) || new Date(),
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    })) ?? []

    const galleryUrls = galleryResult.data?.map(g => ({
      url: `${baseUrl}/gallery/${g.id}`,
      lastModified: safeDate(g.created_at) || new Date(),
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    })) ?? []

    return [...staticPages, ...postUrls, ...galleryUrls]

  } catch (e) {
    console.error('Sitemap generation error:', e)
    // ⚠️ sitemap ВСЕГДА должен вернуться
    return staticPages
  }
}