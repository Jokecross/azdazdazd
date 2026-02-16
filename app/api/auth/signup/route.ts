import { createClient } from '@/lib/supabase/route-handler'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('📝 API Signup - Début')
    
    const body = await request.json()
    console.log('📝 Body reçu:', { email: body.email, hasPassword: !!body.password })

    const { email, password, fullName } = body

    console.log('📝 Création client Supabase...')
    const supabase = await createClient()
    console.log('✅ Client créé')

    console.log('📝 Appel signUp...')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    console.log('📝 Résultat signUp:', { 
      hasUser: !!data?.user, 
      hasSession: !!data?.session,
      error: error?.message 
    })

    if (error) {
      console.error('❌ Erreur signup:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Vérifier si l'email doit être confirmé
    if (data?.user && !data.session) {
      return NextResponse.json({ 
        error: 'Vérifiez votre email pour confirmer votre compte.' 
      }, { status: 400 })
    }

    console.log('✅ Signup réussi !')
    return NextResponse.json({ success: true, user: data.user })
  } catch (err: any) {
    console.error('❌ Erreur serveur signup:', err)
    return NextResponse.json({ 
      error: err.message || 'Erreur serveur' 
    }, { status: 500 })
  }
}
