import { MetadataRoute } from 'next'


export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    '/api/',
    '/admin/',
    '/auth/',
    '/drafts/',
    '/preview/',
    '/checkout/',
  ]

  return {
    rules: [
      // Block AI scrapers
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'Google-Extended',
          'Applebot-Extended',
          'OAI-SearchBot',
          'PerplexityBot',
          'Bytespider',
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'BLEXBot',
          'DotBot',
          'Exabot',
        ],
        disallow: '/',
      },
      
      // Allow Googlebot
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/archiveblog',
          '/blog/',
          '/_next/static/',
          '/_next/image',
          '/videos/',
          '/storage/v1/object/public/',
        ],
        disallow: privatePaths,
      },
      
      // Allow Bingbot
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/archiveblog',
          '/blog/',
          '/_next/static/',
          '/_next/image',
          '/videos/',
          '/storage/v1/object/public/',
        ],
        disallow: privatePaths,
      },
      
      // Default rule for other bots
      {
        userAgent: '*',
        allow: [
          '/',
          '/archiveblog',
          '/blog/',
        ],
        disallow: privatePaths,
      },
    ],
    sitemap: 'https://yurieblog.vercel.app/sitemap.xml'
  }
}