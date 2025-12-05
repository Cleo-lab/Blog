'use client'

import { useState, useEffect } from 'react'
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      console.log('Fetching gallery images...')
      const supabase = useSupabase()
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
      
      console.log('Gallery fetch response:', { data, error })
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Setting images:', data)
      setImages(data || [])
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      toast({
        title: 'Error',
        description: 'Failed to load gallery images',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({ title: '', description: '', image: '' })
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id)
    setFormData({
      title: image.title,
      description: image.description,
      image: image.image
    })
  }

  const handleSave = async () => {
    console.log('handleSave called with formData:', formData)
    
    if (!formData.image.trim()) {
      console.log('Validation failed - missing image')
      toast({
        title: 'Error',
        description: 'Please upload an image',
        variant: 'destructive'
      })
      return
    }

    try {
      const imageData = {
        title: formData.title.trim() || 'Untitled',
        description: formData.description,
        image: formData.image
      }

      console.log('Saving image data to gallery table:', imageData)

      if (editingId) {
        // Update existing image
        console.log('Updating existing image:', editingId)
        const supabase = useSupabase()
        const { data, error } = await supabase
          .from('gallery')
          .update(imageData)
          .eq('id', editingId)
          .select()

        console.log('Update response:', { data, error })
        if (error) throw error
        
        toast({
          title: 'Success',
          description: 'Image updated successfully'
        })
      } else {
        // Create new image
        console.log('Creating new image')
        const supabase = useSupabase()
        const { data, error } = await supabase
          .from('gallery')
          .insert([imageData])
          .select()

        console.log('Insert response:', { data, error })
        if (error) throw error
        
        toast({
          title: 'Success',
          description: 'Image added successfully'
        })
      }
      
      setEditingId(null)
      setIsCreating(false)
      setFormData({ title: '', description: '', image: '' })
      console.log('Calling fetchGalleryImages...')
      await fetchGalleryImages()
    } catch (error: any) {
      console.error('Error saving image:', error)
      toast({
        title: 'Error',
        description: error?.message || 'Failed to save image',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const supabase = useSupabase()
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast({
        title: 'Success',
        description: 'Image deleted successfully'
      })
      fetchGalleryImages()
    } catch (error) {
      console.error('Error deleting image:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive'
      })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please upload an image file',
        variant: 'destructive'
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 5MB',
        variant: 'destructive'
      })
      return
    }

    setIsUploading(true)
    try {
      const publicUrl = await uploadGalleryImage(file)
      setFormData({ ...formData, image: publicUrl })
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      })
    } catch (error: any) {
      console.error('Error uploading file:', error)
      const errorMessage = error?.message || 'Failed to upload image'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
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
          <Button
            onClick={handleCreate}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        )}
      </div>

      {(isCreating || editingId) && (
        <Card className="border-border/50 bg-muted/30 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Image Upload</label>
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-foreground/40" />
                <p className="text-sm text-foreground/60">
                  {isUploading ? 'Uploading...' : 'Click to upload image'}
                </p>
              </label>
            </div>
            {formData.image && (
              <div className="mt-2 text-sm text-foreground/60 break-all">
                ✓ Image uploaded: {formData.image.split('/').pop()}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Image title (optional)"
              className="bg-background border-border/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Image description"
              className="bg-background border-border/50"
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isUploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Save Image
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-border/50"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {images.length === 0 ? (
        <div className="text-center py-12 text-foreground/60">
          <p>No images in gallery yet</p>
        </div>
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
                  <Button
                    onClick={() => handleEdit(image)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-border/50"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(image.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-border/50 text-destructive"
                  >
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
export async function uploadGalleryImage(file: File) {
  try {
    const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`
    const supabase = useSupabase()

    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })


    if (error) {
      console.error('Storage upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    if (!data?.path) {
      throw new Error('Upload succeeded but no file path returned')
    }

    const { data: url } = supabase.storage.from('gallery').getPublicUrl(data.path)
    
    if (!url?.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    return url.publicUrl
  } catch (error: any) {
    console.error('uploadGalleryImage error:', error)
    throw error
  }
}



