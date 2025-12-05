import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface Recipient {
  email: string
  unsubscribe_token: string
}

interface SendNewsletterRequest {
  subject: string
  message: string
  recipients: Recipient[]
}

export async function POST(request: Request) {
  try {
    const { subject, message, recipients }: SendNewsletterRequest = await request.json()

    if (!subject || !message || !recipients || recipients.length === 0) {
      return Response.json(
        { error: 'Subject, message, and recipients array are required' },
        { status: 400 }
      )
    }

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const results = await Promise.all(
      recipients.map(({ email, unsubscribe_token }) => {
        const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${unsubscribe_token}`

        return resend.emails.send({
          from: 'Yurie Blog <onboarding@resend.dev>',
          to: email,
          subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f5e6ff 0%, #e6f5ff 100%);">
              <h1 style="color: #9f5fc9; text-align: center; margin-bottom: 30px;">Newsletter from Yurie</h1>
              
              <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0; margin-bottom: 20px;">${subject}</h2>
                <div style="color: #666; font-size: 16px; line-height: 1.8;">
                  ${message.split('\n').map((line) => `<p>${line}</p>`).join('')}
                </div>
              </div>
              
              <div style="text-align: center; border-top: 2px solid #f0f0f0; padding-top: 20px;">
                <p style="color: #999; font-size: 12px;">
                  No longer want these emails? <a href="${unsubscribeUrl}" style="color:#9f5fc9">Unsubscribe here</a>.
                </p>
                <p style="color: #999; font-size: 12px;">Made with love 💖</p>
              </div>
            </div>
          `
        })
      })
    )

    return Response.json({ success: true, sent: results.length, results })
  } catch (error) {
    console.error('Newsletter send error:', error)
    return Response.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}

