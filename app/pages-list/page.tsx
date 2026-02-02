import { createServerSupabase } from '@/lib/supabaseServer'
import Link from 'next/link'

export default async function SitemapHTML() {
  const supabase = await createServerSupabase()
  
  // Увеличиваем лимит, чтобы в карте сайта были все (или почти все) статьи
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(100) // 100 — хороший запас для начала

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
        Sitemap
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2">Main Sections</h2>
          <ul className="space-y-4">
            <li><Link href="/" className="hover:text-pink-500 transition-colors">Home</Link></li>
            <li><Link href="/archiveblog" className="hover:text-pink-500 transition-colors">Blog Archive</Link></li>
            <li><Link href="/archivegallery" className="hover:text-pink-500 transition-colors">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-pink-500 transition-colors">Contact</Link></li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-6 border-b border-border pb-2">Legal & Info</h2>
          <ul className="space-y-4 text-sm">
            <li><Link href="/privacy" className="text-muted-foreground hover:text-pink-500 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-muted-foreground hover:text-pink-500 transition-colors">Terms of Service</Link></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2">All Blog Posts</h2>
          <ul className="space-y-4">
            {posts?.map((post) => (
              <li key={post.slug} className="group">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="block group-hover:text-pink-500 transition-colors"
                >
                  <span className="block font-medium">{post.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '—'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}