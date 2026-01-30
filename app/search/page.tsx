import { Suspense } from 'react'
import Link from 'next/link' // Добавили импорт Link
import { createServiceSupabase } from '@/lib/supabaseServer'
import BlogSection from '@/components/blog-section'

export const dynamic = 'force-dynamic'

async function SearchResults({ q, lang }: { q: string, lang: "en" | "es" }) {
  const supabase = createServiceSupabase()

  // 1. Сначала ДЕЛАЕМ запрос
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    .order('created_at', { ascending: false })

  // 2. Потом ПРОВЕРЯЕМ результат
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground mb-6">
          {lang === 'es' ? 'No se encontró nada...' : 'Nothing found...'}
        </p>
        <Link href="/" className="text-primary hover:underline underline-offset-4 font-medium transition-all">
          {lang === 'es' ? '← Volver al inicio' : '← Back to home'}
        </Link>
      </div>
    )
  }

  // 3. Если посты есть — показываем их
  return <BlogSection initialPosts={posts as any[]} language={lang} />
}

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string, lang?: string }> 
}) {
  const params = await searchParams;
  const query = params.q || '';
  const language = (params.lang || 'en') as "en" | "es";

  return (
    <main className="pt-24 container mx-auto px-4 min-h-screen">
       <div className="max-w-4xl mx-auto mb-12 text-center sm:text-left">
         <h1 className="text-4xl font-bold mb-4">
           {query 
             ? (language === 'es' ? `Resultados para: "${query}"` : `Search Results for: "${query}"`)
             : (language === 'es' ? "Explorar artículos" : "Explore articles")}
         </h1>
       </div>

       <Suspense key={query} fallback={
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="h-64 bg-muted/50 rounded-2xl" />
           ))}
         </div>
       }>
         <SearchResults q={query} lang={language} />
       </Suspense>
    </main>
  );
}