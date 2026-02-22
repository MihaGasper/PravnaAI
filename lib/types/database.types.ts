export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          role: string | null
          problem: string | null
          duration: string | null
          details: string | null
          thread_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: string
          role?: string | null
          problem?: string | null
          duration?: string | null
          details?: string | null
          thread_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string
          role?: string | null
          problem?: string | null
          duration?: string | null
          details?: string | null
          thread_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          conversation_id: string | null
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          conversation_id?: string | null
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          conversation_id?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          file_size?: number
          created_at?: string
        }
      }
      token_usage: {
        Row: {
          id: string
          user_id: string
          conversation_id: string | null
          prompt_tokens: number
          completion_tokens: number
          total_tokens: number
          model: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          conversation_id?: string | null
          prompt_tokens: number
          completion_tokens: number
          total_tokens: number
          model: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          conversation_id?: string | null
          prompt_tokens?: number
          completion_tokens?: number
          total_tokens?: number
          model?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
