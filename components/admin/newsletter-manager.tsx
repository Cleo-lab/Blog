'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Mail, Send, Trash2 } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  subscribedDate: string
}

const initialSubscribers: Subscriber[] = [
  { id: '1', email: 'fan1@example.com', subscribedDate: '2025-01-10' },
  { id: '2', email: 'fan2@example.com', subscribedDate: '2025-01-08' },
  { id: '3', email: 'fan3@example.com', subscribedDate: '2025-01-05' }
]

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
  const [isSending, setIsSending] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSendNewsletter = async () => {
    if (!subject || !message) return

    setIsSending(true)
    setError('')

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message,
          recipientEmails: subscribers.map((s) => s.email),
        }),
      })

      if (!res.ok) throw new Error('Failed to send newsletter')

      setSent(true)
      setSubject('')
      setMessage('')
      setTimeout(() => setSent(false), 3000)
    } catch (err: any) {
      setError(err?.message || 'Error sending newsletter')
    } finally {
      setIsSending(false)
    }
  }

  const handleUnsubscribe = (id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold mb-6">Newsletter Manager</h3>

      {/* Send Newsletter */}
      <Card className="border-border/50 bg-muted/30 p-6 space-y-4 mb-8">
        <h4 className="font-semibold flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Send Newsletter via Resend
        </h4>

        <div>
          <label htmlFor="newsletter-subject" className="block text-sm font-medium mb-2">
            Subject
          </label>
          <Input
            id="newsletter-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Newsletter subject"
            className="bg-background border-border/50"
          />
        </div>

        <div>
          <label htmlFor="newsletter-message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <Textarea
            id="newsletter-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your newsletter message..."
            className="bg-background border-border/50"
            rows={6}
          />
          <p className="text-xs text-foreground/50 mt-2">
            This will be sent to {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''} via Resend
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSendNewsletter}
            disabled={isSending || !subject || !message}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSending ? 'Sending...' : 'Send Newsletter'}
          </Button>
        </div>

        {sent && (
          <div className="p-3 rounded-lg bg-green-100 text-green-800 text-sm">
            Newsletter sent successfully to {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}!
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}
      </Card>

      {/* Subscribers List */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Subscribers ({subscribers.length})
        </h4>

        {subscribers.length > 0 ? (
          <div className="space-y-2">
            {subscribers.map((subscriber) => (
              <Card key={subscriber.id} className="border-border/50 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-medium text-foreground">{subscriber.email}</p>
                  <p className="text-xs text-foreground/50">Subscribed on {subscriber.subscribedDate}</p>
                </div>
                <Button
                  onClick={() => handleUnsubscribe(subscriber.id)}
                  size="sm"
                  variant="outline"
                  className="border-border/50 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-foreground/50">No subscribers yet</div>
        )}
      </div>
    </div>
  )
}