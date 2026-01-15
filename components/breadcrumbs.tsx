// components/breadcrumbs.tsx
'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs if not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname)

  // Don't show on homepage
  if (pathname === '/') return null

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`mb-6 ${className}`}
    >
      <ol 
        className="flex items-center space-x-2 text-sm text-muted-foreground"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <li 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
        >
          <Link 
            href="/" 
            className="flex items-center hover:text-primary transition-colors"
            itemProp="item"
          >
            <Home className="w-4 h-4" />
            <meta itemProp="name" content="Home" />
            <meta itemProp="position" content="1" />
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => (
          <li 
            key={item.href} 
            className="flex items-center"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <ChevronRight className="w-4 h-4 mx-1" />
            {index === breadcrumbItems.length - 1 ? (
              <span 
                className="font-medium text-foreground" 
                itemProp="name"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href} 
                className="hover:text-primary transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Auto-generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ''
  
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Format label
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // Special cases
    const labelMap: Record<string, string> = {
      'archiveblog': 'Blog Archive',
      'archivegallery': 'Gallery Archive',
      'blog': 'Blog',
      'gallery': 'Gallery',
      'about': 'About',
      'contact': 'Contact',
      'privacy': 'Privacy Policy',
      'terms': 'Terms of Service',
    }
    
    if (labelMap[segment.toLowerCase()]) {
      label = labelMap[segment.toLowerCase()]
    }

    breadcrumbs.push({
      label,
      href: currentPath,
    })
  })

  return breadcrumbs
}