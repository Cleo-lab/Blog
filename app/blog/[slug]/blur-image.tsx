'use client'

import { useState, useMemo } from 'react'

export default function BlurImage({ src, alt, ...rest }: any) {
  const propsMatch = alt?.match(/\{([^}]+)\}/)
  const caption = alt?.replace(/\{[^}]+\}/, '').trim() || ''
  
  const hasBlur = propsMatch ? propsMatch[1].toLowerCase().includes('blur') : false
  const scaleMatch = propsMatch?.[1]?.match(/scale[:=](\d+)/i)
  const scale = scaleMatch ? parseInt(scaleMatch[1], 10) : 100
  
  const [revealed, setRevealed] = useState(false)
  const showBlur = hasBlur && !revealed
  
  const uniqueId = useMemo(() => {
    const srcKey = src?.split('/').pop()?.replace(/[^a-z0-9]/gi, '').slice(0, 10) || 'img'
    return `blur-${srcKey}-${scale}`
  }, [src, scale])

  // Удаляем width/height из rest если есть
  const { width, height, style, ...cleanRest } = rest

  return (
    <span className="block my-12 text-center">
      {/* CSS с версией v2 для сброса кэша */}
      <style>{`
        #${uniqueId} {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 100% !important;
          display: inline-block !important;
        }
        @media (min-width: 768px) {
          #${uniqueId} { 
            max-width: ${scale}% !important; 
            min-width: auto !important;
          }
        }
      `}</style>
      
      <span 
        id={uniqueId}
        className={`relative overflow-hidden rounded-2xl shadow-2xl inline-block ${hasBlur ? 'cursor-pointer' : ''}`}
        onClick={() => hasBlur && setRevealed(true)}
      >
        <img
          {...cleanRest}
          src={src}
          alt={caption}
          className={`w-full h-auto block transition-all duration-700 ${showBlur ? 'blur-2xl' : 'blur-0'}`}
        />
      </span>
      
      {caption && caption.toLowerCase() !== 'image' && (
        <span className="block mt-4 text-sm italic text-muted-foreground px-4">
          {caption}
        </span>
      )}
    </span>
  )
}