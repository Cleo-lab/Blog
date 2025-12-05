'use client'
import type { Database } from '@/types/database.types'
import { useSupabase } from '@/hooks/use-supabase'
import { createServerSupabase } from './supabaseServer'

export type Post = Database['public']['Tables']['blog_posts']['Row']
export type PostInsert = Database['public']['Tables']['blog_posts']['Insert']
export type PostUpdate = Database['public']['Tables']['blog_posts']['Update']

// Server: get posts list (for server components, avoids extra round-trips)
export const getPostsServer = async (limit = 20) => {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, content, excerpt, featured_image, author_id, created_at, updated_at, published, slug, author:profiles(id, username, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// Server: get single post by slug
export const getPostBySlugServer = async (slug: string) => {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, content, excerpt, featured_image, author_id, created_at, updated_at, published, slug, author:profiles(id, username, avatar_url)')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

// Client: create post (authenticated user)
export const createPostClient = async (payload: PostInsert) => {
  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ ...payload, author_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Client: update post
export const updatePostClient = async (id: string, payload: PostUpdate) => {
  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('blog_posts')
    .update(payload)
    .eq('id', id)
    .eq('author_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Client: delete post
export const deletePostClient = async (id: string) => {
  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
    .eq('author_id', userId)

  if (error) throw error
}
