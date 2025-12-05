'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Trash2 } from 'lucide-react'

interface MyCommentsProps {
  setCurrentSection?: (section: string) => void
}

const userComments = [
  {
    id: 1,
    content: 'This is such a beautiful story! I loved reading about your creative journey.',
    postTitle: 'Digital Art Journey',
    date: '2025-01-15',
    type: 'blog'
  },
  {
    id: 2,
    content: 'Amazing artwork! The colors are so vibrant and the composition is perfect.',
    postTitle: 'Character Design Gallery',
    date: '2025-01-14',
    type: 'gallery'
  },
  {
    id: 3,
    content: 'I totally agree with your perspective on anime influence in modern culture.',
    postTitle: 'The Magic of Anime & Modern Life',
    date: '2025-01-12',
    type: 'blog'
  }
]

export default function MyComments({ setCurrentSection }: MyCommentsProps) {
  const handleDelete = (id: number) => {
    // Mock delete
    console.log('Deleting comment:', id)
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] py-12 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Comments
          </h1>
          <p className="text-foreground/60">Review and manage your comments</p>
        </div>

        {userComments.length > 0 ? (
          <div className="space-y-4">
            {userComments.map((comment) => (
              <Card key={comment.id} className="border-border/50 bg-card p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-primary/60 uppercase tracking-wide mb-1">
                      {comment.type === 'blog' ? 'Blog Post' : 'Gallery'} • {comment.date}
                    </p>
                    <p className="font-medium text-foreground">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      {comment.postTitle}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-foreground/40 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/50 mb-4">You haven't left any comments yet.</p>
            <Button
              onClick={() => setCurrentSection?.('blog')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Explore Posts
            </Button>
          </div>
        )}

        <div className="mt-8">
          <Button
            onClick={() => setCurrentSection?.('home')}
            variant="outline"
            className="border-border/50"
          >
            Back to Blog
          </Button>
        </div>
      </div>
    </section>
  )
}



