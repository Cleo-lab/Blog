'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, LogOut, User, MessageSquare, Menu, X, Search, Heart } from 'lucide-react' // Добавили Heart для иконки
import { useAuth } from '@/hooks/use-auth'
import SearchBar from '@/components/search-bar'

interface HeaderProps {
  currentSection: string
  setCurrentSection: (section: string) => void
  language: string
  setLanguage: (lang: string) => void
  isLoggedIn?: boolean
  isAdmin?: boolean
  onSignOut?: () => void
}

const translations = {
  en: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    gallery: 'Gallery',
    subscribe: 'Subscribe',
    // НОВЫЙ ПЕРЕВОД
    support: 'Donate / Support', 
    signIn: 'Sign In',
    profile: 'Profile',
    comments: 'Comments',
    signOut: 'Sign Out',
    blogManagement: 'Blog Management'
  },
  es: {
    home: 'Inicio',
    about: 'Acerca de',
    blog: 'Blog',
    gallery: 'Galería',
    subscribe: 'Suscribirse',
    // НОВЫЙ ПЕРЕВОД
    support: 'Donar / Apoyar', 
    signIn: 'Iniciar Sesión',
    profile: 'Perfil',
    comments: 'Comentarios',
    signOut: 'Cerrar Sesión',
    blogManagement: 'Gestión del Blog'
  }
}

export default function Header({ currentSection, setCurrentSection, language, setLanguage, isLoggedIn, isAdmin, onSignOut }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { avatarUrl } = useAuth()
  const t = translations[language as keyof typeof translations] || translations.en

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'about', label: t.about },
    { id: 'blog', label: t.blog },
    { id: 'gallery', label: t.gallery },
    { id: 'subscribe', label: t.subscribe }
  ]

  // Добавляем новую ссылку "Support" в конец списка
  const allNavItems = [
    ...navItems,
    // НОВЫЙ ПУНКТ НАВИГАЦИИ, ведущий на 'support'
    { id: 'support', label: t.support, isSpecial: true } 
  ]

  const handleNavClick = (sectionId: string) => {
    // Если это 'support', просто переходим в новую секцию
    if (sectionId === 'support') {
      setCurrentSection('support')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Логика для прокрутки на главной странице
    if (currentSection !== 'home' || sectionId === 'home') {
      setCurrentSection('home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (sectionId !== 'home') {
      // Даем Next.js время перерендерить 'home', если мы были на другой странице
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, currentSection !== 'home' ? 50 : 0) // Небольшая задержка, если переходим с другой страницы
    }
  }

  // Функция для рендеринга кнопки навигации
  const renderNavItem = (item: { id: string, label: string, isSpecial?: boolean }, isMobile: boolean = false) => {
    // Если это "Support", делаем её заметной, как кнопку
    if (item.id === 'support') {
      return (
        <Button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          // На десктопе используем кнопку с акцентным стилем
          className={`
            ${isMobile ? 'w-full justify-start block text-left' : ''}
            bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg
          `}
          variant="default"
          size={isMobile ? 'default' : 'sm'}
        >
          <Heart className="w-4 h-4 mr-2" />
          {item.label}
        </Button>
      )
    }

    // Обычные ссылки навигации
    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className={`
          ${isMobile ? 'block w-full text-left px-4 py-2' : 'px-3 py-2'}
          rounded-lg text-sm font-medium transition-colors 
          ${(currentSection === 'home' && currentSection === item.id) ? 
             'text-primary bg-muted' : 
             'text-foreground/70 hover:bg-muted hover:text-foreground'}
        `}
      >
        {item.label}
      </button>
    )
  }


  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')} suppressHydrationWarning>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary animate-float" />
            <span className="hidden sm:inline font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Yurie
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Обычные ссылки */}
            {navItems.map((item) => renderNavItem(item))} 
            {/* Кнопка Support */}
            {renderNavItem(allNavItems.find(item => item.id === 'support')!, false)}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <SearchBar />
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')}>
                  Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu / Sign In */}
            {!isLoggedIn ? (
              <Button 
                onClick={() => setCurrentSection('signin')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {t.signIn}
              </Button>
            ) : (
              <>
                {isAdmin && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentSection('admin')}
                    className="hidden sm:inline-flex"
                  >
                    {t.blogManagement}
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary hover:shadow-lg transition-shadow overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                          👤
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setCurrentSection('profile')}>
                      <User className="w-4 h-4 mr-2" />
                      {t.profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentSection('mycomments')}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {t.comments}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      onSignOut?.()
                      setIsMenuOpen(false)
                    }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t.signOut}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Search - Оставляем как есть, если нужно его добавить в мобильное меню, то это отдельная задача */}
          {/* <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="md:hidden p-2 rounded-lg hover:bg-muted">
             <Search className="w-5 h-5" />
          </button>
          {showMobileSearch && <SearchBar />} */}


        {/* Mobile Navigation - Выносим в отдельный блок для лучшей читаемости и правильного отображения */}
        {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-background/90 backdrop-blur-sm shadow-lg md:hidden">
                <nav className="pb-4 space-y-2 border-t border-border pt-4 px-4">
                    {allNavItems.map((item) => (
                        <div key={item.id} onClick={() => setIsMenuOpen(false)}> 
                            {renderNavItem(item, true)}
                        </div>
                    ))}
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setCurrentSection('admin')
                                setIsMenuOpen(false)
                            }}
                            className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
                        >
                            {t.blogManagement}
                        </button>
                    )}
                </nav>
            </div>
        )}
        </div>
      </div>
    </header>
  )
}