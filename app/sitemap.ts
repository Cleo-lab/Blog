import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yurieblog.vercel.app'

  // 1. Получаем все опубликованные посты с created_at для более точных дат
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at, updated_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  // 2. Получаем все галереи
  const { data: galleries } = await supabase
    .from('gallery')
    .select('id, created_at, updated_at')
    .order('created_at', { ascending: false })

  // Безопасное преобразование даты
  const parseDate = (dateStr: string | null) => {
    const d = dateStr ? new Date(dateStr) : new Date()
    return isNaN(d.getTime()) ? new Date() : d
  }

  const postUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: parseDate(post.updated_at || post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9, // Повысил приоритет для постов блога
  }))

  const galleryUrls = (galleries || []).map((gallery) => ({
    url: `${baseUrl}/gallery/${gallery.id}`,
    lastModified: parseDate(gallery.updated_at || gallery.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/archiveblog`,
      lastModified: new Date(),
      changeFrequency: 'daily', // Изменил на daily для более частого сканирования
      priority: 0.95, // Повысил приоритет для архива блога
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/archivegallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  return [...staticPages, ...postUrls, ...galleryUrls]
}