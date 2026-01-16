'use client'

import { useState, useEffect, useCallback } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/header'
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
import AnalyticsTracker from '@/components/analytics-tracker'
import type { Profile } from '@/lib/profile'
import { useToast } from '@/hooks/use-toast'

const DonorList = dynamic(() => import('@/components/donor-list'), { ssr: false })
const BlueskyFeed = dynamic(() => import('@/components/bluesky-feed'), { ssr: false })
const SignIn = dynamic(() => import('@/components/auth/sign-in'))
const SignUp = dynamic(() => import('@/components/auth/sign-up'))
const UserProfile = dynamic(() => import('@/components/profile/user-profile'), { ssr: false })
const MyComments = dynamic(() => import('@/components/profile/my-comments'), { ssr: false })
const AdminPanel = dynamic(() => import('@/components/admin/admin-panel'), { ssr: false })
const SupportPage = dynamic(() => import('@/components/support-page'))
const BlogTeaser = dynamic(() => import('@/components/blog/blog-teaser'))

interface HomeClientProps {
  initialPosts: any[]
  hero: React.ReactNode 
  initialProfile?: Profile | null
}

export default function HomeClient({ initialPosts, hero, initialProfile }: HomeClientProps) {
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const { toast } = useToast()
  
  const { isLoggedIn, isAdmin, loading: authLoading } = useAuth(initialProfile)
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentSection, setCurrentSection] = useState('home')
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = useSupabase()

  useEffect(() => {
    const section = searchParams.get('section')
    const tab = searchParams.get('tab')
    const action = searchParams.get('action')

    if (tab && isAdmin) setCurrentSection('admin')
    else if (section === 'admin' && isAdmin) setCurrentSection('admin')
    else if (action === 'signin') setCurrentSection('signin')
    else if (section) {
      const valid = ['home', 'signin', 'signup', 'profile', 'mycomments', 'support']
      if (valid.includes(section)) setCurrentSection(section)
    }
  }, [searchParams, isAdmin])
  
  useEffect(() => {
    if (searchParams.get('unsubscribed') === 'true') {
      toast({ title: "Success", description: "Unsubscribed successfully 🌸" })
      router.replace('/')
    }
  }, [searchParams, router, toast])

  const handleSignIn = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    router.refresh()
    window.location.href = '/' 
  }, [supabase, router])

  // ✅ Обработчик для кнопки Support в футере
  const handleSupportClick = useCallback(() => {
    setCurrentSection('support')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!authLoading) {
      const isPrivate = ['profile', 'mycomments'].includes(currentSection)
      const isAdminPrivate = currentSection === 'admin'
      
      if (isPrivate && !isLoggedIn) setCurrentSection('home')
      if (isAdminPrivate && !isAdmin) setCurrentSection('home')
    }
  }, [isLoggedIn, isAdmin, currentSection, authLoading])

  if (authLoading && !initialProfile) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-pink-500/30">
      <Header
        key={refreshKey}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        language={language}
        setLanguage={lang => setLanguage(lang as 'en' | 'es')}
        isLoggedIn={isLoggedIn || !!initialProfile}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
      />
      
      <AnalyticsTracker isAdmin={isAdmin} />

      {currentSection === 'home' && (
        <div className="animate-in fade-in zoom-in-95 duration-1000">
          <section id="home" className="pt-4 sm:pt-10 pb-4 px-2">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-3 order-2 lg:order-1 sticky top-24">
                <div className="p-1 rounded-[2.6rem] bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-2xl">
                  <div className="p-5 rounded-[2.5rem] bg-zinc-950/90 backdrop-blur-xl h-fit">
                    <h3 className="text-xs font-black mb-6 text-center uppercase tracking-[0.2em] text-white/90 flex items-center justify-center gap-2">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                      Hall of Fame
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                    </h3>
                    <DonorList key={refreshKey} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                {hero}
              </div>

              <div className="lg:col-span-3 order-3 sticky top-24">
                <div className="relative group">
                  <div className={`rounded-[2.5rem] border border-border/40 p-6 bg-card/40 backdrop-blur-md transition-all duration-700 ${
                    !isLoggedIn && !initialProfile ? 'blur-md grayscale opacity-50' : ''
                  }`}>
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      Live Feed 🦋
                    </h3>
                    <div className="h-[500px] overflow-y-auto custom-scrollbar">
                      <BlueskyFeed />
                    </div>
                  </div>
                  
                  {(!isLoggedIn && !initialProfile) && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
                      <BlogTeaser onSignIn={() => setCurrentSection('signin')} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <About language={language} />
          
          <section id="blog" className="py-2">
            <BlogSection language={language} />
          </section>

          <MiddleAdBanner />
          <Gallery language={language} />
          <Subscribe language={language} />
          <FootAdBanner />
          {/* ✅ Передаём обработчик клика в Footer */}
          <Footer language={language} onSupportClick={handleSupportClick} />
        </div>
      )}

      <div className="relative z-50">
        {currentSection === 'support' && <SupportPage />}
        {currentSection === 'signin' && (
          <SignIn 
            onSignIn={handleSignIn} 
            onSwitchToSignUp={() => setCurrentSection('signup')} 
            setCurrentSection={setCurrentSection} 
          />
        )}
        {currentSection === 'signup' && (
          <SignUp 
            onSignUp={handleSignIn} 
            onSwitchToSignIn={() => setCurrentSection('signin')} 
            setCurrentSection={setCurrentSection} 
          />
        )}
        {(currentSection === 'profile' && (isLoggedIn || initialProfile)) && (
          <UserProfile 
            setCurrentSection={setCurrentSection} 
            onProfileUpdate={() => setRefreshKey(prev => prev + 1)} 
          />
        )}
        {(currentSection === 'mycomments' && (isLoggedIn || initialProfile)) && (
          <MyComments setCurrentSection={setCurrentSection} />
        )}
        {(currentSection === 'admin' && isAdmin) && (
          <AdminPanel setCurrentSection={setCurrentSection} />
        )}
      </div>
    </main>
  )
}