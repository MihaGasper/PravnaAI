import { NextResponse } from 'next/server'
import { openai, ASSISTANT_ID } from '@/lib/openai/client'
import { createClient } from '@/lib/supabase/server'
import { buildUserPrompt } from '@/lib/openai/prompts'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, role, problem, duration, details, conversationId } = body

    if (!ASSISTANT_ID) {
      return NextResponse.json(
        { error: 'OpenAI Assistant ni konfiguriran' },
        { status: 500 }
      )
    }

    // Check authentication - required
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Za uporabo te funkcije se morate prijaviti' },
        { status: 401 }
      )
    }

    // Create a new thread
    const thread = await openai.beta.threads.create()

    // Build the user message
    const userPrompt = buildUserPrompt({ category, role, problem, duration, details })

    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: userPrompt,
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    })

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)

    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Run ${runStatus.status}`)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    }

    // Get messages
    const messages = await openai.beta.threads.messages.list(thread.id)
    const assistantMessage = messages.data.find(m => m.role === 'assistant')

    let responseText = ''
    if (assistantMessage?.content[0]?.type === 'text') {
      responseText = assistantMessage.content[0].text.value
    }

    // Update conversation with thread_id if user is authenticated
    if (user && conversationId) {
      await supabase
        .from('conversations')
        .update({ thread_id: thread.id })
        .eq('id', conversationId)

      // Save messages
      await supabase.from('messages').insert([
        {
          conversation_id: conversationId,
          role: 'user',
          content: userPrompt,
        },
        {
          conversation_id: conversationId,
          role: 'assistant',
          content: responseText,
        },
      ])
    }

    return NextResponse.json({
      threadId: thread.id,
      response: responseText,
    })
  } catch (error) {
    console.error('Assistant API error:', error)
    return NextResponse.json(
      { error: 'Prišlo je do napake pri obdelavi zahteve' },
      { status: 500 }
    )
  }
}
