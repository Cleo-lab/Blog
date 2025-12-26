import HomeClient from '@/components/home-client'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function HomePage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, featured_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return <HomeClient initialPosts={posts ?? []} />
}