import { openai } from '@/lib/openai/client'
import { SYSTEM_PROMPT, buildUserPrompt, buildFollowUpPrompt } from '@/lib/openai/prompts'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      category,
      role,
      problem,
      duration,
      details,
      conversationId,
      followUpQuestion,
      messages = []
    } = body

    // Check authentication - required
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Za uporabo te funkcije se morate prijaviti' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check quota - use database function
    const { data: canQuery } = await supabase.rpc('can_user_query', {
      p_user_id: user.id
    })

    if (!canQuery) {
      const { data: remaining } = await supabase.rpc('get_remaining_queries', {
        p_user_id: user.id
      })

      return new Response(
        JSON.stringify({
          error: 'Dosegli ste dnevno omejitev poizvedb. Nadgradite svoj paket za več poizvedb.',
          quotaExceeded: true,
          remaining: remaining || 0
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let userPrompt: string

    if (followUpQuestion) {
      // Follow-up question in existing conversation
      userPrompt = buildFollowUpPrompt(messages, followUpQuestion)
    } else {
      // Initial analysis
      userPrompt = buildUserPrompt({ category, role, problem, duration, details })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      stream: true,
      max_tokens: 2000,
      temperature: 0.7,
    })

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        let fullContent = ''

        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || ''
          fullContent += content
          controller.enqueue(encoder.encode(content))
        }

        // Save to database if user is authenticated
        if (user && conversationId) {
          // Save assistant message
          await supabase.from('messages').insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: fullContent,
          })

          // Track token usage (estimate)
          const estimatedTokens = Math.ceil((userPrompt.length + fullContent.length) / 4)
          await supabase.from('token_usage').insert({
            user_id: user.id,
            conversation_id: conversationId,
            prompt_tokens: Math.ceil(userPrompt.length / 4),
            completion_tokens: Math.ceil(fullContent.length / 4),
            total_tokens: estimatedTokens,
            model: 'gpt-4o',
          })

          // Increment daily usage
          await supabase.rpc('increment_user_usage', {
            p_user_id: user.id
          })
        }

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Prišlo je do napake pri obdelavi zahteve' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
