import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const emailRaw = searchParams.get('email')
    
    if (!emailRaw) {
      // Если email нет в ссылке, просто кидаем на главную
      return NextResponse.redirect(new URL('/', req.url))
    }

    const email = emailRaw.trim().toLowerCase()
    const supabase = await createServerSupabase()

    // 1. Удаляем из базы
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('email', email)

    if (error) {
      console.error('Unsubscribe DB error:', error)
      // В случае ошибки БД отправляем на главную с параметром ошибки
      return NextResponse.redirect(new URL('/?message=error', req.url))
    }

    // 2. ПЕРЕНАПРАВЛЯЕМ пользователя на главную страницу 
    // Добавляем параметр в URL, чтобы на фронтенде показать Toast или Modal
    return NextResponse.redirect(new URL('/?unsubscribed=true', req.url))
    
  } catch (err) {
    console.error('Unsubscribe server error:', err)
    return NextResponse.redirect(new URL('/', req.url))
  }
}