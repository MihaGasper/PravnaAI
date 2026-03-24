import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { BlogArticle } from '@/lib/blog/articles'

export const metadata: Metadata = {
  title: 'Pravni nasveti in vodniki',
  description: 'Brezplačni pravni nasveti, vodniki in članki o slovenskem pravu. Dedovanje, delovno pravo, ločitev, nepremičnine in več.',
  keywords: [
    'pravni nasveti',
    'pravni blog',
    'slovensko pravo',
    'brezplačna pravna pomoč',
    'pravni vodnik',
    'AI odvetnik blog',
  ],
  alternates: {
    canonical: 'https://aiodvetnik.si/blog',
  },
  openGraph: {
    title: 'Pravni nasveti in vodniki | AI-Odvetnik',
    description: 'Brezplačni pravni nasveti, vodniki in članki o slovenskem pravu.',
    type: 'website',
    locale: 'sl_SI',
    url: 'https://aiodvetnik.si/blog',
  },
}

export const revalidate = 3600 // revalidate every hour

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('blog_posts')
    .select('slug, title, description, category, reading_time, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-3xl text-foreground mb-3">
            Pravni nasveti
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Praktični pravni nasveti, vodniki in članki, ki vam pomagajo
            razumeti vaše pravice in obveznosti v slovenskem pravnem sistemu.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {(articles as Pick<BlogArticle, 'slug' | 'title' | 'description' | 'category' | 'reading_time' | 'published_at'>[] | null)?.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-center gap-3 mb-3">
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

              <h2 className="font-serif text-xl text-foreground mb-2 group-hover:text-accent transition-colors">
                {article.title}
              </h2>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {article.description}
              </p>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                Preberi več
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}

          {(!articles || articles.length === 0) && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Članki bodo kmalu na voljo.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
