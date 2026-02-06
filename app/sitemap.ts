import { MetadataRoute } from 'next'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { BRAND } from '@/lib/brand-voice'

export const revalidate = 86400

// Утилита для дат
const getIsoDate = (d?: string | null) => d ? new Date(d).toISOString() : new Date().toISOString()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceSupabase()
  
  const baseUrl = BRAND.siteUrl.replace(/\/$/, '')

  // 1. Статические страницы (Теперь с правильными путями)
  const staticPaths = [
    '',          // Главная
    '/blog',     // ✅ Было /archiveblog
    '/gallery',  // ✅ Было /archivegallery
    '/about', 
    '/contact',
    '/privacy',
    '/terms'
  ]

  const staticPages = staticPaths.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    priority: path === '' ? 1.0 : 0.8, 
  }))

  try {
    const [posts, images] = await Promise.all([
      supabase.from('blog_posts').select('slug, updated_at').eq('published', true),
      supabase.from('gallery').select('id, created_at')
    ])

    // 2. Блог посты
    const postUrls = (posts.data || []).map(p => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: getIsoDate(p.updated_at),
      priority: 0.8,
    }))

    // 3. Галерея
    const galleryUrls = (images.data || []).map(g => ({
      url: `${baseUrl}/gallery/${g.id}`,
      lastModified: getIsoDate(g.created_at),
      priority: 0.7,
    }))

    return [...staticPages, ...postUrls, ...galleryUrls]
  } catch (e) {
    return staticPages
  }
}