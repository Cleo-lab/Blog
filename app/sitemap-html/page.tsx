import { createServerSupabase } from '@/lib/supabaseServer'
import Link from 'next/link'

export default async function SitemapHTML() {
  const supabase = await createServerSupabase()
  
  const { data: posts } = await supabasePublic
  .from('blog_posts')
  .select('id, title, slug, created_at')
  .eq('published', true)
  .not('created_at', 'is', null)
  .order('created_at', { ascending: false });

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Main Pages</h2>
        <ul className="space-y-2">
          <li><Link href="/" className="text-pink-500 hover:underline">Home</Link></li>
          <li><Link href="/about" className="text-pink-500 hover:underline">About</Link></li>
          <li><Link href="/archiveblog" className="text-pink-500 hover:underline">Blog Archive</Link></li>
          <li><Link href="/archivegallery" className="text-pink-500 hover:underline">Gallery</Link></li>
          <li><Link href="/contact" className="text-pink-500 hover:underline">Contact</Link></li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
        <ul className="space-y-2">
          {posts?.map((post) => (
            <li key={post.slug}>
              <Link 
                href={`/blog/${post.slug}`}
                className="text-pink-500 hover:underline"
              >
                {post.title}
              </Link>
              <span className="text-sm text-muted-foreground ml-2">
                ({new Date(post.created_at).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}