import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'
import { getSupabaseServer } from '@/lib/supabaseServer'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 })
    }

    /* 1. Генерируем токен и сохраняем подписчика */
    const token = randomBytes(16).toString('hex')

    const supabase = getSupabaseServer()
    const { error: dbError } = await supabase
      .from('subscribers')
      .insert({ email, unsubscribe_token: token })

    if (dbError) {
      // email уже есть, уникальное ограничение
      if (dbError.code === '23505') {
        return Response.json({ error: 'Already subscribed' }, { status: 409 })
      }
      throw dbError
    }

    /* 2. Формируем ссылку отписки */
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${token}`

    /* 3. Отправляем welcome-письмо */
    const { data, error: mailError } = await resend.emails.send({
      from: 'Yurie Blog <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to Yurie\'s Blog!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f5e6ff 0%, #e6f5ff 100%);">
          <h1 style="color: #9f5fc9; text-align: center; margin-bottom: 30px;">Welcome to My Blog!</h1>
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi there! I'm Yurie Jiyūbō, and I'm so happy you've decided to join my newsletter!
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              You'll be the first to know about:
            </p>
            <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 20px 0; padding-left: 20px;">
              <li>New blog posts and stories</li>
              <li>Gallery updates and new artwork</li>
              <li>Behind-the-scenes content</li>
              <li>Exclusive digital art tutorials</li>
              <li>Community highlights and features</li>
            </ul>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
              Thank you for supporting my creative journey. I hope my stories and art bring some magic to your day!
            </p>
            <div style="text-align: center; border-top: 2px solid #f0f0f0; padding-top: 20px;">
              <p style="color: #999; font-size: 12px;">Made with love 💖</p>
              <p style="color: #999; font-size: 12px;">
                <a href="${unsubscribeUrl}" style="color:#9f5fc9">Unsubscribe</a>
              </p>
            </div>
          </div>
        </div>
      `
    })

    if (mailError) throw mailError

    return Response.json({ success: true, data })
  } catch (err) {
    console.error('Newsletter subscription error:', err)
    return Response.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

