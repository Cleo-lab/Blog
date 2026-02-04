// app/gallery/[id]/gallery-comments.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  author_id: string
  created_at: string
  profiles?: { username: string; avatar_url?: string }
}

export default function GalleryComments({ imageId }: { imageId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    fetchComments()
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user?.id || null)
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)')
      .eq('gallery_image_id', imageId)
      .order('created_at', { ascending: false })
    
    setComments(data || [])
    setLoading(false)
  }

  const submitComment = async () => {
    if (!newComment.trim() || !userId) return
    
    const { error } = await supabase.from('comments').insert({
      content: newComment.trim(),
      author_id: userId,
      gallery_image_id: imageId
    })
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      setNewComment('')
      fetchComments()
      toast({ title: 'Success', description: 'Comment added!' })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Comments ({comments.length})</h2>
      
      {userId ? (
        <div className="mb-8 space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <Button onClick={submitComment} disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      ) : (
        <div className="mb-8 p-6 bg-muted/30 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">
            <Link href="/login" className="text-pink-500 hover:underline">Sign in</Link> to leave a comment
          </p>
        </div>
      )}

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No comments yet</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{comment.profiles?.username || 'Anonymous'}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-foreground/80">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}