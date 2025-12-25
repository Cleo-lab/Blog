// components/cookie-banner-client.tsx
'use client';

import dynamic from 'next/dynamic';

export default dynamic(() => import('./cookie-banner'), {
  ssr: false,
  loading: () => null
});