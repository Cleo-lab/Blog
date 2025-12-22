'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import { useParams, useSearchParams, useRouter } from 'next/navigation' 
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { MessageCircle, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

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

export default function BlogPostClient() {
  const params = useParams()
  const slug = params.slug as string
  const { toast } = useToast()
  const supabase = useSupabase()
  const router = useRouter() 
  const searchParams = useSearchParams()
  const sourceUrl = searchParams.get('sourceUrl')

  const [post, setPost] = useState<BlogPost | null>(null)
  const [author, setAuthor] = useState<AuthorProfile | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [commentContent, setCommentContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleClose = () => {
    if (sourceUrl) {
      router.push(decodeURIComponent(sourceUrl))
    } else {
      globalThis.history.back()
    }
  }

  const fetchComments = useCallback(async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`id, content, author_id, source_id, parent_id, created_at, is_read, author:profiles!author_id(id, username, avatar_url)`)
        .eq('source_type', 'blog')
        .eq('source_id', postSlug)
        .is('parent_id', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      const withReplies = await Promise.all(
        (data || []).map(async (comment: any) => {
          const { data: replies, error: rErr } = await supabase
            .from('comments')
            .select(`id, content, author_id, source_id, parent_id, created_at, author:profiles!author_id(id, username, avatar_url)`)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true })
          return { ...comment, replies: rErr ? [] : replies }
        })
      )
      setComments(withReplies)
    } catch (e) { console.error(e) }
  }, [supabase])

  const fetchPost = useCallback(async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (postError) throw postError
      setPost(postData)

      const { data: authorData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', postData.author_id)
        .single()
      if (authorData) setAuthor(authorData)

      await fetchComments(slug)
    } catch (err: any) {
      toast({ title: 'Error', description: 'Post not found', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [slug, supabase, toast, fetchComments])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)
      await fetchPost()
    }
    init()
  }, [slug, supabase, fetchPost])

  const handleSubmitComment = async () => {
    if (!currentUserId || !commentContent.trim() || !post) return
    setSubmittingComment(true)
    try {
      const { error } = await supabase.from('comments').insert([{
        content: commentContent.trim(),
        author_id: currentUserId,
        source_type: 'blog',
        source_id: slug,
        parent_id: replyingTo
      }])
      if (error) throw error
      setCommentContent('')
      setReplyingTo(null)
      await fetchComments(slug)
    } finally { setSubmittingComment(false) }
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('comments').delete().eq('id', id)
    await fetchComments(slug)
  }

  /* ---------- SEO & RENDER LOGIC ---------- */
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!post) return <div className="p-12 text-center">Post not found</div>

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 155).replace(/[#*`]/g, ''),
    image: post.featured_image || 'https://yurieblog.vercel.app/og-image.jpg',
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: author?.username || 'Yurie', url: 'https://yurieblog.vercel.app' },
    publisher: {
      '@type': 'Organization',
      name: "Yurie's Blog",
      logo: { '@type': 'ImageObject', url: 'https://yurieblog.vercel.app/logo.png' }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://yurieblog.vercel.app/blog/${post.slug}` },
    wordCount: post.content.split(/\s+/).length,
    commentCount: comments.length,
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-end mb-8">
          <Button variant="ghost" onClick={handleClose}><X className="w-4 h-4 mr-2" />Close</Button>
        </div>

        {post.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden bg-muted">
            <img src={post.featured_image} alt={post.title} className="w-full h-auto max-h-[600px] object-contain" />
          </div>
        )}

        <article className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
            {author?.avatar_url && <img src={author.avatar_url} className="w-12 h-12 rounded-full" alt="" />}
            <div>
              <p className="font-semibold">{author?.username}</p>
              <p className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-pink prose-invert max-w-none mb-12">
            <ReactMarkdown
              components={{
                blockquote: ({ children }) => {
                  const collectText = (node: any): string => 
                    typeof node === 'string' ? node : Array.isArray(node) ? node.map(collectText).join('') : node?.props?.children ? collectText(node.props.children) : '';
                  const fullText = collectText(children);
                  const colorMatch = fullText.match(/\[(yellow|blue|purple|pink)\]/);
                  const color = colorMatch ? colorMatch[1] : 'pink';
                  const styleMap: any = {
                    yellow: 'bg-yellow-400/20 text-yellow-900/90',
                    blue: 'bg-blue-400/20 text-blue-900/90',
                    purple: 'bg-purple-400/20 text-purple-900/90',
                    pink: 'bg-pink-500/10 text-pink-900/90',
                  };
                  return <div className={`my-8 p-8 rounded-[2.5rem] italic transition-all ${styleMap[color]}`}>{children}</div>
                },
                code: ({ children }) => <code className="bg-pink-600 text-white px-2 py-0.5 rounded-md mx-1 italic">{children}</code>,
                img: ({ src, alt }) => {
                  const isBlur = alt?.includes('blur');
                  const scaleMatch = alt?.match(/scale-(\d+)/);
                  const width = scaleMatch ? scaleMatch[1] + '%' : '100%';
                  return (
                    <span className="block my-12 text-center">
                      <img src={src} style={{ width, margin: '0 auto' }} className={`rounded-2xl shadow-2xl ${isBlur ? 'blur-sm hover:blur-none' : ''}`} alt="" />
                    </span>
                  )
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <section className="border-t border-border/50 pt-12">
          <h2 className="text-2xl font-bold mb-8">Comments ({comments.length})</h2>
          {currentUserId ? (
            <div className="mb-8 p-6 bg-muted/30 rounded-lg">
              <Textarea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Share your thoughts..." className="mb-4" />
              <Button onClick={handleSubmitComment} disabled={submittingComment} className="w-full">
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          ) : (
            <div className="mb-8 p-6 text-center border rounded-lg">
              <Link href="/auth/sign-in"><Button>Sign In to Comment</Button></Link>
            </div>
          )}
          
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-muted/20 rounded-lg border">
                <div className="flex justify-between mb-3">
                  <p className="font-semibold">{comment.author?.username}</p>
                  {currentUserId === comment.author_id && <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>Delete</Button>}
                </div>
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}