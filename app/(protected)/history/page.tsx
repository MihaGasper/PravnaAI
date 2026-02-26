import Link from 'next/link'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ConversationList } from '@/components/pravna/ConversationList'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Nazaj na nadzorno ploščo
        </Link>

        <div className="mb-8">
          <h1 className="font-serif text-2xl text-foreground mb-2">
            Zgodovina pogovorov
          </h1>
          <p className="text-sm text-muted-foreground">
            Vsi vaši pretekli pravni pogovori
          </p>
        </div>

        {conversations && conversations.length > 0 ? (
          <ConversationList conversations={conversations} />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Ni pogovorov
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Vaši pogovori bodo prikazani tukaj
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              Začni nov pogovor
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
