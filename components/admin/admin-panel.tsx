'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BlogPostsManager from './blog-posts-manager'
import GalleryManager from './gallery-manager'
import CommentsManager from './comments-manager'
import NewsletterManager from './newsletter-manager'
import AboutManager from './about-manager'
import { ArrowLeft } from 'lucide-react'

interface AdminPanelProps {
  setCurrentSection?: (section: string) => void
}

export default function AdminPanel({ setCurrentSection }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('blog')

  return (
    <section className="min-h-[calc(100vh-4rem)] py-8 px-4 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Blog Management
            </h1>
            <p className="text-foreground/60">Manage all aspects of your blog</p>
          </div>
          <Button
            onClick={() => setCurrentSection?.('home')}
            variant="outline"
            className="border-border/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b border-border/50 bg-muted/30 rounded-none p-0 h-auto">
              <TabsTrigger 
                value="blog" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Blog Posts
              </TabsTrigger>
              <TabsTrigger 
                value="about" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                About
              </TabsTrigger>
              <TabsTrigger 
                value="gallery" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Gallery
              </TabsTrigger>
              <TabsTrigger 
                value="comments" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Comments
              </TabsTrigger>
              <TabsTrigger 
                value="newsletter" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Newsletter
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="blog" className="m-0">
                <BlogPostsManager />
              </TabsContent>
              <TabsContent value="about" className="m-0">
                <AboutManager />
              </TabsContent>
              <TabsContent value="gallery" className="m-0">
                <GalleryManager />
              </TabsContent>
              <TabsContent value="comments" className="m-0">
                <CommentsManager />
              </TabsContent>
              <TabsContent value="newsletter" className="m-0">
                <NewsletterManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  )
}



