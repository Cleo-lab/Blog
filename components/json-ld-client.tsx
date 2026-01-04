'use client'

import dynamic from 'next/dynamic'

const JsonLdScript = dynamic(() => import('@/app/structured-data'), {
  ssr: false,
  loading: () => null,
})

export default function JsonLdClient() {
  return <JsonLdScript />
}