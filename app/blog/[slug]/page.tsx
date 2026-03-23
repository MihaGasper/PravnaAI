import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar, Scale } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { BlogArticle, BlogSection } from '@/lib/blog/articles'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('blog_posts')
    .select('title, description, keywords, published_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!article) return {}

  return {
    title: `${article.title} | AI-Odvetnik`,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      siteName: 'AI-Odvetnik',
    },
  }
}

function renderSection(section: BlogSection, index: number) {
  switch (section.type) {
    case 'heading':
      return (
        <h2 key={index} className="text-xl font-semibold text-foreground mt-8 mb-4">
          {section.content}
        </h2>
      )
    case 'paragraph':
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {section.content}
        </p>
      )
    case 'list':
      return (
        <div key={index} className="mb-4">
          <p className="text-muted-foreground font-medium mb-2">{section.content}</p>
          <ul className="space-y-2 pl-5">
            {section.items?.map((item, i) => (
              <li key={i} className="text-muted-foreground leading-relaxed list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )
    case 'quote':
      return (
        <blockquote key={index} className="border-l-2 border-accent pl-4 my-6 italic text-muted-foreground">
          {section.content}
        </blockquote>
      )
    case 'cta':
      return (
        <div key={index} className="rounded-xl border border-accent/30 bg-accent/5 p-6 my-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-foreground font-medium mb-3">{section.content}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-accent text-background text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Preizkusite brezplačno
              </Link>
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) {
    notFound()
  }

  const article = data as unknown as BlogArticle

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Nazaj na nasvete
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                {article.category}
              </span>
              {article.published_at && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.published_at).toLocaleDateString('sl-SI', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {article.reading_time}
              </span>
            </div>

            <h1 className="font-serif text-3xl text-foreground mb-4">
              {article.title}
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {article.description}
            </p>
          </header>

          <div className="border-t border-border pt-8">
            {article.content.map((section, index) => renderSection(section, index))}
          </div>
        </article>

        <div className="border-t border-border mt-12 pt-8">
          <p className="text-xs text-muted-foreground">
            Ta članek je informativne narave in ne predstavlja pravnega svetovanja.
            Za konkretne pravne nasvete se posvetujte z odvetnikom.
          </p>
        </div>
      </main>
    </div>
  )
}
