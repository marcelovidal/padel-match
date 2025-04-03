import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PlayerInviteForm } from "@/components/matches/player-invite-form"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient()

  const { data: match } = await supabase.from("matches").select("*").eq("id", params.id).single()

  return {
    title: match ? `Invitar Jugadores - ${match.match_date}` : "Invitar Jugadores",
    description: "Invita jugadores a tu partido de pádel",
  }
}

export default async function InvitePlayersPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener detalles del partido
  const { data: match } = await supabase.from("matches").select("*").eq("id", params.id).single()

  if (!match) {
    redirect("/matches")
  }

  // Verificar si el usuario es el creador del partido
  if (match.creator_id !== session.user.id) {
    redirect(`/matches/${params.id}`)
  }

  // Obtener jugadores ya invitados
  const { data: invitedPlayers } = await supabase.from("match_players").select("player_id").eq("match_id", params.id)

  const invitedPlayerIds = invitedPlayers?.map((player) => player.player_id) || []

  // Obtener jugadores disponibles para invitar (excluyendo los ya invitados)
  const { data: availablePlayers } = await supabase
    .from("players")
    .select(`
      *,
      profiles:profiles(
        id,
        full_name,
        avatar_url
      )
    `)
    .not("id", "in", `(${invitedPlayerIds.join(",")})`)
    .order("average_rating", { ascending: false })

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Invitar Jugadores</h1>
        <p className="text-muted-foreground mb-8">Invita jugadores a tu partido del {match.match_date}</p>

        <PlayerInviteForm matchId={params.id} availablePlayers={availablePlayers || []} />
      </div>
    </div>
  )
}

