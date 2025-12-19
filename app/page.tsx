'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { Heart, Sparkles, Lock, UserPlus} from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/header'
import Hero from '@/components/hero'
import About from '@/components/about'
import BlogSection from '@/components/blog-section'
import Gallery from '@/components/gallery'
import Subscribe from '@/components/subscribe'
import Footer from '@/components/footer'
import FootAdBanner from '@/components/FootAdBanner'
import { useAuth } from '@/hooks/use-auth'
import { useSupabase } from '@/hooks/use-supabase'
import MiddleAdBanner from '@/components/MiddleAdBanner'
import { useSearchParams, useRouter } from 'next/navigation'
import DonorList from '@/components/donor-list' 
import BlueskyFeed from '@/components/bluesky-feed'
import AnalyticsTracker from '@/components/analytics-tracker';
import BlogTeaser from '@/components/blog/blog-teaser';



const SignIn = dynamic(() => import('@/components/auth/sign-in'), {
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
})

const SignUp = dynamic(() => import('@/components/auth/sign-up'), {
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
})

const UserProfile = dynamic(() => import('@/components/profile/user-profile'), {
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
})

const MyComments = dynamic(() => import('@/components/profile/my-comments'), {
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
})

const AdminPanel = dynamic(() => import('@/components/admin/admin-panel'), {
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
})

const SupportPage = dynamic(() => import('@/components/support-page'), {
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
})

function HomeContent() {
  const [language, setLanguage] = useState<'en' | 'ja'>('ja')
  const { isLoggedIn, isAdmin, email, loading } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentSection, setCurrentSection] = useState('home')
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = useSupabase()

  useEffect(() => {
    const section = searchParams.get('section')
    const tab = searchParams.get('tab')
    
    if (tab && isAdmin) {
      setCurrentSection('admin')
    } else if (section === 'admin' && isAdmin) {
      setCurrentSection('admin')
    } else if (section) {
      const validSections = ['home', 'signin', 'signup', 'profile', 'mycomments', 'support']
      if (validSections.includes(section)) {
        setCurrentSection(section)
      }
    }
  }, [searchParams, isAdmin])

  const handleSignIn = useCallback(async (userEmail: string) => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      localStorage.clear()
      globalThis.location.href = '/'
    }
  }, [supabase])

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn && (currentSection === 'profile' || currentSection === 'mycomments')) {
        setCurrentSection('home')
      }
      if (!isAdmin && currentSection === 'admin') {
        setCurrentSection('home')
      }
    }
  }, [isLoggedIn, isAdmin, currentSection, loading])

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground" suppressHydrationWarning>
      <Header
        key={refreshKey}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        language={language}
        setLanguage={(lang: string) => setLanguage(lang as 'en' | 'ja')}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
      />
<AnalyticsTracker isAdmin={isAdmin} />
      {currentSection === 'home' && (
  <>
    <section id="home" className="pt-15 pb-4 px-2">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ЛЕВАЯ КОЛОНКА: Доноры */}
<div className="lg:col-span-3 order-2 lg:order-1">
  <div className="relative overflow-hidden p-5 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(225,29,72,0.2)] h-fit transition-all 
    bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900">
    
    {/* Декоративные пятна света, чтобы фон не был скучным */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/30 blur-[60px] rounded-full" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full" />

    {/* Заголовок теперь ярко-белый и заметный */}
    <h3 className="relative z-10 text-sm font-black mb-4 text-center uppercase tracking-[0.15em] text-white flex items-center justify-center gap-2">
      <Heart className="w-4 h-4 text-rose-400 animate-pulse fill-rose-400" />
      The People Who Keep My Blog Alive
      <Heart className="w-4 h-4 text-rose-400 animate-pulse fill-rose-400" />
    </h3>

    <div className="relative z-10">
      <DonorList key={refreshKey} />
    </div>

    <p className="relative z-10 text-[9px] text-center mt-4 text-rose-200/50 font-medium uppercase tracking-widest">
      You keep this dream alive ✨
    </p>
  </div>
</div>

{/* ЦЕНТРАЛЬНАЯ КОЛОНКА: Hero */}
<div className="lg:col-span-5 order-1 lg:order-2 lg:-mt-5">
  <Hero setCurrentSection={setCurrentSection} />
</div>

        {/* ПРАВАЯ КОЛОНКА: Bluesky + Тизер */}
<div className="lg:col-span-3 order-3 flex flex-col">
  <div className="relative group min-h-[500px]">
    <div className={`rounded-3xl border border-border/50 p-6 shadow-xl lg:-mt-12 transition-all duration-1000 h-full relative overflow-hidden ${
      !isLoggedIn 
        ? 'blur-[4px] select-none pointer-events-none' 
        : 'animate-in fade-in slide-in-from-right-4'
    } ${
      /* Общий фон для обоих состояний, но с разной прозрачностью */
      'bg-gradient-to-br from-purple-500/5 via-white/80 dark:via-zinc-900/80 to-pink-500/5 backdrop-blur-md'
    }`}>
      
      {/* Мягкие цветные пятна на фоне (Glowing Blobs) */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/10 blur-[50px] rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-400/10 blur-[50px] rounded-full" />

      {/* Контент ленты */}
      <div className="relative z-10">
        <h3 className="text-md font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
          Updates 🦋
        </h3>
        
        {/* Оборачиваем ленту в контейнер, чтобы она была чуть контрастнее на светлом фоне */}
        <div className={isLoggedIn ? "opacity-100" : "opacity-40"}>
          <BlueskyFeed />
        </div>
      </div>

      {/* Дополнительный розовый блик только для красоты залогиненных */}
      {isLoggedIn && (
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400/20 to-transparent" />
      )}
    </div>

    {/* ТИЗЕР (только для гостей) */}
    {!isLoggedIn && (
      <div className="absolute inset-0 z-30 flex items-center justify-center lg:-mt-12 p-4">
        <BlogTeaser onSignIn={() => setCurrentSection('signin')} />
      </div>
    )}
  </div>
</div>
        
      </div> {/* <-- Закрываем max-w-[1400px] */}
    </section> {/* <-- Закрываем id="home" */}

    <section id="about"><About language={language} /></section>
    <section id="blog"><BlogSection language={language} /></section>
    <MiddleAdBanner />
    <section id="gallery"><Gallery language={language} /></section>
    <section id="subscribe"><Subscribe language={language} /></section>
    <FootAdBanner />
    <Footer language={language} />
  </>
)}

      {currentSection === 'support' && <SupportPage />}
      {currentSection === 'signin' && <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => setCurrentSection('signup')} setCurrentSection={setCurrentSection} />}
      {currentSection === 'signup' && <SignUp onSignUp={handleSignIn} onSwitchToSignIn={() => setCurrentSection('signin')} setCurrentSection={setCurrentSection} />}
      {currentSection === 'profile' && isLoggedIn && <UserProfile setCurrentSection={setCurrentSection} onProfileUpdate={() => setRefreshKey((prev) => prev + 1)} />}
      {currentSection === 'mycomments' && isLoggedIn && <MyComments setCurrentSection={setCurrentSection} />}
      {currentSection === 'admin' && isAdmin && <AdminPanel setCurrentSection={setCurrentSection} />}
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><div className="animate-pulse">Loading...</div></div>}>
      <HomeContent />
    </Suspense>
  )
}