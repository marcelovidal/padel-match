import { createClient } from "@/lib/supabase/client"
import { Database } from '@/types/supabase'

type User = Database['public']['Tables']['users']['Row']

export async function signUp({
  email,
  password,
  firstName,
  lastName,
  fullName,
}: {
  email: string
  password: string
  firstName: string
  lastName: string
  fullName: string
}) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { success: false, error }
  }

  return { success: true, data }
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

  return { success: true, data }
}

export async function signOut() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error }
  }

  return { success: true }
} 