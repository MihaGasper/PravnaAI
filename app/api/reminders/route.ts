import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 })
    }

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_completed', false)
      .order('due_date', { ascending: true })

    if (error) throw error

    return NextResponse.json({ reminders: reminders || [] })
  } catch (error) {
    console.error('Get reminders error:', error)
    return NextResponse.json(
      { error: 'Napaka pri pridobivanju opomnikov' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, due_date, conversation_id } = body

    if (!title || !due_date) {
      return NextResponse.json(
        { error: 'Naslov in datum sta obvezna' },
        { status: 400 }
      )
    }

    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert({
        user_id: user.id,
        title,
        description,
        due_date,
        conversation_id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ reminder })
  } catch (error) {
    console.error('Create reminder error:', error)
    return NextResponse.json(
      { error: 'Napaka pri ustvarjanju opomnika' },
      { status: 500 }
    )
  }
}
