'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useSupabase } from '@/hooks/use-supabase'
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/types/database.types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export default function BlogPostsManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [uploading, setUploading] = useState(false);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

  const [formData, setFormData] = useState<Omit<BlogPost, 'id' | 'author_id' | 'created_at' | 'updated_at'>>({
    title: '',
    slug: '',
    content: '',
    excerpt: null,
    featured_image: null,
    published: true,
  });

  /* ---------- AUTH ---------- */
  useEffect(() => {
    let cancelled = false;
    let timeoutId: NodeJS.Timeout;

    const init = async () => {
      try {
        const supabase = useSupabase();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!cancelled) {
          if (user) {
            setCurrentUserId(user.id);
          } else {
            setCurrentUserId(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth init error:', error);
        if (!cancelled) {
          setCurrentUserId(null);
          setLoading(false);
        }
      }
    };

    init();

    // Fallback timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (!cancelled && loading) {
        console.warn('Auth loading timeout, forcing complete');
        setLoading(false);
      }
    }, 5000);

    const supabase = useSupabase();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setCurrentUserId(session?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ---------- POSTS ---------- */
  useEffect(() => {
    if (!currentUserId) return;
    fetchPosts();
  }, [currentUserId]);

  const fetchPosts = async () => {
    if (!currentUserId) return;
    try {
      const supabase = useSupabase();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data ?? []);
    } catch (error: any) {
      console.error('Fetch posts error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to fetch posts', variant: 'destructive' });
    }
  };

  /* ---------- HANDLERS ---------- */
  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setSlugManuallyEdited(false);
    setUploading(false);
    const fileInput = document.getElementById('image-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: null,
      featured_image: null,
      published: true,
    });
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setIsCreating(false);
    setSlugManuallyEdited(true);
    setUploading(false);
    const fileInput = document.getElementById('image-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      published: post.published,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      const supabase = useSupabase();
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Post deleted' });
      fetchPosts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    if (!currentUserId) {
      toast({ title: 'Error', description: 'Not authenticated', variant: 'destructive' });
      return;
    }

    const titleTrimmed = formData.title.trim();
    const contentTrimmed = formData.content.trim();
    const excerptTrimmed = formData.excerpt?.trim() ?? null;
    const finalSlug = formData.slug?.trim() || slugify(titleTrimmed);

    if (!titleTrimmed || !contentTrimmed) {
      toast({ title: 'Error', description: 'Title and content required', variant: 'destructive' });
      return;
    }

    try {
      const supabase = useSupabase();
      if (editingId) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: titleTrimmed,
            slug: finalSlug,
            content: contentTrimmed,
            excerpt: excerptTrimmed,
            featured_image: formData.featured_image,
            published: formData.published,
          })
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Post updated' });
      } else {
        const { error } = await supabase.from('blog_posts').insert([
          {
            title: titleTrimmed,
            slug: finalSlug,
            content: contentTrimmed,
            excerpt: excerptTrimmed,
            featured_image: formData.featured_image,
            published: formData.published,
            author_id: currentUserId,
          },
        ]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Post created' });
      }

      fetchPosts();
      setUploading(false);
      const fileInput = document.getElementById('image-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      handleCancel();
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save post', variant: 'destructive' });
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setSlugManuallyEdited(false);
    setUploading(false);
    const fileInput = document.getElementById('image-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: null,
      featured_image: null,
      published: true,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, title: val }));
    if (!slugManuallyEdited) setFormData((prev) => ({ ...prev, slug: slugify(val) }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!currentUserId) {
      toast({ title: 'Error', description: 'Not authenticated. Please refresh the page.', variant: 'destructive' });
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please upload an image file', variant: 'destructive' });
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Image size must be less than 5MB', variant: 'destructive' });
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const supabase = useSupabase();
      const fileName = `${currentUserId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        if (uploadError.message?.includes('not found')) {
          throw new Error('Storage bucket not found. Please contact admin to set up blog-images bucket.');
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);

      if (!data?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      setFormData((prev) => ({ ...prev, featured_image: data.publicUrl }));
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error?.message || 'Failed to upload image';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  /* ---------- RENDER ---------- */
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts Manager</h1>
        <Button
          onClick={handleCreate}
          disabled={!currentUserId || loading}
          className="flex items-center gap-2"
          title={loading ? 'Loading...' : !currentUserId ? 'Not authenticated' : 'Create new post'}
        >
          <Plus className="w-4 h-4" />
          {loading ? 'Loading...' : 'Create New Post'}
        </Button>
      </div>

      {(isCreating || editingId) && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Post' : 'Create New Post'}</h2>
          <div className="space-y-4">
            <div>
              <label>Title</label>
              <Input value={formData.title} onChange={handleTitleChange} />
            </div>
            <div>
              <label>Slug</label>
              <Input value={formData.slug} onChange={handleSlugChange} />
            </div>
            <div>
              <label>Featured Image</label>
              <div className="flex items-center gap-4">
                {formData.featured_image && (
                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                    <img
                      src={formData.featured_image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="image-input"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Button
                    onClick={() => {
                      if (!currentUserId) {
                        toast({ title: 'Error', description: 'Not authenticated', variant: 'destructive' });
                        return;
                      }
                      document.getElementById('image-input')?.click();
                    }}
                    variant="outline"
                    disabled={uploading || !currentUserId}
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  {formData.featured_image && (
                    <Button
                      onClick={() => setFormData((p) => ({ ...p, featured_image: null }))}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label>Excerpt</label>
              <Textarea value={formData.excerpt ?? ''} onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))} />
            </div>
            <div>
              <label>Content</label>
              <Textarea value={formData.content} onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))} rows={10} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>{editingId ? 'Update Post' : 'Create Post'}</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span>Slug: {post.slug}</span>
                  <span>Status: {post.published ? 'Published' : 'Draft'}</span>
                  <span>Created: {post.created_at ? new Date(post.created_at).toLocaleDateString() : '—'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}



