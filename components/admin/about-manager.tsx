'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'

export default function AboutManager() {
  const [content, setContent] = useState(
    `Hi! I'm Yurie Jiyūbō, a cheerful and dreamy character living in the digital world. I've always had a passion for connecting with people, sharing stories, and exploring the beautiful intersection between anime culture and modern life.`
  )
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Edit About Section</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="about-content" className="block text-sm font-medium mb-2">
            About Content
          </label>
          <Textarea
            id="about-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-background border-border/50 min-h-80"
            placeholder="Enter your about section content..."
          />
          <p className="text-xs text-foreground/50 mt-2">
            This content appears on the About section of your blog
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {saved && (
          <div className="p-3 rounded-lg bg-green-100 text-green-800 text-sm">About section updated successfully!</div>
        )}
      </div>
    </div>
  )
}