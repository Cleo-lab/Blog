'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

interface AuthorProfile {
  id: string
  username: string | null
  avatar_url: string | null
}

interface Comment {
  id: string
  content: string
  author_id: string
  source_id: string
  parent_id: string | null
  created_at: string
  is_read?: boolean
  author?: AuthorProfile
  replies?: Comment[]
}

interface CommentsSectionProps {
  postSlug: string
}

export default function CommentsSection({ postSlug }: CommentsSectionProps) {
  const supabase = useSupabase()
  const { toast } = useToast()
  
  const [comments, setComments] = useState<Comment[]>([])
  const [submittingComment, setSubmittingComment] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [commentContent, setCommentContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id, content, author_id, source_id, parent_id, created_at, is_read, 
          author:profiles!author_id(id, username, avatar_url)
        `)
        .eq('source_type', 'blog')
        .eq('source_id', postSlug)
        .is('parent_id', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      const withReplies = await Promise.all(
        (data || []).map(async (comment: any) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(`
              id, content, author_id, source_id, parent_id, created_at, 
              author:profiles!author_id(id, username, avatar_url)
            `)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true })
          return { ...comment, replies: replies || [] }
        })
      )

      setComments(withReplies)
    } catch (e) {
      console.error(e)
    }
  }, [supabase, postSlug])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)
      await fetchComments()
    }
    init()
  }, [fetchComments, supabase])

  const handleSubmitComment = async () => {
    if (!currentUserId || !commentContent.trim()) return
    setSubmittingComment(true)
    try {
      const { error } = await supabase.from('comments').insert([
        {
          content: commentContent.trim(),
          author_id: currentUserId,
          source_type: 'blog',
          source_id: postSlug,
          parent_id: replyingTo,
          is_read: false,
        },
      ])
      if (error) throw error
      
      setCommentContent('')
      setReplyingTo(null)
      await fetchComments()
      toast({ title: 'Success', description: 'Comment posted!' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to post comment', variant: 'destructive' })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    await supabase.from('comments').delete().eq('id', id)
    await fetchComments()
  }

  return (
    <section className="border-t border-border/30 pt-12">
      <h2 className="text-2xl font-bold mb-8">Comments ({comments.length})</h2>
      
      {currentUserId ? (
        <div className="mb-10 p-6 bg-muted/20 rounded-2xl border border-border/50">
          {replyingTo && (
            <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="mb-2 text-pink-500">
              Cancel Reply
            </Button>
          )}
          <Textarea 
            value={commentContent} 
            onChange={(e) => setCommentContent(e.target.value)} 
            placeholder="Write a comment..." 
            className="mb-4 bg-background border-border/40 focus:border-pink-500/50" 
          />
          <Button 
            onClick={handleSubmitComment} 
            disabled={submittingComment} 
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold"
          >
            {submittingComment ? 'Sending...' : 'Post Comment'}
          </Button>
        </div>
      ) : (
        <div className="mb-10 p-6 text-center border border-dashed border-border/50 rounded-2xl bg-muted/5">
          <Link href="/?action=signin">
            <Button variant="outline" className="border-pink-500/30 hover:bg-pink-500/10">
              Sign In to Comment
            </Button>
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            <div className="p-5 bg-muted/10 rounded-2xl border border-border/30 hover:border-pink-500/20 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <p className="font-bold text-pink-400">{comment.author?.username || 'User'}</p>
                {currentUserId === comment.author_id && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteComment(comment.id)} 
                    className="text-destructive hover:bg-destructive/10"
                  >
                    Delete
                  </Button>
                )}
              </div>
              <p className="text-foreground/90 mb-3 leading-relaxed">{comment.content}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setReplyingTo(comment.id)} 
                className="text-muted-foreground hover:text-pink-400"
              >
                <MessageCircle className="w-4 h-4 mr-2" />Reply
              </Button>
            </div>
            
            {comment.replies?.map((reply) => (
              <div key={reply.id} className="ml-10 p-4 bg-muted/5 rounded-xl border-l-2 border-pink-500/30 italic text-sm shadow-inner">
                <p className="font-bold text-pink-300/70 mb-1">{reply.author?.username || 'User'}</p>
                <p className="text-foreground/80">{reply.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}