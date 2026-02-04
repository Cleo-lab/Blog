'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Добавили useRouter
import Link from 'next/link';
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
  Award,
  Bell,
  Heart,
  LayoutDashboard, // Добавили иконку для админки
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
    signIn: 'Sign In',
    profile: 'Profile',
    comments: 'Comments',
    signOut: 'Sign Out',
    blogManagement: 'Admin Panel', // Сделали понятнее
    achievements: 'Achievements',
    favourites: 'Favourites',
    notifications: 'Notifications',
  },
  // ... es translations ...
};

export default function Header({ 
  currentSection, 
  setCurrentSection, 
  language, 
  setLanguage, 
  isLoggedIn, 
  isAdmin, 
  onSignOut 
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Используем роутер для навигации
  const { avatarUrl } = useAuth();
  const t = translations[language as keyof typeof translations] || translations.en;

  const isHomePage = pathname === '/';

  // Функция для перехода в профиль на конкретный якорь
  const navigateToProfileSection = (anchor: string) => {
    // 🔄 ПЕРЕХОДИМ на страницу дашборда с якорем
    router.push(`/dashboard#${anchor}`);
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: t.home, href: '/' },
    { id: 'about', label: t.about, href: '/about' },
    { id: 'blog', label: t.blog, href: '/archiveblog' },
    { id: 'gallery', label: t.gallery, href: '/archivegallery' },
    { id: 'subscribe', label: t.subscribe, href: '/#subscribe' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-violet-600" />
            <span className="font-bold text-lg bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
              Yurie
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href ? 'text-primary bg-muted' : 'text-foreground/70 hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            
            {!isLoggedIn ? (
  <Button asChild className="bg-primary hover:bg-primary/90">
    <Link href="/login">
      {t.signIn}
    </Link>
  </Button>
) : (
              <>
                {/* 🔄 Кнопка Админки теперь ведет на СТРАНИЦУ */}
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      {t.blogManagement}
                    </Button>
                  </Link>
                )}
                
                {!isAdmin && <NotificationsBell />}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-9 h-9 rounded-full border-2 border-primary/20 overflow-hidden hover:border-primary/50 transition-all">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-xs">👤</div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    {/* 🔄 Все пункты теперь ведут на /dashboard */}
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                      <User className="w-4 h-4 mr-2" /> {t.profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfileSection('profile-comments')}>
                      <MessageSquare className="w-4 h-4 mr-2" /> {t.comments}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfileSection('profile-achievements')}>
                      <Award className="w-4 h-4 mr-2" /> {t.achievements}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={onSignOut}>
                      <LogOut className="w-4 h-4 mr-2" /> {t.signOut}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-background border-b space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.id} 
              href={item.href} 
              className="block p-2 hover:bg-muted rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!isLoggedIn && (
  <Button asChild className="w-full">
    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
      {t.signIn}
    </Link>
  </Button>
)}
        </div>
      )}
    </header>
  );
}