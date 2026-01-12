'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SupportButton() {
  const router = useRouter()

  return (
    <div className="flex justify-center">
      <Button
        // Переходим на главную и открываем секцию support
        onClick={() => router.push('/?section=support')}   
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg px-8"
        size="lg"
      >
        <Heart className="w-5 h-5 mr-2 shrink-0" />
        Support
      </Button>
    </div>
  )
}