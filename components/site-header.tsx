'use client'
import dynamic from 'next/dynamic'

const HeaderWrapper = dynamic(
  () => import('@/components/header-wrapper'),
  { 
    loading: () => <div className="h-[72px] w-full bg-background border-b border-border/40" /> 
  }
)

export default function SiteHeader() {
  return <HeaderWrapper />
}