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
  id: string; title: string; slug: string; content: string; excerpt: string;
  featured_image: string | null; author_id: string; published: boolean;
  created_at: string; updated_at: string;
}

interface AuthorProfile { id: string; username: string; avatar_url: string | null; }

interface Comment {
  id: string; content: string; author_id: string; source_id: string;
  parent_id: string | null; created_at: string; is_read?: boolean;
  author?: AuthorProfile; replies?: Comment[];
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
    if (sourceUrl) router.push(decodeURIComponent(sourceUrl))
    else globalThis.history.back()
  }

  const fetchComments = useCallback(async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`id, content, author_id, source_id, parent_id, created_at, is_read, author:profiles!author_id(id, username, avatar_url)`)
        .eq('source_type', 'blog').eq('source_id', postSlug).is('parent_id', null).order('created_at', { ascending: false })

      if (error) throw error

      const withReplies = await Promise.all((data || []).map(async (comment: any) => {
        const { data: replies } = await supabase
          .from('comments')
          .select(`id, content, author_id, source_id, parent_id, created_at, author:profiles!author_id(id, username, avatar_url)`)
          .eq('parent_id', comment.id).order('created_at', { ascending: true })
        return { ...comment, replies: replies || [] }
      }))
      setComments(withReplies)
    } catch (e) { console.error(e) }
  }, [supabase])

  const fetchPost = useCallback(async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('blog_posts').select('*').eq('slug', slug).single()
      if (postError) throw postError
      setPost(postData)

      const { data: authorData } = await supabase
        .from('profiles').select('id, username, avatar_url').eq('id', postData.author_id).single()
      if (authorData) setAuthor(authorData)

      await fetchComments(slug)
    } catch (err: any) {
      toast({ title: 'Error', description: 'Post not found', variant: 'destructive' })
    } finally { setLoading(false) }
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
      await supabase.from('comments').insert([{
        content: commentContent.trim(), author_id: currentUserId,
        source_type: 'blog', source_id: slug, parent_id: replyingTo, is_read: false
      }])
      setCommentContent(''); setReplyingTo(null); await fetchComments(slug)
    } finally { setSubmittingComment(false) }
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('comments').delete().eq('id', id)
    await fetchComments(slug)
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!post) return <div className="p-12 text-center">Post not found</div>

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-end mb-8">
          <Button variant="ghost" onClick={handleClose}><X className="w-4 h-4 mr-2" />Close</Button>
        </div>

        {post.featured_image && (
          <div className="mb-12 rounded-3xl overflow-hidden bg-muted shadow-xl">
            <img src={post.featured_image} alt={post.title} className="w-full h-auto max-h-[600px] object-contain" />
          </div>
        )}

        <article className="mb-12">
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
            {author?.avatar_url && <img src={author.avatar_url} className="w-12 h-12 rounded-full border border-pink-500/20" alt="" />}
            <div>
              <p className="font-semibold text-lg">{author?.username}</p>
              <p className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-pink prose-invert max-w-none">
            <ReactMarkdown
              components={{
                blockquote: ({ children }) => {
                  const collectText = (node: any): string => 
                    typeof node === 'string' ? node : Array.isArray(node) ? node.map(collectText).join('') : node?.props?.children ? collectText(node.props.children) : '';
                  const fullText = collectText(children);
                  const colorMatch = fullText.match(/\[(yellow|blue|purple|pink)\]/);
                  const color = colorMatch ? colorMatch[1] : 'pink';

                  const stripColorTag = (node: any): any => {
                    if (typeof node === 'string') return node.replace(/\[(yellow|blue|purple|pink)\]/g, '').trimStart();
                    if (Array.isArray(node)) return node.map(stripColorTag);
                    if (node?.props?.children) return { ...node, props: { ...node.props, children: stripColorTag(node.props.children) } };
                    return node;
                  };

                  const styleMap: any = {
                    yellow: 'bg-yellow-300/30 text-yellow-950 shadow-[0_0_40px_rgba(250,204,21,0.05)]',
                    blue: 'bg-blue-300/25 text-blue-950 shadow-[0_0_40px_rgba(59,130,246,0.05)]',
                    purple: 'bg-purple-300/25 text-purple-950 shadow-[0_0_40px_rgba(168,85,247,0.05)]',
                    pink: 'bg-pink-400/20 text-pink-950 shadow-[0_0_40px_rgba(236,72,153,0.05)]',
                  };

                  return (
                    <div className={`my-8 p-8 rounded-[2rem] italic relative transition-all duration-500 ${styleMap[color]}`}>
                      {/* Размер текста text-base соответствует стандартному prose */}
                      <div className="relative z-10 leading-relaxed text-base font-semibold">
                        {stripColorTag(children)}
                      </div>
                    </div>
                  );
                },
                img: ({ src, alt }) => {
                  const isBlur = alt?.includes('blur');
                  const scaleMatch = alt?.match(/scale-(\d+)/);
                  const width = scaleMatch ? scaleMatch[1] + '%' : '100%';
                  const cleanCaption = alt?.replace(/scale-\d+/g, '').replace(/blur/g, '').trim();
                  
                  return (
                    <span className="block my-12 text-center">
                      <img 
                        src={src} 
                        style={{ width, margin: '0 auto' }} 
                        className={`rounded-2xl shadow-2xl transition-all duration-700 ${isBlur ? 'blur-md hover:blur-none' : ''}`} 
                        alt="" 
                      />
                      {cleanCaption && (
                        <span className="block mt-4 text-sm text-muted-foreground italic font-medium">
                          {cleanCaption}
                        </span>
                      )}
                    </span>
                  );
                },
                code: ({ children }) => (
                  <code className="bg-[#e91e63] text-white px-2 py-0.5 rounded-md font-bold mx-1 italic shadow-sm antialiased whitespace-nowrap">
                    {children}
                  </code>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Секция комментариев */}
        <section className="border-t border-border/30 pt-12">
          <h2 className="text-2xl font-bold mb-8">Comments ({comments.length})</h2>
          {currentUserId ? (
            <div className="mb-10 p-6 bg-muted/20 rounded-2xl border border-border/50">
              {replyingTo && <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="mb-2 text-pink-500">Cancel Reply</Button>}
              <Textarea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Write a comment..." className="mb-4 bg-background border-border/40 focus:border-pink-500/50 transition-colors" />
              <Button onClick={handleSubmitComment} disabled={submittingComment} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold">
                {submittingComment ? 'Sending...' : 'Post Comment'}
              </Button>
            </div>
          ) : (
            <div className="mb-10 p-6 text-center border border-dashed border-border/50 rounded-2xl bg-muted/5">
              <Link href="/auth/sign-in"><Button variant="outline" className="border-pink-500/30 hover:bg-pink-500/10">Sign In to Comment</Button></Link>
            </div>
          )}

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <div className="p-5 bg-muted/10 rounded-2xl border border-border/30 hover:border-pink-500/20 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-bold text-pink-400">{comment.author?.username}</p>
                    {currentUserId === comment.author_id && <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)} className="text-destructive hover:bg-destructive/10">Delete</Button>}
                  </div>
                  <p className="text-foreground/90 mb-3 leading-relaxed">{comment.content}</p>
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment.id)} className="text-muted-foreground hover:text-pink-400"><MessageCircle className="w-4 h-4 mr-2" />Reply</Button>
                </div>
                {comment.replies?.map((reply) => (
                  <div key={reply.id} className="ml-10 p-4 bg-muted/5 rounded-xl border-l-2 border-pink-500/30 italic text-sm shadow-inner">
                    <p className="font-bold text-pink-300/70 mb-1">{reply.author?.username}</p>
                    <p className="text-foreground/80">{reply.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}