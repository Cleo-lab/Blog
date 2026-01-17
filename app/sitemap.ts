import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yurieblog.vercel.app' // ← без пробела

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at, updated_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const { data: galleries } = await supabase
    .from('gallery')
    .select('id, created_at, updated_at')
    .order('created_at', { ascending: false })

  const parseDate = (d: string | null) =>
    d && !isNaN(Date.parse(d)) ? new Date(d) : new Date()

  const latestPostDate =
    posts?.[0] ? parseDate(posts[0].updated_at || posts[0].created_at) : new Date()

  const postUrls = (posts || []).map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: parseDate(p.updated_at || p.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const galleryUrls = (galleries || []).map((g) => ({
    url: `${baseUrl}/gallery/${g.id}`,
    lastModified: parseDate(g.updated_at || g.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: latestPostDate, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/archiveblog`, lastModified: latestPostDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/archivegallery`, lastModified: latestPostDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date('2025-01-01'), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date('2025-01-01'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date('2025-01-01'), changeFrequency: 'yearly', priority: 0.3 },
  ]

  return [...staticPages, ...postUrls, ...galleryUrls]
}