'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FooterProps {
  readonly language: string
  readonly onSupportClick?: () => void
}

const content = {
  en: {
    copyright: '© 2025, Character Blog.',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    about: 'About',
    support: 'Support',
    // ✅ Добавляем новые переводы для улучшенной навигации
    explore: 'Explore',
    home: 'Home',
    blogArchive: 'Blog Archive',
    gallery: 'Gallery',
    topics: 'Topics',
    connect: 'Connect',
    legal: 'Legal',
    sitemap: 'Sitemap',
  },
  es: {
    copyright: '© 2025, Blog de Personaje.',
    privacy: 'Privacidad',
    terms: 'Términos',
    contact: 'Contacto',
    about: 'Acerca de',
    support: 'Apoyar',
    explore: 'Explorar',
    home: 'Inicio',
    blogArchive: 'Archivo del Blog',
    gallery: 'Galería',
    topics: 'Temas',
    connect: 'Conectar',
    legal: 'Legal',
    sitemap: 'Mapa del Sitio',
  }
}

export default function Footer({ language, onSupportClick }: FooterProps) {
  const t = content[language as keyof typeof content] || content.en

  return (
    <footer className="bg-card border-t border-border/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Support Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={onSupportClick}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg px-8"
            size="lg"
          >
            <Heart className="w-5 h-5 mr-2 shrink-0" />
            {t.support}
          </Button>
        </div>

        {/* ✅ РАСШИРЕННАЯ НАВИГАЦИЯ ДЛЯ SEO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Main Navigation */}
          <nav aria-label="Main navigation">
            <h3 className="font-semibold text-base mb-4 text-foreground">
              {t.explore}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-foreground/70 hover:text-primary transition-colors block"
                >
                  {t.home}
                </Link>
              </li>
              <li>
                <Link 
                  href="/archiveblog" 
                  className="text-sm text-foreground/70 hover:text-primary transition-colors block"
                >
                  {t.blogArchive}
                </Link>
              </li>
              <li>
                <Link 
                  href="/archivegallery" 
                  className="text-sm text-foreground/70 hover:text-primary transition-colors block"
                >
                  {t.gallery}
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-foreground/70 hover:text-primary transition-colors block"
                >
                  {t.about}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Topics - статичный список для SEO */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-foreground">
              {t.topics}
            </h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>Digital Business</li>
              <li>Creator Economy</li>
              <li>Online Monetization</li>
              <li>Content Strategy</li>
            </ul>
          </div>

          {/* Connect */}
          <nav aria-label="Social media">
            <h3 className="font-semibold text-base mb-4 text-foreground">
              {t.connect}
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://bsky.app/profile/yurieblog.bsky.social" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/70 hover:text-[#0085ff] transition-colors flex items-center gap-1"
                >
                  <span className="text-base">🦋</span> Bluesky
                </a>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-sm text-foreground/70 hover:text-primary transition-colors block"
                >
                  {t.contact}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal information">
            <h3 className="font-semibold text-base mb-4 text-foreground">
              {t.legal}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/sitemap-html"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors block"
                >
                  {t.sitemap}
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-foreground/70 hover:text-primary transition-colors block"
                >
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm text-foreground/70 hover:text-primary transition-colors block"
                >
                  {t.terms}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-foreground/60">
            {t.copyright} Made with love 💖
          </p>
        </div>
      </div>
    </footer>
  )
}