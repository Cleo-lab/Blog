import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, content, created_at, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(20)

    const baseUrl = 'https://yurieblog.vercel.app'

    // Escape XML special characters
    const escapeXml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
    }

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yurie's Blog</title>
    <link>${baseUrl}</link>
    <description>Personal blog by Yurie</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${(posts || [])
      .map((post) => {
        const description = post.excerpt || post.content.substring(0, 300)
        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
    </item>`
      })
      .join('')}
  </channel>
</rss>`

    return new Response(feed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('RSS feed error:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}