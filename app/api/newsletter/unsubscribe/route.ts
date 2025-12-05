import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const emailRaw = searchParams.get('email')
    if (!emailRaw) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const email = emailRaw.trim().toLowerCase()
    const supabase = await createServerSupabase() // ← await

    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('email', email)

    if (error) {
      console.error('Unsubscribe DB error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Unsubscribed successfully' }, { status: 200 })
  } catch (err) {
    console.error('Unsubscribe error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}