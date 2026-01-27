'use client'
import { useState } from 'react'

const parseImageProps = (alt: string) => {
  const propsMatch = alt.match(/\{([^}]+)\}/)
  const caption = alt.replace(/\{[^}]+\}/, '').trim()
  let scale = 100
  let blur = false
  if (propsMatch) {
    const props = propsMatch[1]
    const scaleMatch = props.match(/scale[:=](\d+)/i)
    const blurMatch = props.match(/blur[:=](true|false)/i)
    const simpleBlur = props.toLowerCase().includes('blur') && !props.toLowerCase().includes('blur=false')
    if (scaleMatch) scale = parseInt(scaleMatch[1], 10)
    if (blurMatch) blur = blurMatch[1] === 'true'
    else if (simpleBlur) blur = true
  }
  return { caption, scale, blur }
}

export default function BlurImage({ src, alt, ...rest }: any) {
  const { caption, scale, blur } = parseImageProps(alt)
  const [isBlurred, setIsBlurred] = useState(blur)

  return (
    <span className="block my-12 text-center">
      <span
        className="relative inline-block w-full overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
        style={{ maxWidth: `${scale}%` }}
        onClick={() => setIsBlurred(false)}
      >
        <img
          {...rest}
          src={src}
          alt={caption}
          loading="lazy"
          className={`mx-auto w-full h-auto block transition-all duration-700 ${
            isBlurred ? 'blur-2xl hover:blur-none' : 'blur-0'
          }`}
        />
      </span>
      {caption && caption.toLowerCase() !== 'image' && (
        <span className="block mt-4 text-sm text-muted-foreground italic px-4">{caption}</span>
      )}
    </span>
  )
}