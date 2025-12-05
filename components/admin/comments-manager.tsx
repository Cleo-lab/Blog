'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Trash2, MessageCircle, Send } from 'lucide-react'

interface Comment {
  id: string
  author: string
  content: string
  post: string
  replies: Comment[]
}

const initialComments: Comment[] = [
  {
    id: '1',
    author: 'User123',
    content: 'This is such a beautiful story! I loved reading about it.',
    post: 'Digital Art Journey',
    replies: []
  },
  {
    id: '2',
    author: 'ArtFan',
    content: 'Amazing artwork! The colors are so vibrant.',
    post: 'Character Design Gallery',
    replies: []
  }
]

export default function CommentsManager() {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleDelete = (id: string) => {
    setComments(comments.filter(c => c.id !== id))
  }

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      setComments(comments.map(c => 
        c.id === commentId 
          ? {
              ...c,
              replies: [...c.replies, {
                id: Date.now().toString(),
                author: 'Admin',
                content: replyContent,
                post: c.post,
                replies: []
              }]
            }
          : c
      ))
      setReplyContent('')
      setReplyingTo(null)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Manage Comments</h3>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="border-border/50 p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                      {comment.author[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{comment.author}</p>
                      <p className="text-xs text-foreground/50">on {comment.post}</p>
                    </div>
                  </div>
                  <p className="text-foreground/70 mb-4">{comment.content}</p>
                </div>
                <Button
                  onClick={() => handleDelete(comment.id)}
                  size="sm"
                  variant="outline"
                  className="border-border/50 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-8 space-y-3 pt-3 border-t border-border/30">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {reply.author[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground">{reply.author}</p>
                        <p className="text-sm text-foreground/70">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === comment.id ? (
                <div className="space-y-3 pt-3 border-t border-border/30">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="bg-background border-border/50"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReply(comment.id)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Send Reply
                    </Button>
                    <Button
                      onClick={() => setReplyingTo(null)}
                      size="sm"
                      variant="outline"
                      className="border-border/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setReplyingTo(comment.id)}
                  size="sm"
                  variant="outline"
                  className="border-border/50"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-foreground/50">
          No comments yet
        </div>
      )}
    </div>
  )
}



