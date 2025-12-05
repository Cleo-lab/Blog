-- Maintenance Scripts for Supabase Blog
-- 
-- ACCESS CONTROL POLICIES:
-- 
-- AVATARS BUCKET:
--   - Read: Public (everyone can view)
--   - Upload: Authenticated users (can only upload to own folder)
--   - Delete: Own files only (auto-cleanup when new avatar uploaded)
--
-- GALLERY BUCKET:
--   - Read: Public (everyone can view images)
--   - Upload: Authenticated users (any logged-in user)
--   - Delete: Authenticated users (any logged-in user)
--
-- BLOG-IMAGES BUCKET:
--   - Read: Public (everyone can view article images)
--   - Upload: Admin only (only administrators)
--   - Delete: Admin only (only administrators, auto-cleanup on update)
--
-- DATABASE TABLES:
--   - blog_posts: Only admins can create/edit/delete
--   - gallery: Authenticated users can add/delete
--   - comments: Anyone can read, authenticated users can comment
--
-- ============================================
-- STORAGE BUCKET CREATION
-- ============================================
-- Run this if you haven't created the storage buckets yet

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('gallery', 'gallery', true, 10485760, '{"image/*"}'::text[]),
  ('avatars', 'avatars', true, 5242880, '{"image/*"}'::text[]),
  ('blog-images', 'blog-images', true, 10485760, '{"image/*"}'::text[])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE RLS POLICIES
-- ============================================

-- AVATARS BUCKET - Only authenticated users can upload/delete their own avatars
DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;
DROP POLICY IF EXISTS "Avatars authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Avatars authenticated delete" ON storage.objects;

CREATE POLICY "Avatars public read" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Avatars authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatars authenticated delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- GALLERY BUCKET - Public read, only authenticated can upload/delete
DROP POLICY IF EXISTS "Gallery public read" ON storage.objects;
DROP POLICY IF EXISTS "Gallery authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Gallery authenticated delete" ON storage.objects;

CREATE POLICY "Gallery public read" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Gallery authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Gallery authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- BLOG-IMAGES BUCKET - Public read, only authenticated can upload, only admins can delete
DROP POLICY IF EXISTS "Blog images public read" ON storage.objects;
DROP POLICY IF EXISTS "Blog images authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin delete" ON storage.objects;

CREATE POLICY "Blog images public read" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Blog images authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Blog images admin delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'blog-images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- DATA CLEANUP
-- ============================================

-- Delete draft blog posts
-- DELETE FROM blog_posts WHERE published = false;

-- Delete old comments (older than 1 year)
-- DELETE FROM comments WHERE created_at < NOW() - INTERVAL '1 year';

-- Delete unconfirmed newsletter subscribers
-- DELETE FROM newsletter_subscribers WHERE created_at < NOW() - INTERVAL '30 days';

-- ============================================
-- STORAGE CLEANUP (via Supabase Dashboard)
-- ============================================
-- NOTE: Storage cleanup must be done via Supabase Dashboard:
-- 1. Go to Storage section
-- 2. Open the bucket (avatars, gallery, or blog-images)
-- 3. Select files you want to delete
-- 4. Click Delete
-- 
-- The app automatically handles cleanup:
-- - Old avatars: Deleted when user uploads new avatar
-- - Old blog images: Deleted when admin updates featured image
-- - Gallery images: Must be manually deleted from admin panel

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Check all blog posts
-- SELECT id, title, published, created_at FROM blog_posts ORDER BY created_at DESC;

-- Check all gallery images
-- SELECT id, title, created_at FROM gallery ORDER BY created_at DESC;

-- Check all comments
-- SELECT id, content, author_id, created_at FROM comments ORDER BY created_at DESC;

-- Count comments by user
-- SELECT author_id, COUNT(*) as comment_count FROM comments GROUP BY author_id;

-- Check newsletter subscribers
-- SELECT email, subscribed, created_at FROM newsletter_subscribers ORDER BY created_at DESC;

-- Get admin users
-- SELECT id, username, is_admin FROM profiles WHERE is_admin = true;
