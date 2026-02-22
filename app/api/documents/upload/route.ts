import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni za nalaganje dokumentov' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const conversationId = formData.get('conversationId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'Datoteka ni bila poslana' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Nepodprt format datoteke' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Datoteka je prevelika (max 10MB)' },
        { status: 400 }
      )
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('legal-documents')
      .upload(fileName, file)

    if (uploadError) {
      return NextResponse.json(
        { error: 'Nalaganje ni uspelo' },
        { status: 500 }
      )
    }

    // Save metadata to database
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        conversation_id: conversationId,
        file_name: file.name,
        file_path: fileName,
        file_type: file.type,
        file_size: file.size,
      })
      .select()
      .single()

    if (dbError) {
      // Cleanup uploaded file if database insert fails
      await supabase.storage.from('legal-documents').remove([fileName])
      return NextResponse.json(
        { error: 'Shranjevanje podatkov ni uspelo' },
        { status: 500 }
      )
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Prišlo je do napake' },
      { status: 500 }
    )
  }
}
