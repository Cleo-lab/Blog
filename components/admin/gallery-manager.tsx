'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Edit2, Trash2, Plus, Upload } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'
import { useToast } from '@/hooks/use-toast'

interface GalleryImage {
  id: string
  title: string
  description: string | null
  image: string
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const supabase = useSupabase()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: ''
  })

  const fetchGalleryImages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to load gallery images', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchGalleryImages()
  }, [fetchGalleryImages])

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({ title: '', description: '', image: '' })
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id)
    setFormData({
      title: image.title,
      description: image.description ?? '',
      image: image.image
    })
  }

  const handleSave = async () => {
    if (!formData.image.trim()) {
      toast({ title: 'Error', description: 'Please upload an image', variant: 'destructive' })
      return
    }

    try {
      const imageData = {
        title: formData.title.trim() || 'Untitled',
        description: formData.description.trim() || null,
        image: formData.image
      }

      if (editingId) {
        const { error } = await supabase
          .from('gallery')
          .update(imageData)
          .eq('id', editingId)
        if (error) throw error
        toast({ title: 'Success', description: 'Image updated successfully' })
      } else {
        const { error } = await supabase.from('gallery').insert([imageData])
        if (error) throw error
        toast({ title: 'Success', description: 'Image added successfully' })
      }

      setEditingId(null)
      setIsCreating(false)
      setFormData({ title: '', description: '', image: '' })
      await fetchGalleryImages()
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to save image', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) throw error
      toast({ title: 'Success', description: 'Image deleted successfully' })
      fetchGalleryImages()
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to delete image', variant: 'destructive' })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please upload an image file', variant: 'destructive' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Image size must be less than 5MB', variant: 'destructive' })
      return
    }

    setIsUploading(true)
    try {
      const publicUrl = await uploadGalleryImage(file)
      setFormData({ ...formData, image: publicUrl })
      toast({ title: 'Success', description: 'Image uploaded successfully' })
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to upload image', variant: 'destructive' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ title: '', description: '', image: '' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-foreground/60">Loading gallery...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Manage Gallery</h3>
        {!isCreating && !editingId && (
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        )}
      </div>

      {(isCreating || editingId) && (
        <Card className="border-border/50 bg-muted/30 p-6 space-y-4">
          <div>
            <label htmlFor="gallery-image-input" className="block text-sm font-medium mb-2">Image Upload</label>
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="gallery-image-input"
              />
              <label htmlFor="gallery-image-input" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-foreground/40" />
                <p className="text-sm text-foreground/60">{isUploading ? 'Uploading...' : 'Click to upload image'}</p>
              </label>
            </div>
            {formData.image && (
              <div className="mt-2 text-sm text-foreground/60 break-all">✓ Image uploaded: {formData.image.split('/').pop()}</div>
            )}
          </div>
          <div>
            <label htmlFor="gallery-title" className="block text-sm font-medium mb-2">Title</label>
            <Input
              id="gallery-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Image title (optional)"
              className="bg-background border-border/50"
            />
          </div>
          <div>
            <label htmlFor="gallery-description" className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              id="gallery-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Image description"
              className="bg-background border-border/50"
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isUploading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save Image
            </Button>
            <Button onClick={handleCancel} variant="outline" className="border-border/50">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {images.length === 0 ? (
        <div className="text-center py-12 text-foreground/60">No images in gallery yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="border-border/50 overflow-hidden">
              <div className="h-48 bg-muted flex items-center justify-center">
                {image.image ? (
                  <img src={image.image} alt={image.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-foreground/40">No image</div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">{image.title}</h4>
                  <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{image.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(image)} size="sm" variant="outline" className="flex-1 border-border/50">
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(image.id)} size="sm" variant="outline" className="flex-1 border-border/50 text-destructive">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- helper ---------- */
export async function uploadGalleryImage(file: File) {
  const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`

  const sb = useSupabase()
  const { data, error } = await sb.storage
    .from('gallery')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw new Error(`Upload failed: ${error.message}`)
  if (!data?.path) throw new Error('No file path returned')

  const { data: url } = sb.storage.from('gallery').getPublicUrl(data.path)
  if (!url?.publicUrl) throw new Error('Failed to get public URL')

  return url.publicUrl
}