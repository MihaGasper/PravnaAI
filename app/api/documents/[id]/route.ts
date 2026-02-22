import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Niste prijavljeni' },
        { status: 401 }
      )
    }

    // Get document metadata
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !document) {
      return NextResponse.json(
        { error: 'Dokument ni bil najden' },
        { status: 404 }
      )
    }

    // Generate signed URL
    const { data: urlData } = await supabase.storage
      .from('legal-documents')
      .createSignedUrl(document.file_path, 3600) // 1 hour

    return NextResponse.json({
      document,
      signedUrl: urlData?.signedUrl,
    })
  } catch (error) {
    console.error('Get document error:', error)
    return NextResponse.json(
      { error: 'Prišlo je do napake' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Niste prijavljeni' },
        { status: 401 }
      )
    }

    // Get document to find file path
    const { data: document } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!document) {
      return NextResponse.json(
        { error: 'Dokument ni bil najden' },
        { status: 404 }
      )
    }

    // Delete from storage
    await supabase.storage
      .from('legal-documents')
      .remove([document.file_path])

    // Delete from database
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Brisanje ni uspelo' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json(
      { error: 'Prišlo je do napake' },
      { status: 500 }
    )
  }
}
