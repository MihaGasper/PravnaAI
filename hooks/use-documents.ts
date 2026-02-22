'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthContext } from '@/components/auth/AuthProvider'
import type { Database } from '@/lib/types/database.types'

type Document = Database['public']['Tables']['documents']['Row']

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function useDocuments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthContext()
  const supabase = createClient()

  const uploadDocument = useCallback(async (
    file: File,
    conversationId?: string
  ): Promise<Document | null> => {
    if (!user) {
      setError('Morate biti prijavljeni za nalaganje dokumentov')
      return null
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Nepodprt format datoteke. Dovoljeni so: PDF, DOCX, JPG, PNG, WEBP')
      return null
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Datoteka je prevelika. Največja dovoljena velikost je 10MB')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('legal-documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Save metadata to database
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          conversation_id: conversationId,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single()

      if (dbError) throw dbError

      return document
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nalaganje ni uspelo')
      return null
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const getDocuments = useCallback(async (conversationId?: string): Promise<Document[]> => {
    if (!user) return []

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (conversationId) {
        query = query.eq('conversation_id', conversationId)
      }

      const { data, error: err } = await query

      if (err) throw err
      return data || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents')
      return []
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const getDocumentUrl = useCallback(async (filePath: string): Promise<string | null> => {
    try {
      const { data } = await supabase.storage
        .from('legal-documents')
        .createSignedUrl(filePath, 3600) // 1 hour expiry

      return data?.signedUrl || null
    } catch (err) {
      console.error('Failed to get document URL:', err)
      return null
    }
  }, [supabase])

  const deleteDocument = useCallback(async (id: string, filePath: string): Promise<boolean> => {
    if (!user) return false

    setLoading(true)
    setError(null)

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('legal-documents')
        .remove([filePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (dbError) throw dbError

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Brisanje ni uspelo')
      return false
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  return {
    loading,
    error,
    uploadDocument,
    getDocuments,
    getDocumentUrl,
    deleteDocument,
  }
}
