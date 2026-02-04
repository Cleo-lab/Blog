'use client'

import { useState } from 'react'
import Link from 'next/link'  // ← Добавлен Link
import { useRouter } from 'next/navigation'  // ← Добавлен router
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSupabase } from '@/hooks/use-supabase'
import { useToast } from '@/hooks/use-toast'

// УБРАНЫ ПРОПСЫ — больше не нужны!
export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = useSupabase()
  const { toast } = useToast()
  const router = useRouter()  // ← Добавлен

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: sbErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (sbErr) throw sbErr

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single()

      toast({
        title: "Success",
        description: "Entering the system...",
      })

      // Редирект через router (чистее чем window.location)
      if (profile?.is_admin) {
        router.push('/admin')
      } else {
        router.push('/dashboard')  // или '/' если нужно на главную
      }

    } catch (err: any) {
      setError(err.message || 'Invalid login credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-[2rem] border border-border/50 p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to manage your experiments</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="yurie@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="rounded-2xl border-border/50 bg-background/50 h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="rounded-2xl border-border/50 bg-background/50 h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold shadow-lg"
              disabled={loading}
            >
              {loading ? 'Entering...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              New to the chaos?{' '}
              {/* ЗАМЕНЕНО: button с onClick → Link */}
              <Link 
                href="/signup"
                className="text-pink-500 hover:text-pink-400 font-bold transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}