import { MetadataRoute } from 'next'
import { createServiceSupabase } from '@/lib/supabaseServer'

export const revalidate = 86400

const baseUrl = 'https://yurieblog.vercel.app'

const safeDate = (value?: string | null) => {
  const d = value ? new Date(value) : null
  return d && !isNaN(d.getTime()) ? d : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceSupabase()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl },
    { url: `${baseUrl}/archiveblog` },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/archivegallery` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
    { url: `${baseUrl}/pages-list` },
  ]

  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, created_at, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(500)

    const postUrls =
      posts?.map(p => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: safeDate(p.updated_at || p.created_at),
      })) ?? []

    return [...staticPages, ...postUrls]

  } catch (e) {
    // ⚠️ sitemap ВСЕГДА должен вернуться
    return staticPages
  }
}
