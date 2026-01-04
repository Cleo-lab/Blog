'use client'

import Link from 'next/link'
import { UI } from '@/components/ui-texts'

interface LoadMoreBtnProps {
  href: string
  lang?: string // Упрощаем тип для гибкости
  color?: 'pink' | 'purple'
}

export default function LoadMoreBtn({ href, lang = 'en', color = 'pink' }: LoadMoreBtnProps) {
  // 1. Принудительно приводим к нижнему регистру и проверяем, есть ли такой язык в словаре
  const currentLang = (lang.toLowerCase() === 'es') ? 'es' : 'en';
  
  // 2. Безопасно получаем текст. 
  // Если UI[currentLang] или UI[currentLang].loadMore не существует, используем запасной вариант
  const buttonText = UI && UI[currentLang] && UI[currentLang].loadMore 
    ? UI[currentLang].loadMore 
    : 'View More';

  const colorClass =
    color === 'pink'
      ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
      : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600';

  return (
    <div className="w-full flex justify-center py-10">
      <Link
        href={href}
        className={`px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all ${colorClass}`}
      >
        {buttonText}
      </Link>
    </div>
  )
}