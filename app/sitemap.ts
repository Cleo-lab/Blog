import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yurieblog.vercel.app'

  // Получаем все опубликованные посты
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true)

  // Получаем все галереи
  const { data: galleries } = await supabase
    .from('gallery')
    .select('id, updated_at')

  const postUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const galleryUrls = (galleries || []).map((gallery) => ({
    url: `${baseUrl}/gallery/${gallery.id}`,
    lastModified: new Date(gallery.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/archiveblog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
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
    ...postUrls,
    ...galleryUrls,
  ]
}