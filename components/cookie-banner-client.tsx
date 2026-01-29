// components/cookie-banner-client.tsx
'use client'

import CookieConsent from 'react-cookie-consent'

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      // Текст основной кнопки
      buttonText="Accept All"
      // Добавляем кнопку отказа для GDPR
      enableDeclineButton
      declineButtonText="Decline"
      cookieName="yurie_blog_consent"
      
      // Стили основной кнопки
      buttonStyle={{ 
        background: '#ec4899', // розовый под твой градиент
        color: '#fff', 
        fontSize: '14px', 
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '10px 20px'
      }}
      
      // Стили кнопки отказа
      declineButtonStyle={{
        background: 'transparent',
        border: '1px solid #6b7280',
        color: '#6b7280',
        fontSize: '14px',
        borderRadius: '8px',
        padding: '10px 20px'
      }}
      
      // Контейнер баннера
      style={{ 
        background: 'rgba(15, 23, 42, 0.95)', // темный с прозрачностью
        backdropFilter: 'blur(8px)',
        boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)',
        padding: '10px 0',
        alignItems: 'center'
      }}
      expires={365}
    >
      <span className="text-sm md:text-base">
        Hi! I use cookies to analyze traffic and serve personalized ads to keep the blog running. 
        Check out my{' '}
        <a href="/privacy" className="underline hover:text-pink-400 transition-colors">
          Privacy Policy
        </a>{' '}
        for details.
      </span>
    </CookieConsent>
  )
}