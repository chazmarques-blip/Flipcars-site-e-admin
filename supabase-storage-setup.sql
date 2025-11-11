-- ============================================================
-- FLIPCARS - SUPABASE STORAGE SETUP
-- ============================================================
-- Description: Complete setup for lead photos storage bucket
-- Date: 2025-11-11
-- Author: AI Assistant
-- ============================================================

-- ============================================================
-- STEP 1: CREATE STORAGE BUCKET
-- ============================================================
-- This creates the 'lead-photos' bucket for storing estimate photos
-- Public bucket = photos accessible via public URL

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lead-photos',
  'lead-photos',
  true,  -- Public bucket (photos accessible via URL)
  5242880,  -- 5MB file size limit (5 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- ============================================================
-- STEP 2: CREATE RLS POLICIES FOR PUBLIC ACCESS
-- ============================================================
-- Allow public upload (anyone can upload photos during estimate form)
-- Allow public read (anyone can view uploaded photos)

-- Policy 1: Allow public uploads
CREATE POLICY "Public can upload lead photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'lead-photos'
);

-- Policy 2: Allow public reads
CREATE POLICY "Public can view lead photos"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'lead-photos'
);

-- Policy 3: Allow authenticated users to update (for future admin features)
CREATE POLICY "Authenticated users can update lead photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'lead-photos'
)
WITH CHECK (
  bucket_id = 'lead-photos'
);

-- Policy 4: Allow authenticated users to delete (admin cleanup)
CREATE POLICY "Authenticated users can delete lead photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'lead-photos'
);

-- ============================================================
-- STEP 3: VERIFICATION QUERIES
-- ============================================================
-- Run these to verify the setup was successful

-- Check if bucket was created
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'lead-photos';

-- Check if policies were created
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname LIKE '%lead photos%';

-- ============================================================
-- CLEANUP (OPTIONAL - USE ONLY IF YOU NEED TO START OVER)
-- ============================================================
-- CAUTION: This will delete the bucket and all photos inside it!
-- Uncomment and run only if you need to reset

-- -- Drop all policies first
-- DROP POLICY IF EXISTS "Public can upload lead photos" ON storage.objects;
-- DROP POLICY IF EXISTS "Public can view lead photos" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can update lead photos" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can delete lead photos" ON storage.objects;

-- -- Delete all files in bucket (optional - be careful!)
-- -- DELETE FROM storage.objects WHERE bucket_id = 'lead-photos';

-- -- Delete the bucket
-- -- DELETE FROM storage.buckets WHERE id = 'lead-photos';

-- ============================================================
-- EXPECTED RESULTS
-- ============================================================
-- After running this script successfully, you should see:
--
-- 1. Bucket 'lead-photos' created with:
--    - Public: true
--    - File size limit: 5MB
--    - Allowed types: JPEG, PNG, GIF, WEBP
--
-- 2. Four RLS policies created:
--    - Public can upload lead photos (INSERT)
--    - Public can view lead photos (SELECT)
--    - Authenticated users can update lead photos (UPDATE)
--    - Authenticated users can delete lead photos (DELETE)
--
-- 3. Backend service should connect successfully when:
--    - SUPABASE_URL is set
--    - SUPABASE_SERVICE_ROLE_KEY is set
--
-- ============================================================
-- TESTING THE SETUP
-- ============================================================
-- Test bucket health from backend:
-- GET https://upbeat-dedication-production.up.railway.app/api/public/upload/storage-health
--
-- Expected response:
-- {
--   "success": true,
--   "message": "Supabase Storage is healthy",
--   "data": {
--     "bucketName": "lead-photos",
--     "bucketExists": true,
--     "bucketPublic": true
--   }
-- }
--
-- ============================================================
-- END OF SCRIPT
-- ============================================================
