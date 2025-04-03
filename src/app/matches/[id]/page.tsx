import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MatchDetails } from "@/components/matches/match-details"
import { MatchPlayers } from "@/components/matches/match-players"
import { MatchActions } from "@/components/matches/match-actions"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient()

  const { data: match } = await supabase.from("matches").select("*").eq("id", params.id).single()

  return {
    title: match ? `Partido ${match.match_date}` : "Partido",
    description: "Detalles del partido de pádel",
  }
}

export default async function MatchPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener detalles del partido
  const { data: match } = await supabase
    .from("matches")
    .select(`
      *,
      courts:courts(
        id,
        name,
        clubs:clubs(
          id,
          name,
          address,
          city
        )
      ),
      creator:profiles(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("id", params.id)
    .single()

  if (!match) {
    redirect("/matches")
  }

  // Obtener jugadores del partido
  const { data: matchPlayers } = await supabase
    .from("match_players")
    .select(`
      *,
      players:profiles(
        id,
        full_name,
        avatar_url,
        players(
          position,
          category,
          average_rating
        )
      )
    `)
    .eq("match_id", params.id)
    .order("created_at", { ascending: true })

  // Obtener resultado del partido si existe
  const { data: matchResult } = await supabase.from("match_results").select("*").eq("match_id", params.id).single()

  // Verificar si el usuario actual está en el partido
  const userInMatch = matchPlayers?.find((player) => player.player_id === session.user.id)

  // Verificar si el usuario es el creador del partido
  const isCreator = match.creator_id === session.user.id

  // Verificar si el partido está completo (4 jugadores confirmados)
  const isMatchFull = matchPlayers?.filter((player) => player.status === "confirmed").length === 4

  // Verificar si el partido ya ha pasado
  const isPastMatch = new Date(`${match.match_date}T${match.end_time}`) < new Date()

  return (
    <div className="container py-10">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <MatchDetails match={match} result={matchResult} />
          <MatchPlayers
            players={matchPlayers || []}
            matchId={params.id}
            isCreator={isCreator}
            userId={session.user.id}
            isPastMatch={isPastMatch}
          />
        </div>
        <div>
          <MatchActions
            match={match}
            userInMatch={userInMatch}
            isCreator={isCreator}
            isMatchFull={isMatchFull}
            isPastMatch={isPastMatch}
            userId={session.user.id}
          />
        </div>
      </div>
    </div>
  )
}

