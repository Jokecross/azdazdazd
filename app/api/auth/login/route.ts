import { createClient } from '@/lib/supabase/route-handler'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('🔐 API Login - Début')
    
    const body = await request.json()
    console.log('🔐 Body reçu:', { email: body.email, hasPassword: !!body.password })

    const { email, password } = body

    console.log('🔐 Création client Supabase...')
    const supabase = await createClient()
    console.log('✅ Client créé')

    console.log('🔐 Appel signInWithPassword...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('🔐 Résultat login:', { 
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      error: error?.message 
    })

    if (error) {
      console.error('❌ Erreur login:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('✅ Login réussi !')
    return NextResponse.json({ success: true, user: data.user })
  } catch (err: any) {
    console.error('❌ Erreur serveur login:', err)
    return NextResponse.json({ 
      error: err.message || 'Erreur serveur' 
    }, { status: 500 })
  }
}
