'use client'

import Link from 'next/link'

export default function LoadMoreBtn({
  href,
  text = 'More stories',
  color = 'pink',
}: {
  href: string
  text?: string
  color?: 'pink' | 'purple'
}) {
  const colorClass =
    color === 'pink'
      ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
      : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'

  return (
    <div className="w-full flex justify-center py-10">
      <Link
        href={href}
        className={`px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all ${colorClass}`}
      >
        {text}
      </Link>
    </div>
  )
}