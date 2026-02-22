import Link from 'next/link'
import { Scale, MessageSquare, FileText, Clock, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get recent conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get document count
  const { count: documentCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const stats = [
    {
      label: 'Pogovori',
      value: conversations?.length || 0,
      icon: MessageSquare,
    },
    {
      label: 'Dokumenti',
      value: documentCount || 0,
      icon: FileText,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-lg border-b border-border/60">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-accent" />
            <span className="font-serif text-base font-medium text-foreground">PravnaAI</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-2xl text-foreground mb-2">
            Dobrodošli nazaj
          </h1>
          <p className="text-sm text-muted-foreground">
            {user?.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-foreground mb-4">
            Hitri dostop
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Nov pogovor</p>
                <p className="text-xs text-muted-foreground">Začni novo pravno vprašanje</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Clock className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Zgodovina</p>
                <p className="text-xs text-muted-foreground">Preglej pretekle pogovore</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Recent Conversations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">
              Nedavni pogovori
            </h2>
            {conversations && conversations.length > 0 && (
              <Link
                href="/history"
                className="text-xs text-accent hover:underline"
              >
                Prikaži vse
              </Link>
            )}
          </div>

          {conversations && conversations.length > 0 ? (
            <div className="flex flex-col gap-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(conv.created_at).toLocaleDateString('sl-SI')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Še nimate pogovorov
              </p>
              <Link
                href="/"
                className="inline-block mt-3 text-xs text-accent hover:underline"
              >
                Začnite prvi pogovor
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
