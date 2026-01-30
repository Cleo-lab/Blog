import { MetadataRoute } from 'next'
import { createServiceSupabase } from '@/lib/supabaseServer'

export const revalidate = 86400

const MAX_BLOG_POSTS = 100
const MAX_GALLERY_ITEMS = 50

type BlogRow = {
  slug: string
  created_at: string
  updated_at: string | null
}

type GalleryRow = {
  id: string
  created_at: string
}

const baseUrl = 'https://yurieblog.vercel.app' as const
const now = new Date()

const safeDate = (value?: string | null): Date => {
  if (!value) return now
  const d = new Date(value)
  return isNaN(d.getTime()) ? now : d
}

const isValidSlug = (slug: unknown): slug is string =>
  typeof slug === 'string' &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)

const isValidGalleryId = (id: unknown): id is string =>
  typeof id === 'string' &&
  /^[a-z0-9-]+$/.test(id)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceSupabase()

  try {
    const [postsRes, galleriesRes] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('slug, created_at, updated_at')
        .eq('published', true)
        .order('updated_at', { ascending: false })
        .limit(MAX_BLOG_POSTS),

      supabase
        .from('gallery')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(MAX_GALLERY_ITEMS),
    ])

    const posts = (postsRes.data ?? []) as BlogRow[]
    const galleries = (galleriesRes.data ?? []) as GalleryRow[]

    const latestPostDate =
      posts.length > 0
        ? safeDate(posts[0].updated_at || posts[0].created_at)
        : now

    const postUrls: MetadataRoute.Sitemap = posts
      .filter(p => isValidSlug(p.slug))
      .map(p => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: safeDate(p.updated_at || p.created_at),
        changeFrequency: 'monthly',
        priority: 0.9,
      }))

    const galleryUrls: MetadataRoute.Sitemap = galleries
      .filter(g => isValidGalleryId(g.id))
      .map(g => ({
        url: `${baseUrl}/gallery/${g.id}`,
        lastModified: safeDate(g.created_at),
        changeFrequency: 'monthly',
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
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: latestPostDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/archivegallery`,
        lastModified: latestPostDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ]

    return [...staticPages, ...postUrls, ...galleryUrls]

  } catch (error) {
    console.error('Sitemap generation failed:', error)

    return [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ]
  }
}
