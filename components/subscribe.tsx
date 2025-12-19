'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SubscribeProps {
  language: string
}

const content = {
  en: {
    title: 'Join My Newsletter',
    description: 'Get the latest stories, art, and updates delivered to your inbox. No spam, just cozy content!',
    placeholder: 'Enter your email',
    button: 'Subscribe',
    success: 'Thank you for subscribing!',
    error: 'Failed to subscribe. Please try again.'
  },
  es: {
    title: 'Únete a mi Boletín',
    description: 'Obtén las últimas historias, arte y actualizaciones en tu bandeja de entrada. Sin spam, solo contenido acogedor.',
    placeholder: 'Ingresa tu correo',
    button: 'Suscribirse',
    success: 'Gracias por suscribirte!',
    error: 'Error al suscribirse. Intenta de nuevo.'
  }
}

export default function Subscribe({ language }: SubscribeProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const t = content[language as keyof typeof content] || content.en

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setSubmitted(true)
        setEmail('')
        setTimeout(() => setSubmitted(false), 4000)
      } else {
        setError(t.error)
      }
    } catch (err) {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-1 sm:py-4 px-4 bg-background">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t.title}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-8" />
        
        <p className="text-lg text-foreground/70 mb-8">
          {t.description}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder={t.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="flex-1 bg-card border-border/50"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
          >
            {loading ? 'Subscribing...' : t.button}
          </Button>
        </form>

        {submitted && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            {t.success}
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-destructive font-medium">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}



