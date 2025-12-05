'use client'

interface FooterProps {
  readonly language: string
}

const content = {
  en: {
    copyright: '© 2025, Character Blog.'
  },
  es: {
    copyright: '© 2025, Blog de Personaje.'
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
            <a href="/privacy" className="text-xs text-foreground/50 hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-xs text-foreground/50 hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="/contact" className="text-xs text-foreground/50 hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}