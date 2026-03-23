export interface BlogSection {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'cta'
  content: string
  items?: string[]
}

export interface BlogArticle {
  id: string
  slug: string
  title: string
  description: string
  content: BlogSection[]
  category: string
  keywords: string[]
  reading_time: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
