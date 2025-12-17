'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, ExternalLink } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'

type Comment = {
  id: string
  author: string
  content: string
  source_type: 'blog' | 'gallery'
  source_id: string
  is_read: boolean
  created_at: string
}

export default function CommentsManager() {
  const supabase = useSupabase()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true) // <--- ВОССТАНОВЛЕНО/ПРОВЕРЕНО!

  /* !!! ВАШ БАЗОВЫЙ АДРЕС - КОРЕНЬ: / !!! */
  const ADMIN_PANEL_ROUTE = '/' 
  
  /* загрузка + пометка прочитанным при монтировании таба */
  useEffect(() => {
    fetchComments()
    markAsRead()
  }, [])

  const fetchComments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .is('parent_id', null)          // топ-уровень
      .order('created_at', { ascending: false })

    if (!error) setComments(data ?? [])
    setLoading(false)
  }

  const markAsRead = async () =>
    await supabase.from('comments').update({ is_read: true }).eq('is_read', false)

  const deleteComment = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id)
    setComments((c) => c.filter((x) => x.id !== id))
  }

  /* ссылка, куда вести */
  const buildLink = (c: Comment) =>
    c.source_type === 'blog'
      ? `/blog/${c.source_id}`
      : `/gallery/${c.source_id}`

  /* Функция для создания ссылки с параметром возврата */
  const createAdminLink = (c: Comment) => {
    // Кодируем полный URL, куда нужно вернуться: /?tab=comments
    const sourceUrl = encodeURIComponent(`${ADMIN_PANEL_ROUTE}?tab=comments`)
    return `${buildLink(c)}?sourceUrl=${sourceUrl}`
  }

  if (loading) return <p className="text-sm text-foreground/60">Loading comments…</p>

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Manage Comments</h3>

      {comments.length === 0 ? (
        <p className="text-sm text-foreground/50">No comments yet</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <Card key={c.id} className="border-border/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary-foreground">
                      {c.source_type}
                    </span>
                    <span className="text-xs text-foreground/60">
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground">{c.author}</p>
                  <p className="text-sm text-foreground/80 mt-1">{c.content}</p>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={createAdminLink(c)} // <--- Используем новый, закодированный URL
                  >
                    <Button size="icon" variant="outline" className="border-border/50">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-border/50 text-destructive"
                    onClick={() => deleteComment(c.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}