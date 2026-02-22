'use client'

import { useState } from 'react'
import { MessageSquare, Trash2, Calendar } from 'lucide-react'
import { useConversation } from '@/hooks/use-conversation'
import type { Database } from '@/lib/types/database.types'

type Conversation = Database['public']['Tables']['conversations']['Row']

interface ConversationListProps {
  conversations: Conversation[]
}

const CATEGORY_LABELS: Record<string, string> = {
  stanovanje: 'Stanovanje',
  delo: 'Delo',
  druzina: 'Družina',
  promet: 'Promet',
  dolgovi: 'Dolgovi',
  podjetnistvo: 'Podjetništvo',
  dedovanje: 'Dedovanje',
  potrosniki: 'Potrošniki',
}

const CATEGORY_ICONS: Record<string, string> = {
  stanovanje: '🏠',
  delo: '💼',
  druzina: '👨‍👩‍👧',
  promet: '🚗',
  dolgovi: '💰',
  podjetnistvo: '🏢',
  dedovanje: '📋',
  potrosniki: '🛒',
}

export function ConversationList({ conversations: initialConversations }: ConversationListProps) {
  const [conversations, setConversations] = useState(initialConversations)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { deleteConversation } = useConversation()

  const handleDelete = async (id: string) => {
    if (!confirm('Ali ste prepričani, da želite izbrisati ta pogovor?')) return

    setDeleting(id)
    const success = await deleteConversation(id)
    if (success) {
      setConversations(conversations.filter(c => c.id !== id))
    }
    setDeleting(null)
  }

  const groupedConversations = conversations.reduce((acc, conv) => {
    const date = new Date(conv.created_at).toLocaleDateString('sl-SI', {
      year: 'numeric',
      month: 'long',
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(conv)
    return acc
  }, {} as Record<string, Conversation[]>)

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(groupedConversations).map(([date, convs]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
          </div>

          <div className="flex flex-col gap-2">
            {convs.map((conv) => (
              <div
                key={conv.id}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg">
                  {CATEGORY_ICONS[conv.category] || '📋'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {conv.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {CATEGORY_LABELS[conv.category] || conv.category}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.created_at).toLocaleDateString('sl-SI')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(conv.id)}
                  disabled={deleting === conv.id}
                  className="opacity-0 group-hover:opacity-100 w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
                  aria-label="Izbriši pogovor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
