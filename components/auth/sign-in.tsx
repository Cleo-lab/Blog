'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSupabase } from '@/hooks/use-supabase'

interface SignInProps {
  readonly onSignIn?: (email: string) => void
  readonly onSwitchToSignUp?: () => void
  readonly setCurrentSection?: (section: string) => void
}

export default function SignIn({ onSignIn, onSwitchToSignUp, setCurrentSection }: SignInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: sbErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (sbErr) throw sbErr
      if (!data.user) throw new Error('User not found')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, username')
        .eq('id', data.user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        const username = data.user.email?.split('@')[0] || `user_${Date.now()}`
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: username,
          is_admin: false,
        })
      }

      onSignIn?.(data.user.email ?? '')
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCurrentSection?.('home')
    } catch (err: any) {
      console.error('Sign in error:', err)

      let errorMessage = 'Invalid email or password'
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Wrong email or password'
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Please confirm your email first'
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-foreground/60 mb-8">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="block text-sm font-medium mb-2 text-foreground">
                Email
              </label>
              <Input
                id="signin-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-background border-border/50"
              />
            </div>

            <div>
              <label htmlFor="signin-password" className="block text-sm font-medium mb-2 text-foreground">
                Password
              </label>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-background border-border/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-sm text-foreground/60 text-center">
              Don&apos;t have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-primary hover:text-primary/80 font-medium"
                type="button"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}