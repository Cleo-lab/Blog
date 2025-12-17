// @/components/support-page.tsx
'use client'

// Убедитесь, что CryptoDonationBox импортирован правильно
import CryptoDonationBox from '@/components/crypto-donation-box'

export default function SupportPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-foreground">
          Support the Project
        </h1>
        <p className="text-center text-lg text-foreground/70 mb-10">
          Your crypto donation is crucial for maintaining and expanding this blog. Thank you for your generosity!
        </p>
        <CryptoDonationBox />
      </div>
    </div>
  )
}