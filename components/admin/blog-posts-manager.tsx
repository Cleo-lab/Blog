'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Edit2, Trash2, Plus, ImageIcon } from 'lucide-react' // Добавили ImageIcon
import { useSupabase } from '@/hooks/use-supabase'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/types/database.types'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

// --- ФУНКЦИЯ СЖАТИЯ ---
const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200; 
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = (MAX_WIDTH / width) * height;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob as Blob), 'image/webp', 0.8);
      };
    };
  });
};

export default function BlogPostsManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const { toast } = useToast()
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [uploading, setUploading] = useState(false)
  const supabase = useSupabase()

  const [formData, setFormData] = useState<Omit<BlogPost, 'id' | 'author_id' | 'created_at' | 'updated_at'>>({
    title: '',
    slug: '',
    content: '',
    excerpt: null,
    featured_image: null,
    published: true,
  })

  // --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ЗАГРУЗКИ ---
  const uploadAndGetUrl = async (file: File) => {
    if (!currentUserId) throw new Error('Not authenticated');
    const compressedBlob = await compressImage(file);
    const fileName = `${currentUserId}/${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, compressedBlob, { contentType: 'image/webp', upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const slugify = (text: string) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/g, '').replace(/-+$/g, '')

  const init = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id ?? null)
    } catch {
      setCurrentUserId(null)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => { init() }, [init])

  const fetchPosts = useCallback(async () => {
    if (!currentUserId) return
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (!error) setPosts(data ?? [])
  }, [currentUserId, supabase])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleSave = async () => {
    if (!currentUserId) return;
    try {
      const dataToSave = { ...formData, author_id: currentUserId };
      let error;
      if (editingId) {
        const { error: err } = await supabase.from('blog_posts').update(formData).eq('id', editingId);
        error = err;
      } else {
        const { error: err } = await supabase.from('blog_posts').insert([dataToSave]);
        error = err;
      }
      if (error) throw error;
      toast({ title: 'Success', description: 'Post saved' });
      setIsCreating(false); setEditingId(null); fetchPosts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id); setIsCreating(false); setSlugManuallyEdited(true);
    setFormData({ title: post.title, slug: post.slug, content: post.content, excerpt: post.excerpt, featured_image: post.featured_image, published: post.published });
  }

  const handleCancel = () => {
    setIsCreating(false); setEditingId(null);
    setFormData({ title: '', slug: '', content: '', excerpt: null, featured_image: null, published: true });
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts Manager</h1>
        <Button onClick={() => { setIsCreating(true); setEditingId(null); }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Post
        </Button>
      </div>

      {(isCreating || editingId) && (
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <Input placeholder="Title" value={formData.title} onChange={(e) => {
              setFormData(p => ({ ...p, title: e.target.value, slug: slugManuallyEdited ? p.slug : slugify(e.target.value) }))
            }} />
            
            <Input placeholder="Slug" value={formData.slug} onChange={(e) => {
              setSlugManuallyEdited(true); setFormData(p => ({ ...p, slug: e.target.value }))
            }} />

            {/* Загрузка главной картинки */}
            <div className="flex items-center gap-4 border p-4 rounded-lg">
              {formData.featured_image && <img src={formData.featured_image} className="w-20 h-20 object-cover rounded" />}
              <Button variant="outline" onClick={() => document.getElementById('main-img')?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Featured Image'}
              </Button>
              <input id="main-img" type="file" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                setUploading(true);
                try {
                  const url = await uploadAndGetUrl(file);
                  setFormData(p => ({ ...p, featured_image: url }));
                } catch (err: any) { toast({ title: 'Error', description: err.message, variant: 'destructive' }) }
                finally { setUploading(false) }
              }} />
            </div>

            {/* Контент с кнопкой добавления картинок внутрь */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Content (Markdown supported)</label>
                <Button size="sm" variant="secondary" onClick={() => document.getElementById('inline-img')?.click()} disabled={uploading}>
                  <ImageIcon className="w-4 h-4 mr-2" /> Add Image into Text
                </Button>
                <input
  id="inline-img"
  type="file"
  className="hidden"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAndGetUrl(file);
      /*  НОВЫЙ ФОРМАТ  */
      const imageMarkdown = `\n\n![Image caption {scale=100 blur=false}](${url})\n\n`;
      setFormData(p => ({ ...p, content: p.content + imageMarkdown }));
      toast({ title: 'Added', description: 'Edit caption and parameters' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      /* сбросить input, чтобы можно было выбрать тот же файл снова */
      e.currentTarget.value = '';
    }
  }}
/>
              </div>
              <Textarea rows={15} value={formData.content} onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))} />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Post</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Список постов */}
      <div className="grid gap-4">
        {posts.map(post => (
          <Card key={post.id} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-sm text-muted-foreground">{post.slug}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => handleEdit(post)}><Edit2 className="w-4 h-4" /></Button>
              <Button variant="ghost" className="text-red-500" onClick={async () => {
                if (confirm('Delete?')) { await supabase.from('blog_posts').delete().eq('id', post.id); fetchPosts(); }
              }}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}