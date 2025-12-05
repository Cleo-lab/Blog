import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'node:crypto'
import { createServerSupabase } from '@/lib/supabaseServer'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const supabase = await createServerSupabase() // ← await

    // 1. Добавляем подписчика
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.trim().toLowerCase(), token: randomBytes(32).toString('hex') }])

    if (dbError && dbError.code !== '23505') {
      console.error('DB insert error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // 2. Отправляем приветственное письмо
    const { error: mailError } = await resend.emails.send({
      from: 'Yurie Blog <hello@yurieblog.com>',
      to: email.trim(),
      subject: 'Welcome to Yurie Blog 💖',
      html: `<p>Thanks for subscribing! Stay tuned for cozy stories and anime vibes.</p>`
    })

    if (mailError) {
      console.error('Resend error:', mailError)
      return NextResponse.json({ error: 'Mail error' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Subscribed' }, { status: 200 })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}