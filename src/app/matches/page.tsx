import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { MatchesList } from "@/components/matches/matches-list"
import { MatchesFilter } from "@/components/matches/matches-filter"
import { PlusIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Partidos",
  description: "Encuentra y organiza partidos de pádel",
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: { level?: string; date?: string; status?: string }
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Filtros
  const level = searchParams.level
  const date = searchParams.date
  const status = searchParams.status || "all"

  // Construir la consulta base
  let matchesQuery = supabase
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
      ),
      match_players(
        id,
        player_id,
        status,
        players:profiles(
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .gte("match_date", new Date().toISOString().split("T")[0])
    .order("match_date", { ascending: true })

  // Aplicar filtros
  if (level) {
    matchesQuery = matchesQuery.eq("level", level)
  }

  if (date) {
    matchesQuery = matchesQuery.eq("match_date", date)
  }

  // Ejecutar la consulta
  const { data: matches } = await matchesQuery

  // Filtrar por estado si es necesario
  let filteredMatches = matches || []

  if (status === "my") {
    // Mis partidos (creados por mí o donde participo)
    filteredMatches = filteredMatches.filter(
      (match) =>
        match.creator_id === session.user.id ||
        match.match_players.some((player) => player.player_id === session.user.id),
    )
  } else if (status === "available") {
    // Partidos disponibles (donde no participo y hay plazas)
    filteredMatches = filteredMatches.filter(
      (match) =>
        match.creator_id !== session.user.id &&
        !match.match_players.some((player) => player.player_id === session.user.id) &&
        match.match_players.filter((player) => player.status === "confirmed").length < 4,
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Partidos</h1>
          <p className="text-muted-foreground mt-1">Encuentra y organiza partidos de pádel</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/matches/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Crear Partido
          </Link>
        </Button>
      </div>

      <MatchesFilter />

      <div className="mt-6">
        <MatchesList matches={filteredMatches} userId={session.user.id} />
      </div>
    </div>
  )
}

