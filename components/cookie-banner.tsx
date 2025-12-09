'use client'  // ← обязательно

import CookieConsent from 'react-cookie-consent'

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="I understand"
      cookieName="mySiteCookieConsent"
      style={{ background: '#2B373B' }}
      buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
      expires={150}
    >
      This website uses cookies to enhance the user experience.{' '}
      <a href="/privacy" style={{ color: '#FFF', textDecoration: 'underline' }}>
        Learn more
      </a>
    </CookieConsent>
  )
}