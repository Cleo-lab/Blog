'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
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
import TopAdStrip from '@/components/TopAdStrip'

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

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'ja'>('ja')
  const { isLoggedIn, isAdmin, email, loading } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentSection, setCurrentSection] = useState('home')

  const handleSignIn = useCallback(async (userEmail: string) => {
    console.log('User signed in:', userEmail)
    setRefreshKey((prev) => prev + 1)
  }, [])

  const handleSignOut = useCallback(async () => {
  console.log('Signing out...')

  try {
    const supabase = useSupabase()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Sign out error:', error)
  } finally {
    localStorage.clear()
    window.location.href = '/'
  }
}, [])
  useEffect(() => {
    const validSections = ['home', 'signin', 'signup', 'profile', 'mycomments', 'admin']
    if (!validSections.includes(currentSection)) {
      setCurrentSection('home')
    }
  }, [currentSection])

  // ИСПРАВЛЕНИЕ: Проверка доступа к защищенным разделам
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
      {currentSection === 'home' && (
        <>
          <section id="home">
            <Hero setCurrentSection={setCurrentSection} />
          </section>
          <section id="about">
            <About language={language} />
          </section>
          <section id="blog">
            <BlogSection language={language} />
          </section>
          <MiddleAdBanner />
          <section id="gallery">
            <Gallery language={language} />
          </section>
          <section id="subscribe">
            <Subscribe language={language} />
          </section>
          <FootAdBanner />
          <Footer language={language} />
        </>
      )}

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

      {currentSection === 'profile' && isLoggedIn && (
        <UserProfile
          setCurrentSection={setCurrentSection}
          onProfileUpdate={() => setRefreshKey((prev) => prev + 1)}
        />
      )}

      {currentSection === 'mycomments' && isLoggedIn && (
        <MyComments
          setCurrentSection={setCurrentSection}
        />
      )}

      {currentSection === 'admin' && isAdmin && (
        <AdminPanel
          setCurrentSection={setCurrentSection}
        />
      )}
    </main>
  )
}

