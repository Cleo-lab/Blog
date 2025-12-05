'use client';

import React, { useEffect, useRef } from 'react';

export default function TopAdStrip() {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      const adEl = adRef.current;

      // Если элемент уже инициализирован — не выполнять push()
      if (!adEl || adEl.getAttribute('data-adsbygoogle-status')) {
        return;
      }

      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Adsense initialization error:', err);
    }
  }, []);

  return (
    <aside className="w-full h-[100px] bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 relative overflow-hidden">
      {/* background... */}

      <div className="relative z-10 flex h-full items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "728px", height: "90px" }}
          data-ad-client="ca-pub-0000000000000000"
          data-ad-slot="0000000000"
          data-adtest="on"
        />
      </div>
    </aside>
  );
}
