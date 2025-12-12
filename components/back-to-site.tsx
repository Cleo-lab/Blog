'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BackToSite() {
  return (
    <Link
      href="/"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full
                 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg
                 hover:from-rose-500 hover:to-pink-500 hover:shadow-xl transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-pink-400"
      aria-label="Back to site"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to site
    </Link>
  )
}