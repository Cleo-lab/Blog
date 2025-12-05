import { NextRequest } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return new Response('Missing token', { status: 400 });
  }

  const supabase = getSupabaseServer()
  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('unsubscribe_token', token);

  if (error) {
    return new Response('Invalid or expired link', { status: 400 });
  }

  // Простая страница «Вы отписаны»
  return new Response(
    `<html><body style="font-family:sans-serif;text-align:center;margin-top:40px">
       <h2>✅ You’ve been unsubscribed</h2>
       <p>Sorry to see you go. You can subscribe again anytime.</p>
     </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

