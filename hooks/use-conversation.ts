'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthContext } from '@/components/auth/AuthProvider'
import type { Database } from '@/lib/types/database.types'

type Conversation = Database['public']['Tables']['conversations']['Row']
type Message = Database['public']['Tables']['messages']['Row']

export function useConversation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthContext()
  const supabase = createClient()

  const createConversation = useCallback(async (data: {
    title: string
    category: string
    role?: string
    problem?: string
    duration?: string
    details?: string
  }): Promise<Conversation | null> => {
    if (!user) return null

    setLoading(true)
    setError(null)

    try {
      const { data: conversation, error: err } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: data.title,
          category: data.category,
          role: data.role,
          problem: data.problem,
          duration: data.duration,
          details: data.details,
        })
        .select()
        .single()

      if (err) throw err
      return conversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation')
      return null
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const getConversations = useCallback(async (): Promise<Conversation[]> => {
    if (!user) return []

    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (err) throw err
      return data || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
      return []
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const getConversation = useCallback(async (id: string): Promise<Conversation | null> => {
    if (!user) return null

    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (err) throw err
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation')
      return null
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const getMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    if (!user) return []

    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (err) throw err
      return data || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
      return []
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const addMessage = useCallback(async (
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<Message | null> => {
    if (!user) return null

    try {
      const { data, error: err } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
        })
        .select()
        .single()

      if (err) throw err
      return data
    } catch (err) {
      console.error('Failed to add message:', err)
      return null
    }
  }, [user, supabase])

  const deleteConversation = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false

    setLoading(true)
    setError(null)

    try {
      const { error: err } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (err) throw err
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation')
      return false
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  return {
    loading,
    error,
    createConversation,
    getConversations,
    getConversation,
    getMessages,
    addMessage,
    deleteConversation,
  }
}
