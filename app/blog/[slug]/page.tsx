'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
// !!! ВАЖНОЕ ИЗМЕНЕНИЕ: ДОБАВЛЕН useRouter !!!
import { useParams, useSearchParams, useRouter } from 'next/navigation' 
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { MessageCircle, X } from 'lucide-react'

/* ---------- TYPES ---------- */
interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  author_id: string
  published: boolean
  created_at: string
  updated_at: string
}

interface AuthorProfile {
  id: string
  username: string
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

/* ---------- COMPONENT ---------- */
export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { toast } = useToast()
  const supabase = useSupabase()
  
  // ИНИЦИАЛИЗАЦИЯ ДЛЯ ПЕРЕНАПРАВЛЕНИЯ
  const router = useRouter() 
  const searchParams = useSearchParams()
  const sourceUrl = searchParams.get('sourceUrl') // Получаем закодированный URL для возврата

  /* state */
  const [post, setPost] = useState<BlogPost | null>(null)
  const [author, setAuthor] = useState<AuthorProfile | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [commentContent, setCommentContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  /* обработчик кнопки Close */
  const handleClose = () => {
  if (sourceUrl) {
    // Просто переходим на декодированный URL
    router.push(decodeURIComponent(sourceUrl))
  } else {
    globalThis.history.back()
  }
}

  /* ---------- API ---------- */
  const fetchComments = useCallback(
    async (postSlug: string) => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            author_id,
            source_id,
            parent_id,
            created_at,
            is_read,
            author:profiles!author_id(id, username, avatar_url)
          `)
          .eq('source_type', 'blog')
          .eq('source_id', postSlug)
          .is('parent_id', null)
          .order('created_at', { ascending: false })

        if (error) throw error

        const withReplies = await Promise.all(
          (data || []).map(async (comment: any) => {
            const { data: replies, error: rErr } = await supabase
              .from('comments')
              .select(`
                id,
                content,
                author_id,
                source_id,
                parent_id,
                created_at,
                author:profiles!author_id(id, username, avatar_url)
              `)
              .eq('parent_id', comment.id)
              .order('created_at', { ascending: true })

            return { ...comment, replies: rErr ? [] : replies }
          })
        )
        setComments(withReplies)
      } catch (e: any) {
        console.error('fetchComments:', e)
      }
    },
    [supabase]
  )

  const fetchPost = useCallback(async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (postError) throw postError
      if (!postData.published) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || user.id !== postData.author_id) throw new Error('Post not found')
      }

      setPost(postData)

      const { data: authorData, error: authorError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', postData.author_id)
        .single()
      if (!authorError && authorData) setAuthor(authorData)

      await fetchComments(slug)
    } catch (err: any) {
      console.error('fetchPost:', err)
      toast({ title: 'Error', description: err?.message || 'Post not found', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [slug, supabase, toast, fetchComments])

  const init = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setCurrentUserId(user.id)
    await fetchPost()
  }, [supabase, fetchPost])

  useEffect(() => {
    init()
  }, [slug, init])

  /* помечаем ВСЕ комменты этого поста прочитанными */
  const markPostCommentsRead = useCallback(async () => {
    if (!post) return
    const { error } = await supabase
      .from('comments')
      .update({ is_read: true })
      .eq('source_type', 'blog')
      .eq('source_id', slug)
      .eq('is_read', false)
    if (error) console.warn('mark read:', error)
  }, [supabase, slug, post])

  /* вызываем после загрузки поста */
  useEffect(() => {
    if (post) markPostCommentsRead()
  }, [post, markPostCommentsRead])

  /* ---------- HANDLERS ---------- */
  const handleSubmitComment = async () => {
    if (!currentUserId) {
      toast({ title: 'Error', description: 'Please sign in to comment', variant: 'destructive' })
      return
    }
    if (!commentContent.trim()) {
      toast({ title: 'Error', description: 'Comment cannot be empty', variant: 'destructive' })
      return
    }
    if (!post) return

    setSubmittingComment(true)
    try {
      const { error } = await supabase.from('comments').insert([
        {
          content: commentContent.trim(),
          author_id: currentUserId,
          source_type: 'blog',
          source_id: slug,
          parent_id: replyingTo,
          is_read: false
        }
      ])
      if (error) throw error

      toast({ title: 'Success', description: 'Comment posted successfully' })
      setCommentContent('')
      setReplyingTo(null)
      await fetchComments(slug)
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to post comment', variant: 'destructive' })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId)
      if (error) throw error
      toast({ title: 'Success', description: 'Comment deleted successfully' })
      if (post) await fetchComments(slug)
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to delete comment', variant: 'destructive' })
    }
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    return Math.ceil(content.split(/\s+/).length / wordsPerMinute)
  }

  /* ---------- RENDER ---------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-foreground/60">Loading post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close article"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Close Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close article"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </button>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden bg-muted">
            <img src={post.featured_image} alt={post.title} className="w-full h-auto max-h-[600px] object-contain" />
          </div>
        )}

        {/* Post Header */}
        <article className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-border/50">
            <div className="flex items-center gap-4">
              {author && (
                <>
                  {author.avatar_url && (
                    <img src={author.avatar_url} alt={author.username} className="w-12 h-12 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{author.username}</p>
                    <p className="text-sm text-foreground/60">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="text-sm text-foreground/60">{calculateReadTime(post.content)} min read</div>
          </div>

          {/* Post Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <div className="text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="border-t border-border/50 pt-12">
          <h2 className="text-2xl font-bold mb-8">Comments ({comments.length})</h2>

          {/* Comment Form */}
          {currentUserId ? (
            <div className="mb-8 p-6 bg-muted/30 rounded-lg border border-border/50">
              <h3 className="font-semibold mb-4">{replyingTo ? 'Write a Reply' : 'Leave a Comment'}</h3>
              {replyingTo && (
                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="mb-4">
                  Cancel Reply
                </Button>
              )}
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={replyingTo ? 'Write your reply...' : 'Share your thoughts...'}
                className="bg-background border-border/50 mb-4"
                rows={4}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={submittingComment}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-muted/30 rounded-lg border border-border/50 text-center">
              <p className="text-foreground/60 mb-4">Sign in to leave a comment</p>
              <Link href="/auth/sign-in">
                <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-foreground/60 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id}>
                  {/* Main Comment */}
                  <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {comment.author?.avatar_url && (
                          <img src={comment.author.avatar_url} alt={comment.author.username} className="w-10 h-10 rounded-full object-cover" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{comment.author?.username || 'Anonymous'}</p>
                          <p className="text-xs text-foreground/60">
                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      {currentUserId === comment.author_id && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)} className="text-destructive hover:bg-destructive/10">
                          Delete
                        </Button>
                      )}
                    </div>
                    <p className="text-foreground mb-4 whitespace-pre-wrap">{comment.content}</p>
                    {currentUserId && (
                      <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment.id)} className="text-primary hover:bg-primary/10">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    )}
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 mt-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-4 bg-muted/10 rounded-lg border border-border/50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {reply.author?.avatar_url && (
                                <img src={reply.author.avatar_url} alt={reply.author.username} className="w-8 h-8 rounded-full object-cover" />
                              )}
                              <div>
                                <p className="font-semibold text-sm text-foreground">{reply.author?.username || 'Anonymous'}</p>
                                <p className="text-xs text-foreground/60">
                                  {new Date(reply.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            {currentUserId === reply.author_id && (
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(reply.id)} className="text-destructive hover:bg-destructive/10">
                                Delete
                              </Button>
                            )}
                          </div>
                          <p className="text-foreground text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}