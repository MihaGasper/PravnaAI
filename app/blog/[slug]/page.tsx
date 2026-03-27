import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, Calendar, Scale, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { BlogArticle, BlogSection } from '@/lib/blog/articles'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_posts')
    .select('title, description, keywords, published_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  const article = data as unknown as Pick<BlogArticle, 'title' | 'description' | 'keywords' | 'published_at'> | null
  if (!article) return {}

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      siteName: 'AI-Odvetnik',
      locale: 'sl_SI',
      url: `https://aiodvetnik.si/blog/${slug}`,
    },
    twitter: {
      card: 'summary',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `https://aiodvetnik.si/blog/${slug}`,
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

function buildFaqJsonLd(sections: BlogSection[]) {
  const faqItems: { question: string; answer: string }[] = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    // Detect FAQ-style paragraphs (start with question pattern)
    if (
      section.type === 'paragraph' &&
      (section.content.startsWith('Ali ') ||
        section.content.startsWith('Kako ') ||
        section.content.startsWith('Kdaj ') ||
        section.content.startsWith('Koliko ') ||
        section.content.startsWith('Kdo ') ||
        section.content.startsWith('Kaj '))
    ) {
      const questionMatch = section.content.match(/^([^?]+\?)/)
      if (questionMatch) {
        const question = questionMatch[1]
        const answer = section.content.slice(question.length).trim()
        if (answer) {
          faqItems.push({ question, answer })
        }
      }
    }
  }

  if (faqItems.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
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

  // Fetch related articles (same category, exclude current)
  const { data: relatedData } = await supabase
    .from('blog_posts')
    .select('slug, title, category, reading_time, published_at')
    .eq('published', true)
    .neq('slug', slug)
    .limit(3)

  const relatedArticles = (relatedData || []) as unknown as Pick<BlogArticle, 'slug' | 'title' | 'category' | 'reading_time' | 'published_at'>[]

  // Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Organization',
      name: 'AI-Odvetnik',
      url: 'https://aiodvetnik.si',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI-Odvetnik',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aiodvetnik.si/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://aiodvetnik.si/blog/${slug}`,
    },
    inLanguage: 'sl',
    keywords: article.keywords?.join(', '),
  }

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Domov',
        item: 'https://aiodvetnik.si',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Nasveti',
        item: 'https://aiodvetnik.si/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://aiodvetnik.si/blog/${slug}`,
      },
    ],
  }

  // FAQ JSON-LD
  const faqJsonLd = buildFaqJsonLd(article.content)

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Domov</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-accent transition-colors">Nasveti</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/70 truncate max-w-[200px]">{article.title}</span>
        </nav>

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

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-border mt-12 pt-8">
            <h2 className="text-sm font-medium text-foreground mb-4">Povezani članki</h2>
            <div className="flex flex-col gap-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                      {related.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{related.category}</span>
                      <span className="text-xs text-muted-foreground">{related.reading_time}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 ml-3 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border mt-8 pt-8">
          <p className="text-xs text-muted-foreground">
            Ta članek je informativne narave in ne predstavlja pravnega svetovanja.
            Za konkretne pravne nasvete se posvetujte z odvetnikom.
          </p>
        </div>
      </main>
    </div>
  )
}
