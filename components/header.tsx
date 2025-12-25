// components/header.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Globe,
  LogOut,
  User,
  MessageSquare,
  Menu,
  X,
  Search,
  Heart,
  Award,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import SearchBar from '@/components/search-bar';
import NotificationsBell from '@/components/notifications-bell';

interface HeaderProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onSignOut?: () => void;
}

const translations = {
  en: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    gallery: 'Gallery',
    subscribe: 'Subscribe',
    support: 'Support',
    signIn: 'Sign In',
    profile: 'Profile',
    comments: 'Comments',
    signOut: 'Sign Out',
    blogManagement: 'Blog Management',
    achievements: 'Achievements',
    favourites: 'Favourites',
    notifications: 'Notifications',
  },
  es: {
    home: 'Inicio',
    about: 'Sobre mí',
    blog: 'Blog',
    gallery: 'Galería',
    subscribe: 'Suscribirse',
    support: 'Apoyar',
    signIn: 'Entrar',
    profile: 'Perfil',
    comments: 'Comentarios',
    signOut: 'Cerrar sesión',
    blogManagement: 'Blog Management',
    achievements: 'Logros',
    favourites: 'Favoritos',
    notifications: 'Notificaciones',
  },
};

export default function Header({ currentSection, setCurrentSection, language, setLanguage, isLoggedIn, isAdmin, onSignOut }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { avatarUrl } = useAuth();
  const t = translations[language as keyof typeof translations] || translations.en;

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'about', label: t.about },
    { id: 'blog', label: t.blog },
    { id: 'gallery', label: t.gallery },
    { id: 'subscribe', label: t.subscribe },
    { id: 'support', label: t.support, isSpecial: true },
  ];

  // НОВАЯ ФУНКЦИЯ: Навигация внутри профиля
  const navigateToProfileSection = (sectionId: string) => {
    // 1. Сначала переключаем экран на Профиль
    setCurrentSection('profile');
    
    // 2. Ждем, пока компонент UserProfile загрузится, и скроллим к нужному ID
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'support') {
      setCurrentSection('support');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentSection !== 'home' || sectionId === 'home') {
      setCurrentSection('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (sectionId !== 'home') {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, currentSection !== 'home' ? 50 : 0);
    }
  };

  const renderNavItem = (item: { id: string; label: string; isSpecial?: boolean }, isMobile = false) => {
    if (item.isSpecial) {
      return (
        <Button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={`${isMobile ? 'w-full' : ''} bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg`}
          variant="default"
          size={isMobile ? 'default' : 'sm'}
        >
          <Heart className="w-4 h-4 mr-2 shrink-0" />
          {item.label}
        </Button>
      );
    }
    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className={`${isMobile ? 'block w-full text-left px-4 py-2' : 'px-3 py-2'} rounded-lg text-sm font-medium transition-colors ${
          currentSection === 'home' && currentSection === item.id ? 'text-primary bg-muted' : 'text-foreground/70 hover:bg-muted hover:text-foreground'
        }`}
      >
        {item.label}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <span className="hidden sm:inline font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Yurie
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => renderNavItem(item))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Change language" className="w-9 h-9 rounded-full hover:bg-muted">
      <Globe className="w-5 h-5 text-foreground/70" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-muted font-bold' : ''}>
      🇺🇸 English {language === 'en' && '✓'}
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setLanguage('es')} className={language === 'es' ? 'bg-muted font-bold' : ''}>
      🇪🇸 Español {language === 'es' && '✓'}
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
            <div className="hidden md:block">
  <SearchBar />
</div>
            
            {!isLoggedIn ? (
              <Button onClick={() => setCurrentSection('signin')} className="bg-primary hover:bg-primary/90 hidden sm:flex">
                {t.signIn}
              </Button>
            ) : (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => setCurrentSection('admin')} className="hidden sm:inline-flex">
                    {t.blogManagement}
                  </Button>
                )}
                {!isAdmin && <NotificationsBell />}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary hover:shadow-lg transition-shadow overflow-hidden border border-border/50">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-primary-foreground">👤</div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigateToProfileSection('profile-info')}>
                      <User className="w-4 h-4 mr-2" />
                      {t.profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfileSection('profile-comments')}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {t.comments}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfileSection('profile-achievements')}>
                      <Award className="w-4 h-4 mr-2" />
                      {t.achievements}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfileSection('profile-favourites')}>
                      <Heart className="w-4 h-4 mr-2" />
                      {t.favourites}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfileSection('profile-notifications')}>
                      <Bell className="w-4 h-4 mr-2" />
                      {t.notifications}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onSignOut?.()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t.signOut}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* НОВАЯ КНОПКА МЕНЮ ДЛЯ МОБИЛОК */}
            <button 
              className="md:hidden p-2 rounded-lg text-foreground/70 hover:bg-muted"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
			  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ (выпадает при клике) */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-in slide-in-from-top duration-300 overflow-hidden">
          <div className="px-4 pt-2 pb-6 space-y-2">
		  <div className="pt-2 pb-2">
        <SearchBar />
      </div>
            {navItems.map((item) => (
              <div key={item.id} onClick={() => setIsMenuOpen(false)}>
                {renderNavItem(item, true)}
              </div>
            ))}
            {!isLoggedIn && (
              <Button 
                onClick={() => { setCurrentSection('signin'); setIsMenuOpen(false); }} 
                className="w-full bg-primary mt-4"
              >
                {t.signIn}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}