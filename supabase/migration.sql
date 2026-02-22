-- PravnaAI Database Migration
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  role TEXT,
  problem TEXT,
  duration TEXT,
  details TEXT,
  thread_id TEXT, -- OpenAI Assistant thread ID
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Token usage tracking table
CREATE TABLE IF NOT EXISTS public.token_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_conversation_id ON public.documents(conversation_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_user_id ON public.token_usage(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for conversations
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.conversations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in own conversations"
  ON public.messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.user_id = auth.uid()
  ));

CREATE POLICY "Users can create messages in own conversations"
  ON public.messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.user_id = auth.uid()
  ));

-- RLS Policies for documents
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for token_usage
CREATE POLICY "Users can view own token usage"
  ON public.token_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert token usage"
  ON public.token_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup (create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
