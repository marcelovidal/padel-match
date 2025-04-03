import { createClient } from "@/lib/supabase/client"
import { Database } from '@/types/supabase'

type UserRole = 'player' | 'club_owner'
type PlayerPosition = 'drive' | 'reves' | 'ambas'
type PlayerCategory = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'

export async function signUp({
  email,
  password,
  firstName,
  lastName,
  fullName,
  phone,
  role,
  position,
  category,
}: {
  email: string
  password: string
  firstName: string
  lastName: string
  fullName: string
  phone: string | null
  role: UserRole
  position?: PlayerPosition
  category?: PlayerCategory
}) {
  const supabase = createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
        role: role,
      },
    },
  })

  if (authError) {
    return { success: false, error: authError }
  }

  // Si es jugador, crear el registro en la tabla players
  if (role === 'player' && authData.user) {
    const { error: playerError } = await supabase
      .from('players')
      .insert([
        {
          id: authData.user.id,
          position: position || 'ambas',
          category: category || '5',
        },
      ])

    if (playerError) {
      return { success: false, error: playerError }
    }
  }

  return { success: true, data: authData }
}

export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error }
  }

  // Obtener el rol del usuario
  const userRole = data.user.user_metadata.role as UserRole

  return { 
    success: true, 
    data,
    role: userRole
  }
}

export async function signOut() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error }
  }

  return { success: true }
} 