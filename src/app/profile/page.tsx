import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"

export const metadata: Metadata = {
  title: "Perfil",
  description: "Gestiona tu perfil de jugador",
}

export default async function ProfilePage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Obtener datos del jugador
  const { data: player } = await supabase.from("players").select("*").eq("id", session.user.id).single()

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

        <ProfileForm profile={profile || {}} player={player || {}} />
      </div>
    </div>
  )
}

