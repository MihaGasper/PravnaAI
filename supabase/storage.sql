-- Storage bucket setup for legal documents
-- Run this in Supabase SQL Editor AFTER the main migration

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('legal-documents', 'legal-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage

-- Allow users to upload files to their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'legal-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own files
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'legal-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'legal-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own files
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'legal-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
