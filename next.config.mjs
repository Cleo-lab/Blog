import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  
  // ✅ Turbopack пустой конфиг (убирает ошибку)
  turbopack: {},
  
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', 'react-markdown'],
    // Увеличиваем таймаут для медленных изображений
    proxyTimeout: 180000,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 240, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    // Отключаем оптимизацию для dev режима (помогает с таймаутами)
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // ✅ Заголовки для кеширования
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default bundleAnalyzer(nextConfig)