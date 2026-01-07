import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Расширенный тип для поддержки images (для Google Discover)
type SitemapWithImages = MetadataRoute.Sitemap[number] & {
  images?: string[]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yurieblog.vercel.app'

  // 1. Получаем все опубликованные посты с изображениями
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at, updated_at, featured_image')
    .eq('published', true)
    .order('created_at', { ascending: false })

  // 2. Получаем все галереи
  const { data: galleries } = await supabase
    .from('gallery')
    .select('id, created_at, updated_at')
    .order('created_at', { ascending: false })

  const parseDate = (dateStr: string | null) => {
    const d = dateStr ? new Date(dateStr) : new Date()
    return isNaN(d.getTime()) ? new Date() : d
  }

  const latestPostDate = posts && posts.length > 0 
    ? parseDate(posts[0].updated_at || posts[0].created_at)
    : new Date()

  // Посты с изображениями (для Google Discover)
  const postUrls: SitemapWithImages[] = (posts || []).map((post) => {
    const entry: SitemapWithImages = {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: parseDate(post.updated_at || post.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }
    
    // Добавляем изображение если есть (важно для Discover!)
    if (post.featured_image) {
      entry.images = [post.featured_image]
    }
    
    return entry
  })

  const galleryUrls = (galleries || []).map((gallery) => ({
    url: `${baseUrl}/gallery/${gallery.id}`,
    lastModified: parseDate(gallery.updated_at || gallery.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/archiveblog`,
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/archivegallery`,
      lastModified: galleries && galleries.length > 0 
        ? parseDate(galleries[0].updated_at || galleries[0].created_at)
        : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  return [...staticPages, ...postUrls, ...galleryUrls]
}