'use client'

interface FooterProps {
  readonly language: string
}

const content = {
  en: {
    copyright: '© 2025, Character Blog.',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact'
  },
  es: {
    copyright: '© 2025, Blog de Personaje.',
    privacy: 'Privacidad',
    terms: 'Términos',
    contact: 'Contacto'
  }
}

export default function Footer({ language }: FooterProps) {
  const t = content[language as keyof typeof content] || content.en

  return (
    <footer className="bg-card border-t border-border/50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/60">
            {t.copyright} Made with love 💖
          </p>

          <nav className="flex gap-6" aria-label="Footer navigation">
            <a
              href="/privacy"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors"
              aria-label={t.privacy + ' Policy'}
            >
              {t.privacy}
            </a>
            <a
              href="/terms"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors"
              aria-label={t.terms + ' of Service'}
            >
              {t.terms}
            </a>
            <a
              href="/contact"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors"
              aria-label={t.contact}
            >
              {t.contact}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}