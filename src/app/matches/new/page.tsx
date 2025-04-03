import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MatchForm } from "@/components/matches/match-form"

export const metadata: Metadata = {
  title: "Crear Partido",
  description: "Crea un nuevo partido de pádel",
}

export default async function NewMatchPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener clubes para el selector
  const { data: clubs } = await supabase
    .from("clubs")
    .select("id, name, address, city")
    .order("name", { ascending: true })

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Crear Nuevo Partido</h1>
        <MatchForm userId={session.user.id} clubs={clubs || []} />
      </div>
    </div>
  )
}

