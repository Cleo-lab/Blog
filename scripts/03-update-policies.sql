-- ============================================
-- SQL SCRIPT: UPDATE EXISTING POLICIES
-- ============================================
-- Use this script if you already have policies 
-- and want to update them to the new security model.
--
-- WARNING: This will DROP and recreate all policies!
-- Make sure you have a backup first.
--
-- ============================================

-- DROP ALL OLD POLICIES FIRST
-- ============================================

-- Drop all policies from comments table (usually causes conflicts)
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Drop all policies from blog_posts table
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Only admins can insert posts" ON blog_posts;
DROP POLICY IF EXISTS "Only admins can update posts" ON blog_posts;
DROP POLICY IF EXISTS "Only admins can delete posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors and admins can update posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can insert posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can delete their own posts" ON blog_posts;

-- Drop all policies from gallery table
DROP POLICY IF EXISTS "Gallery images are viewable by everyone" ON gallery;
DROP POLICY IF EXISTS "Only authenticated users can insert gallery images" ON gallery;
DROP POLICY IF EXISTS "Only authenticated users can delete gallery images" ON gallery;
DROP POLICY IF EXISTS "Authenticated users can insert gallery images" ON gallery;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON gallery;

-- Drop all policies from profiles table
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Drop all policies from newsletter_subscribers table
DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Subscribers are private" ON newsletter_subscribers;

-- Drop all policies from about_content table
DROP POLICY IF EXISTS "About content is viewable by everyone" ON about_content;
DROP POLICY IF EXISTS "Only admins can update about content" ON about_content;

-- ============================================
-- CREATE NEW POLICIES (UPDATED)
-- ============================================

-- RLS Policies for profiles
-- Allow SELECT for authenticated users to read their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow SELECT for service role (for admin operations)
CREATE POLICY "Service role can view all profiles" ON profiles
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for blog posts
CREATE POLICY "Published posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (published = true OR auth.uid() = author_id);

CREATE POLICY "Only admins can insert posts" ON blog_posts
  FOR INSERT WITH CHECK (
    auth.uid() = author_id 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Only admins can update posts" ON blog_posts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Only admins can delete posts" ON blog_posts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- RLS Policies for gallery
CREATE POLICY "Gallery images are viewable by everyone" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert gallery images" ON gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete gallery images" ON gallery
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for newsletter
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Subscribers are private" ON newsletter_subscribers
  FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for about content
CREATE POLICY "About content is viewable by everyone" ON about_content
  FOR SELECT USING (true);

CREATE POLICY "Only admins can update about content" ON about_content
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
