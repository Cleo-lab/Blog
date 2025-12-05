'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { X, Send } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'
import { useToast } from '@/hooks/use-toast'

interface GalleryImage {
  id: string
  title: string
  description: string
  image: string
}

interface Comment {
  id: string
  content: string
  author_id: string
  created_at: string
  parent_comment_id?: string | null
  profiles?: {
    username: string
  }
  replies?: Comment[]
}

interface GalleryModalProps {
  image: GalleryImage | null
  isOpen: boolean
  onClose: () => void
  isAuthenticated: boolean
}

export default function GalleryModal({
  image,
  isOpen,
  onClose,
  isAuthenticated
}: GalleryModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && image) {
      fetchComments()
    }
  }, [isOpen, image])

  const fetchComments = async () => {
    if (!image) return

    setLoading(true)
    try {
      const supabase = useSupabase()
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(username)')
        .eq('gallery_image_id', image.id)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Для каждого комментария загрузим replies
const commentsWithReplies = await Promise.all(
  (data || []).map(async (comment: Comment) => {  // ← Добавили тип
    const { data: replies } = await supabase
      .from('comments')
      .select('*, profiles(username)')
      .eq('parent_comment_id', comment.id)
      .order('created_at', { ascending: true })

    return {
      ...comment,
      replies: replies || []
    }
  })
)

      setComments(commentsWithReplies)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: 'Error',
        description: 'Please sign in to comment',
        variant: 'destructive'
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive'
      })
      return
    }

    if (!image) return

    setSubmitting(true)
    try {
      const supabase = useSupabase()
      const {
        data: { user }
      } = await supabase.auth.getUser()

      console.log('Current user:', user)
      console.log('User ID:', user?.id)

      if (!user) {
        throw new Error('Not authenticated')
      }

      // Проверить, существует ли профиль
      const { data: profileExists, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      console.log('Profile check:', { profileExists, profileCheckError })

      if (!profileExists && profileCheckError?.code === 'PGRST116') {
        throw new Error(
          `Your profile does not exist in the database. Please contact support. Your ID: ${user.id}`
        )
      }

      console.log('Submitting comment:', {
        content: newComment,
        author_id: user.id,
        gallery_image_id: image.id
      })

      const { error } = await supabase.from('comments').insert([
        {
          content: newComment,
          author_id: user.id,
          gallery_image_id: image.id
        }
      ])

      if (error) {
        console.error('Supabase error details:', error)
        throw error
      }

      toast({
        title: 'Success',
        description: 'Comment added successfully'
      })

      setNewComment('')
      await fetchComments()
    } catch (error: any) {
      console.error('Error submitting comment:', error)
      toast({
        title: 'Error',
        description: error?.message || 'Failed to add comment',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Error',
        description: 'Please sign in to reply',
        variant: 'destructive'
      })
      return
    }

    if (!replyText.trim()) {
      toast({
        title: 'Error',
        description: 'Reply cannot be empty',
        variant: 'destructive'
      })
      return
    }

    setSubmitting(true)
    try {
      const supabase = useSupabase()
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      const { error } = await supabase.from('comments').insert([
        {
          content: replyText,
          author_id: user.id,
          gallery_image_id: image?.id,
          parent_comment_id: parentCommentId
        }
      ])

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Reply added successfully'
      })

      setReplyText('')
      setReplyingTo(null)
      await fetchComments()
    } catch (error: any) {
      console.error('Error submitting reply:', error)
      toast({
        title: 'Error',
        description: error?.message || 'Failed to add reply',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!image) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">{image?.title}</DialogTitle>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground z-50 bg-background/80 backdrop-blur-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>


        <div className="space-y-6 p-6">
          {/* Image */}
          <div className="rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-foreground">{image.title}</h2>
            {image.description && (
              <div className="text-foreground/80 text-sm">{image.description}</div>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t border-border/50 pt-6 space-y-4">
            <h3 className="font-semibold text-foreground">Comments</h3>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-background border-border/50 flex-1"
                    disabled={submitting}
                  />
                  <Button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-sm text-foreground/60 bg-muted/30 p-3 rounded">
                Please sign in to comment
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loading ? (
                <p className="text-foreground/60 text-sm">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-foreground/60 text-sm">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    {/* Main Comment */}
                    <div className="bg-muted/30 p-3 rounded text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-foreground">
                          {comment.profiles?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-foreground/50">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground/80 mb-2">{comment.content}</p>
                      {isAuthenticated && (
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="text-xs text-primary hover:text-primary/80"
                        >
                          {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                        </button>
                      )}
                    </div>

                    {/* Reply Form */}
                    {isAuthenticated && replyingTo === comment.id && (
                      <div className="ml-6 flex gap-2">
                        <Input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="bg-background border-border/50 flex-1 text-sm"
                          disabled={submitting}
                        />
                        <Button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={submitting || !replyText.trim()}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-muted/50 p-2 rounded text-xs border-l-2 border-border/50">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-foreground">
                                {reply.profiles?.username || 'Anonymous'}
                              </span>
                              <span className="text-xs text-foreground/50">
                                {new Date(reply.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-foreground/80">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}



