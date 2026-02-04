'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'  // ← Добавлен
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSupabase } from '@/hooks/use-supabase'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Sparkles } from 'lucide-react'

// УБРАНЫ ПРОПСЫ — больше не нужны!
export default function SignUp() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()
  const supabase = useSupabase()
  const router = useRouter()  // ← Добавлен

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Choose a cool username')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Make it stronger (at least 6 characters)')
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username: username.trim(),
            full_name: username.trim(),
          },
        },
      })

      if (signUpError) throw signUpError
      if (!data.user) throw new Error('Failed to create account')

      toast({
        title: 'Check your inbox! 📧',
        description: 'We sent a confirmation link to your email.',
      })

      // Редирект на login через 1.5 секунды
      setTimeout(() => {
        router.push('/login')
      }, 1500)

    } catch (err: any) {
      const message = err?.message || 'Something went wrong'
      setError(message)
      toast({
        title: 'Registration failed',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-b from-background via-pink-500/5 to-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-[2rem] border border-border/50 p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-12 h-12 text-pink-500" />
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-muted-foreground mt-2">Start your digital journey with us</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/70 ml-1 uppercase tracking-wider">Username</label>
              <Input
                placeholder="yurie_the_explorer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
                className="rounded-2xl border-border/50 bg-background/50 h-11 focus:ring-pink-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/70 ml-1 uppercase tracking-wider">Email</label>
              <Input
                type="email"
                placeholder="hello@world.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="rounded-2xl border-border/50 bg-background/50 h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 ml-1 uppercase tracking-wider">Password</label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="rounded-2xl border-border/50 bg-background/50 h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 ml-1 uppercase tracking-wider">Confirm</label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="rounded-2xl border-border/50 bg-background/50 h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold shadow-lg shadow-pink-500/20 mt-4 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </div>
              ) : 'Sign Up'}
            </Button>
          </form>

          {/* ИСПРАВЛЕННЫЙ БЛОК — Link вместо button */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-pink-500 hover:text-pink-400 font-bold transition-colors underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}