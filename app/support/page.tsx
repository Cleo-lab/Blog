// app/support/page.tsx
'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CryptoDonationBox from '@/components/crypto-donation-box'

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <Link 
            href="/" 
            className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-80"
          >
            Yurie
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-12 pb-16">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-foreground">
            Support the Project
          </h1>
          <p className="text-center text-lg text-foreground/70 mb-10">
            Your crypto donation is crucial for maintaining and expanding this blog. Thank you for your generosity!
          </p>
          <CryptoDonationBox />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-6 px-4 mt-auto">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm text-foreground/60">© 2025, Character Blog. Made with love 💖</p>
        </div>
      </footer>
    </div>
  )
}