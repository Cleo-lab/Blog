'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SupportButtonClientProps {
  text: string
}

export default function SupportButtonClient({ text }: SupportButtonClientProps) {
  return (
    <Link href="/support">
      <Button
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg px-8 cursor-pointer"
        size="lg"
      >
        <Heart className="w-5 h-5 mr-2 shrink-0" />
        {text}
      </Button>
    </Link>
  )
}