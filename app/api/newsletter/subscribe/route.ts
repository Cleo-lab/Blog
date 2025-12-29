import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabaseServer'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rawEmail = body.email

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail))
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })

    const email = rawEmail.trim().toLowerCase()
    const supabase = createServiceSupabase()

    // 1. Сохраняем в базу
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])

    if (dbError) {
      if (dbError.code === '23505')
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
      console.error('DB insert error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // 2. Генерируем ссылку отписки (теперь внутри функции!)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yurieblog.vercel.app'
    const unsubscribeLink = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`

    // 3. Отправляем письмо
    const { error: mailError } = await resend.emails.send({
      from: 'Yurie Blog <onboarding@resend.dev>', 
      to: email,
      subject: 'Welcome to Yurie Blog 💖',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#fdf2f8;border-radius:24px;border:1px solid #fbcfe8">
          <h1 style="color:#d946ef;text-align:center;font-size:24px">Thank you for subscribing! ✨</h1>
          <p style="color:#374151;font-size:16px;line-height:1.6;text-align:center">
            You’ll receive cozy stories, anime vibes and digital dreams straight to your inbox.
          </p>
          
          <div style="text-align:center;margin:30px 0;">
             <a href="${baseUrl}" style="background:#d946ef;color:white;padding:12px 24px;border-radius:99px;text-decoration:none;font-weight:bold;display:inline-block;">Visit My Blog</a>
          </div>

          <hr style="border:none;border-top:1px solid #f9a8d4;margin:20px 0" />
          
          <p style="color:#9ca3af;font-size:12px;text-align:center">
            If you no longer wish to receive these emails, you can 
            <a href="${unsubscribeLink}" style="color:#ef4444;text-decoration:underline">unsubscribe here</a>.
          </p>
          <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:10px">Made with love by Yurie Jiyūbō 💖</p>
        </div>
      `,
    })

    if (mailError) {
      console.error('Mail error:', mailError)
    }

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 })

  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}