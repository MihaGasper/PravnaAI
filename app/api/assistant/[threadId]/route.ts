import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai/client'
import { createClient } from '@/lib/supabase/server'

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params
    const body = await request.json()
    const { message, conversationId } = body

    if (!ASSISTANT_ID) {
      return NextResponse.json(
        { error: 'OpenAI Assistant ni konfiguriran' },
        { status: 500 }
      )
    }

    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Add message to existing thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    })

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)

    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Run ${runStatus.status}`)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    }

    // Get the latest messages
    const messages = await openai.beta.threads.messages.list(threadId, { limit: 1 })
    const assistantMessage = messages.data[0]

    let responseText = ''
    if (assistantMessage?.content[0]?.type === 'text') {
      responseText = assistantMessage.content[0].text.value
    }

    // Save messages if user is authenticated
    if (user && conversationId) {
      await supabase.from('messages').insert([
        {
          conversation_id: conversationId,
          role: 'user',
          content: message,
        },
        {
          conversation_id: conversationId,
          role: 'assistant',
          content: responseText,
        },
      ])
    }

    return NextResponse.json({
      response: responseText,
    })
  } catch {
    return NextResponse.json(
      { error: 'Prišlo je do napake pri obdelavi zahteve' },
      { status: 500 }
    )
  }
}
